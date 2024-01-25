FROM python:3.10

ENV SRC_DIR /usr/bin/src/webapp/src

COPY src/* ${SRC_DIR}/

RUN yum -y install mesa-libGL
RUN pip install -r ${SRC_DIR}/requirements.txt

EXPOSE 6200

CMD python3.10 ${SRC_DIR}/videoClassificationServer.py
