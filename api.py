import pandas as pd
from flask import Flask
from flask import request
from flask import Response
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
  # Es entstehen aktuell falsche bzw. zu hohe Werte. Grund könnte das transformieren des Zeitstempels sein.
  # Um die Berechnung des Anstiegs zu testen, könnte beispielsweise eine einfache Funktion wie y = 2x + 1 verwendet werden.
  print(f"Slope: {get_coef(reg)}")
  
  return Response(status=200)

@app.route('/trend', methods=["POST"])
def get_trend():
  content = request.json
  data = pd.json_normalize(content)
  data = helper.prepare_df(data, window=6 * 30)
  data = helper.smooth_time_series(data, window=24, 
                                   center=True, 
                                   min_periods=1)
  reg = create_regressor(data)
  overrun_date = predict_capacity_overrun(reg, 20)
  print(f"Maximum capacity is getting reached at: {overrun_date}")
  
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