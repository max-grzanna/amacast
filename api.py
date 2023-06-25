import pandas as pd
from flask import Flask, Response, jsonify, request
import helper
from trend import get_coef, create_regressor, predict_capacity_overrun

app = Flask(__name__)

@app.route('/trend', methods=["POST"])
def get_trend():
  content = request.json
  data = pd.json_normalize(content)
  data = helper.prepare_df(data, window=6 * 30)
  data = helper.smooth_time_series(data, window=24, 
                                   center=True, 
                                   min_periods=1)
  reg = create_regressor(data)
  # Currently, wrong or too high values are generated. The reason could be the transforming of the time stamp in trend.py.
  # To test the calculation of the slope, for example, a simple function like y = 2x + 1 could be used.
  print(f"Slope: {get_coef(reg)}")
  
  return Response(status=200)

@app.route('/capacity', methods=["POST"])
def get_forecasted_capacity_overrun():
  content = request.json
  timeseries_name = content["file_name"]
  max_capacity = content["max_capacity"]
  data = pd.json_normalize(content["data"])
  data = helper.prepare_df(data, window=6 * 30)
  data = helper.smooth_time_series(data, window=24,
                                   center=True, 
                                   min_periods=1)
  reg = create_regressor(data)
  overrun_date = predict_capacity_overrun(reg, max_capacity=max_capacity)

  data = {
    "name": timeseries_name,
    "type": "upper_limit",
    "overrun_date": overrun_date,
  }
  
  return jsonify(data)

@app.route('/changepoints', methods=["POST"])
def get_changepoints():
  pass

@app.route('/anomaly', methods=["POST"])
def get_anomalies():
  pass
