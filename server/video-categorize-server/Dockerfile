FROM python:3.10

WORKDIR /app

COPY src/ .

RUN apt update && apt install -y libsm6 libxext6 ffmpeg libfontconfig1 libxrender1 libgl1-mesa-glx
RUN pip install --no-cache-dir Flask opencv-python-headless numpy keras tensorflow

EXPOSE 6200

CMD ["python3.10", "videoClassificationServer.py"]
