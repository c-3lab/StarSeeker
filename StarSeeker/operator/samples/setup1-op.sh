#!/usr/bin/env sh

# Setup tools
pip3 install requests xlsx2csv

# Generate models
xlsx2csv -s 0 datamodels.xlsx env
python3 ss_conductor.py ddl tables.csv -d env > env/generate_tables.sql
python3 ss_conductor.py model tables.csv -d env > env/generate_models.sql
