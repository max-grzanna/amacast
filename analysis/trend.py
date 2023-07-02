import datetime as dt
from sklearn import linear_model
import numpy as np
import datetime

# def get_slope(df, order=1):
#     y = df.index.map(dt.datetime.toordinal)  # Generate an array representing the indices
#     x = np.squeeze(df.values)
#     idx = np.isfinite(x) & np.isfinite(y)

#     p = Polynomial.fit(x[idx], y[idx], order)
    
#     coeffs = p.convert().coef
#     # The slope is the coefficient corresponding to the power of x^1
#     slope = coeffs[-2]
#     return slope

def create_regressor(df):
    df['date_ordinal'] = df.index.map(dt.datetime.toordinal) 
    reg = linear_model.LinearRegression()
    X = df['value'].values.reshape(-1, 1)
    y = df['date_ordinal'].values
    reg.fit(X, y)
    return reg 
    

def get_coef(reg):
    return reg.coef_[0]

def predict_capacity_overrun(reg, capacity):
    pred = reg.predict(np.array([capacity]).reshape(-1, 1))
    return datetime.date.fromordinal(int(pred[0]))
