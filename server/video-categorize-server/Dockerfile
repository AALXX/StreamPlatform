FROM python:3.10

ENV SRC_DIR /usr/bin/src/webapp/src

COPY src/* ${SRC_DIR}/

RUN apt update && apt install -y libsm6 libxext6 ffmpeg libfontconfig1 libxrender1 libgl1-mesa-glx
RUN pip install -r ${SRC_DIR}/requirements.txt

EXPOSE 6200

CMD python3.10 ${SRC_DIR}/videoClassificationServer.py
