from datetime import timedelta, datetime
import pandas as pd


def smooth_time_series(df, window, center=True, min_periods=1):
  return df.rolling(window=window, 
                    min_periods=min_periods, 
                    center=center).mean()
  

def prepare_df(df, window, drop_na=True):
  if drop_na: df = df.dropna()
  df['time'] = pd.to_datetime(df['time'])
  df = df.set_index('time')
  now = datetime.now()
  t_window = now - timedelta(days=window)
  reduced_df = df[(df.index >= t_window) & (df.index <= now)]

  return reduced_df
