from collections import defaultdict
import pdb
from typing_extensions import final
import requests
import json
from datetime import datetime
from pytz import timezone
from flask import Flask, request, jsonify
from flask_cors import CORS


def format_2_Points(floatNum):
    """Return a string of the float number with only two decimal points."""
    return "%.2f" % floatNum


# Using the url along wit the token from the website to make API calls
params = {'token': 'sk_7ba62c07d5554b5caab3f736c9f79005'}
base_url = 'https://cloud.iexapis.com/v1'


app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


@app.route('/hi', methods=['GET'])
def hi():
    return "HI"


# global definition of shares and distribution
invest_strat = {'growth': {'NFLX': 30, 'AAPL': 40, 'AMZN': 30},
                'value': {'INTC': 10, 'PG': 40, 'BRK.B': 50},
                'quality': {'ROKU': 10, 'CRM': 40, 'BA': 50},
                'index': {'IYY': 40, 'SPY': 35, 'IVV': 25},
                'ethical': {'MMM': 25, 'MSFT': 45, 'BYND': 30}}


@app.route('/ret_portfol_table', methods=['GET'])
def ret_port_table():

    query_parameters = request.args
    name = query_parameters.get('name').split(',')
    name = name[:-1]
    init_amount = int(query_parameters.get('amount'))
    amount = init_amount/len(name)
    result = {}
    count = 0
    share_dict = {}

    result["Stock"] = {}

    for i in name:

        stock = invest_strat[i]

        result['Stock'][i] = {}

        for j, v in stock.items():
            temp_row = []
            # pdb.set_trace()
            resp1 = requests.get(base_url+'/stock/' + j +
                                 '/chart', params=params)
            # print(resp1.text)
            temp = resp1.json()
            curr_price = temp[-1]['close']
            allot = amount*v/(curr_price*100)
            tot = allot*curr_price
            count += tot
            temp_row.append(format_2_Points(curr_price))
            temp_row.append(format_2_Points(allot))
            temp_row.append(format_2_Points(tot))
            share_dict[j] = allot
            result["Stock"][i][j] = temp_row

    result['Total'] = count
    # pdb.set_trace()
    te = return_portfolio_arr(share_dict)
    result['final_portfolio'] = te
    return jsonify(result)


def return_portfolio_arr(share_dict):

    trend_ind = {}

    stock_name = ""

    date = []

    for i in share_dict.keys():

        stock_name = i

        temp_trend = []
        resp = requests.get(base_url+'/stock/' + i +
                            '/chart/5d?includeToday=true', params=params)
        temp = resp.json()
        allot = share_dict[i]
        for j in temp:
            date.append(j['date'])
            temp_trend.append(j['close'] * allot)

        trend_ind[i] = temp_trend
    # pdb.set_trace()

    final_port = [0] * len(temp)

    for i in range(len(trend_ind[stock_name])):

        print(i)

        for stock in share_dict:

            final_port[i] += trend_ind[stock][i]

        final_port[i] = [date[i], final_port[i]]

    return final_port


@app.route('/get_invest_strat', methods=['GET'])
def get_invest_strat():

    return invest_strat


app.run()
