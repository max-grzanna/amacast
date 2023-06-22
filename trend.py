import datetime as dt
from sklearn import linear_model

# def get_slope(df, order=1):
#     y = df.index.map(dt.datetime.toordinal)  # Generate an array representing the indices
#     x = np.squeeze(df.values)
#     idx = np.isfinite(x) & np.isfinite(y)

#     p = Polynomial.fit(x[idx], y[idx], order)
    
#     # plot 
    

#     coeffs = p.convert().coef
#     # The slope is the coefficient corresponding to the power of x^1
#     slope = coeffs[-2]
#     return slope

def calc_coef(df):
    df['date_ordinal'] = df.index.map(dt.datetime.toordinal)
    reg = linear_model.LinearRegression()
    X = df['date_ordinal'].values.reshape(-1, 1)
    y = df['value'].values
    reg.fit(X, y)

    return  reg.coef_[0]