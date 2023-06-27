import ruptures as rpt#
import datetime
import datetime as dt

def calc_changepoint_interval(df):
  df['date_ordinal'] = df.index.map(dt.datetime.toordinal)
  series = df["value"].values
  series = series.reshape(-1, 1)

  model = "l2"
  algo = rpt.Dynp(model=model).fit(series)

  result_range = algo.predict(n_bkps=1)

  dates_ordinal = [df.index[i - 1] for i in result_range]
  print(dates_ordinal)
  dates_iso = [i.isoformat() for i in dates_ordinal]

  return dates_iso