import streamlit as st
import pandas as pd
import ruptures as rpt
import matplotlib.pyplot as plt


faulty_parts_df = pd.read_csv("data/Fehlteile.csv", parse_dates=["time"], index_col="time")
# only keep the values column
faulty_parts_df = faulty_parts_df[["value"]]
series = faulty_parts_df["value"].values
series = series.reshape(-1, 1)
model = "l2"

algo = rpt.Dynp(model=model).fit(series)
result_range = algo.predict(n_bkps=1)

fig = plt.figure() 
# make plot smaller
fig.fig_size = (4,10)
plt.plot(series)
plt.axvspan(xmin=result_range[0], xmax=result_range[1], color="red", alpha=0.5)
plt.show()



st.title('⚙️ AMACAST - Weekly Report')
st.divider()

st.write('Theres change in the trend of the following sensors:')

col1, col2 = st.columns(2)
with col1:
  st.write("**Sensor:**")
  st.write("Fehlteile")
  
with col2:
  st.pyplot(fig)
  