FROM python:3.11.4-slim

RUN mkdir -p /app
WORKDIR /app
COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY *.py ./
COPY examples examples
COPY data data

EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD ["api.py" ]
