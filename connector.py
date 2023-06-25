"""
This script is used for mocking the data connector.
It converts an input CSV file to JSON and sends it to a API endpoint of the analysis part
of the application.
"""

import csv
import argparse
import requests


def csv_to_json(csv_file):
    json_data = []
    with open(csv_file, "r") as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            json_data.append({"time": row["time"], "value": row["value"]})

    return json_data


def send_data_to_api(json_data, endpoint):
    headers = {"Content-Type": "application/json"}
    res = requests.post(endpoint, json=json_data, headers=headers)
    return res



def main():
    parser = argparse.ArgumentParser(description="CSV to JSON Converter")
    parser.add_argument("file", type=str, help="Path to the CSV file")
    parser.add_argument("--endpoint", type=str, help="URL of the API endpoint")
    parser.add_argument("--max-capacity", type=float, help="Maximum capacity of the system")
    args = parser.parse_args()

    csv_file = args.file
    endpoint = args.endpoint
    max_capacity = args.max_capacity

    # get name of the file without file extension
    file_name = csv_file.split("/")[-1].split(".")[0]

    try:
        time_series_data = csv_to_json(csv_file)
        json_data = {"file_name": file_name,
                     "data": time_series_data,
                     "max_capacity": max_capacity}
        response = send_data_to_api(json_data, endpoint)
        print(response.text)
    except FileNotFoundError:
        print("File not found. Please provide a valid file path.")


if __name__ == "__main__":
    main()
