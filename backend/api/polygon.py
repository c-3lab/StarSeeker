import urllib.request
from flask import Blueprint, jsonify, current_app

polygon = Blueprint('point', __name__, url_prefix='/api')


def fetch_data(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as res:
        return res.read()


@polygon.route('/polygon', methods=['GET'])
def getPointList():
    data = fetch_data(current_app.config['ORION_URL'] +
                      '/v2/entities?limit=100')
    json_str = data.decode('utf8')
    return jsonify(json_str), 200
