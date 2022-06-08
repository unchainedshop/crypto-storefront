FROM python:3.8
RUN mkdir -p /home/gateway
WORKDIR /home/gateway

COPY requirements.txt /home/gateway

RUN pip install --no-cache-dir -r requirements.txt
COPY . /home/gateway

ENTRYPOINT [ "python", "./cryptopay/server.py"]