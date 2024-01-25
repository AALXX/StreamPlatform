import numpy as np
import keras
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from keras.optimizers import Adam
from keras.preprocessing.image import ImageDataGenerator
import os

train_data_directory = r'data_images'
epochs = 10
model = Sequential()

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255.0,
    rotation_range=15,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

train_generator = train_datagen.flow_from_directory(
    train_data_directory,
    target_size=(224, 244),  # Adjust the target size as needed
    batch_size=32,
    class_mode='categorical'
)

os.system('clear')

def main_menu():
    while True:
        print("\nMain Menu:")
        print("1. create and compile model")
        print("2. train the model")
        print("3. evaluate the model")
        print("4. save the model")
        print("5. Quit")
        
        choice = input("Enter your command: ")
        
        if choice == '1':
            createAndCompile()
        elif choice == '2':
            TrainModel()
        elif choice == '3':
            EvaluateModel()
        elif choice == '4':
            SaveModel()
        elif choice == '5':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please select a valid option.")

def createAndCompile():
    print("")
    print("started creating the model")

    num_classes = len(train_generator.class_indices)

    # Step 3: Build the Model

    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(224, 244, 3)))
    model.add(MaxPooling2D(pool_size=(3, 2)))
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten())
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(num_classes, activation='softmax'))  # Output layer with num_classes neurons

    print("")
    print("started compiling the model")

    model.compile(loss='categorical_crossentropy', optimizer=Adam(learning_rate=0.001), metrics=['accuracy'])

    print("")
    print("finished creating the model, please press enter...")


def TrainModel():
    print("")
    print("Training model")

    epochsInput = input('Enter epoch number:')

    try:
        epochs = int(epochsInput)
    except ValueError:
        print("Defaulting to 10")



    model.fit(
        train_generator,
        steps_per_epoch=len(train_generator),
        epochs=epochs,
        verbose=1,
    )



def EvaluateModel():
    print("")
    print("Evaluate Model")
    # Evaluate on validation data
    validation_datagen = ImageDataGenerator(rescale=1.0 / 255.0)
    validation_generator = validation_datagen.flow_from_directory(
        train_data_directory,
        target_size=(224, 244),
        batch_size=32,
        class_mode='categorical'
    )

    evaluation = model.evaluate(validation_generator, steps=len(validation_generator))
    print("Validation Loss: {:.4f}".format(evaluation[0]))
    print("Validation Accuracy: {:.2f}%".format(evaluation[1] * 100))


def SaveModel():
    print("")
    print("Saving model in model directory")
    model.save('model/video_classification_model.h5')


if __name__ == "__main__":
    main_menu()