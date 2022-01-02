#!/usr/bin/env sh

# Setup tools
pip3 install requests xlsx2csv

# Generate data
xlsx2csv -s 0 -f '%Y/%m/%d %H:%M:%S' data.xlsx env

# Register data to broker
python3 ss_conductor.py action tables.csv point_data.csv http://orion:1026/v2/op/update -d env
python3 ss_conductor.py action tables.csv surface_data.csv http://orion:1026/v2/op/update -d env

