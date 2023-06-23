import datetime as dt
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import linear_model
import helper
import numpy as np
import datetime


def main():
  df = pd.read_csv("data/Fehlteile.csv", parse_dates=["time"])
  df = df[["time", "value"]]
  df = helper.prepare_df(df, window=6 * 30)
  df = helper.smooth_time_series(df, window=24, 
                                   center=True, 
                                   min_periods=1)
  
  
  df['date_ordinal'] = df.index.map(dt.datetime.toordinal)
  reg = linear_model.LinearRegression()
  X = df['value'].values.reshape(-1, 1)
  y  = df['date_ordinal'].values
  reg.fit(X, y)

  pred = reg.predict(np.array([20.0]).reshape(-1, 1))
  print(datetime.date.fromordinal(int(pred[0])))
  
  
  # plot the data and the regression line
  plt.scatter(y, X, color='grey')
  plt.plot(reg.predict(X), X,  color='purple', linewidth=2)
  plt.show()
    
    
if __name__ == "__main__":
    main()