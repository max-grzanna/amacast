import pandas as pd
from flask import Flask
from flask import request
from flask import Response
import helper
from trend import calc_coef

app = Flask(__name__)

@app.route('/trend', methods=["POST"])
def get_trend():
  content = request.json
  data = pd.json_normalize(content)
  data = helper.prepare_df(data, window=6 * 30)
  data = helper.smooth_time_series(data, window=24, 
                                   center=True, 
                                   min_periods=1)
  print(calc_coef(data))
  return Response(status=200)

@app.route('/forecast', methods=["POST"])
def forecast_ts():
  pass

@app.route('/anomaly', methods=["POST"])
def get_anomalies():
  pass

@app.route('/changepoints', methods=["POST"])
def get_changepoints():
    pass