from flask import Flask, jsonify, request
import cv2
import numpy as np
from keras.models import load_model
import os
from collections import Counter
import threading
import base64

app = Flask(__name__)
model = load_model('model/video_classification_model.h5')

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define the preprocess_frame function
def preprocess_frame(frame):
    # Resize the frame to the desired input size (e.g., 64x64 pixels)
    resized_frame = cv2.resize(frame, (244, 224))
    
    # Normalize pixel values to the range [0, 1]
    normalized_frame = resized_frame / 255.0
    
    return normalized_frame


# Define a route to get all tasks
@app.route('/api/test', methods=['POST'])
def test_route():
    
    # Check if a file is included in the request
    if 'file' not in request.form:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.form['file']
    videoName = request.form['video_name']

    file_content = base64.b64decode(file)

    with open(videoName, 'wb') as video_file:
        video_file.write(file_content)


    return jsonify({'vidoe_type': "sdsad"})


# Define a route to get all tasks
@app.route('/api/get-video-category', methods=['POST'])
def get_video_category():

    # Use a lock to ensure thread safety when accessing shared data (tasks)
    lock = threading.Lock()
    with lock:
        # Check if a file is included in the request
        if 'file' not in request.form:
            return jsonify({'message': 'No file part', 'error': True}), 400

        file = request.form['file']

        file = request.form['file']
        videoName = request.form['video_name']

        file_content = base64.b64decode(file)

        with open(os.path.join(app.config['UPLOAD_FOLDER'], videoName), 'wb') as video_file:
            video_file.write(file_content)


        # Check if the file has a filename
        if videoName == '':
            return jsonify({'message': 'No selected file', 'error': True}), 400


        video_path = os.path.join(app.config['UPLOAD_FOLDER'], videoName)
        cap = cv2.VideoCapture(video_path)

        # Get video properties
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # Define a list to store class labels for each frame
        class_labels = []

        # Set a step size to skip frames (in this case, every 10th frame)
        step = 60

        # Loop through frames with the specified step size
        for i in range(0, frame_count, step):
            # Set the frame position to the current frame
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)

            ret, frame = cap.read()
            if not ret:
                break  # Break the loop when no more frames are available

            # Preprocess the frame
            preprocessed_frame = preprocess_frame(frame)

            # Expand dimensions to match model input shape (assuming preprocessed_frame is a single frame)
            preprocessed_frame = np.expand_dims(preprocessed_frame, axis=0)

            # Predict the class for the frame
            prediction = model.predict(preprocessed_frame)
            predicted_class = np.argmax(prediction)

            class_labels.append(predicted_class)

        # Release the video capture object
        cap.release()

        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], videoName))

        class_labels = [int(label) for label in class_labels]

        # Use Counter to count occurrences of each number
        number_counts = Counter(class_labels)

        # Find the most common number and its count
        most_common_number, counts = number_counts.most_common(1)[0]

        # You can save the file to a specific location or process it as needed
        # For example, let's just return the filename
        return jsonify({'video_type': most_common_number, 'error': False})


if __name__ == '__main__':
    app.run(debug=True, port=6200)