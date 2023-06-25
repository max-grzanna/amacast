# Amacast ⚙️
**A**ssisted **m**onitoring and fore**cast**ing
## Install

use: `python3 -m venv .venv`


On Linux machines use the following command to activate the environment:
`source venv/bin/activate`

Execute `pip3 install -r requirements.txt` to install the necessary dependencies.

## Run dashboard server

use `streamlit run dashboard.py`

## Send data against the AP
Here is a basic example of sending data against the API:

```bash
python3 connector.py \
  data/memory-required.csv \
  --endpoint http://127.0.0.1:5000/capacity \
  --max-capacity 20.0
```