from flask import Flask
from flask import request
from flask import Response

app = Flask(__name__)

@app.route('/trend', methods=["POST"])
def get_trend():
  content = request.json

  return Response(status=200)

