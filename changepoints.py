import ruptures as rpt#
import datetime

def calc_changepoint_interval(df):
  series = df["value"].values
  series = series.reshape(-1, 1)
  model = "l2"

  algo = rpt.Dynp(model=model).fit(series)
  result_range = algo.predict(n_bkps=1)

  dates_array = [datetime.date.fromordinal(int(i)) for i in result_range]

  return dates_array