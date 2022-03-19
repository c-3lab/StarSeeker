#!/usr/bin/env python3

import csv
import json
import os
import pprint
import psycopg2
import re
import requests
import sys
import time
from datetime import datetime
from tabulate import tabulate
from urllib.parse import urljoin

def csv_to_matrix(tables_csv_filename):

    with open(tables_csv_filename) as fd:
        lines = fd.read()

    rows = csv.reader(lines.splitlines())
    matrix = []
    for row in rows:
        vec = []
        for column in row:
            vec.append(column)
        if len(vec) > 0 and not vec[0].startswith('#'):
            matrix.append(vec)

    return matrix

def load_table_def(filename):

    matrix = csv_to_matrix(filename)

    db_table_names = []
    db_tables = {}
    for vec in matrix:
        auto_id_row_number = None
        auto_id = False
        repeat_row_number = None
        repeat_row_differential = None
        repeat_row_length = 0
        db_table_name = vec[1]
        db_row_name = vec[2]
        db_row_type = vec[3].lower()
        if len(vec[4]) > 0 and vec[4] != '×':
            db_row_primary_key = True
        else:
            db_row_primary_key = False
        db_row_restrict = vec[5].lower()
        if len(vec) > 6 and len(vec[6]) > 0:
            db_row_data_sheet_row = vec[6]
            if len(db_row_data_sheet_row) > 1:
                if db_row_data_sheet_row[0] == '#':
                    auto_id_row_number = ord(db_row_data_sheet_row[1:].lower()) - 0x61
                    auto_id = True
                elif db_row_data_sheet_row[0] == ':':
                    repeat = db_row_data_sheet_row[1:]
                    if len(repeat) > 0:
                        if repeat[0].isalpha():
                            repeat_row_number = ord(repeat[0].lower()) - 0x61
                            repeat_row_differential = 0
                            if len(repeat) > 2 and repeat[1] == '*':
                                repeat_row_length = int(repeat[2:])
                            else:
                                repeat_row_length = 1
                        else:
                            repeat_row_differential = int(repeat)
            else:
                sheet_row_number = ord(db_row_data_sheet_row[0].lower()) - 0x61

        if db_table_name in db_tables:
            if auto_id_row_number:
                db_tables[db_table_name]['auto_id_row_number'] = auto_id_row_number
            if repeat_row_number:
                db_tables[db_table_name]['repeat_row_number'] = repeat_row_number
                db_tables[db_table_name]['repeat_row_length'] = repeat_row_length
            if db_row_primary_key:
                db_tables[db_table_name]['primary_key'].apend(row_name)
            db_tables[db_table_name]['rows'].append({
                'auto_id': auto_id,
                'name': db_row_name,
                'type': db_row_type,
                'primary_key': db_row_primary_key,
                'restrict': db_row_restrict,
                'sheet_row_number': sheet_row_number,
                'repeat_row_differential': repeat_row_differential
            })
        else:
            db_table_names.append(db_table_name)
            db_tables.update({
                db_table_name: {
                    'name': db_table_name,
                    'auto_id_row_number': auto_id_row_number,
                    'repeat_row_number': repeat_row_number,
                    'repeat_row_length': repeat_row_length,
                    'primary_key': [ db_row_name ] if db_row_primary_key else [],
                    'rows': [{
                        'auto_id': auto_id,
                        'name': db_row_name,
                        'type': db_row_type,
                        'primary_key': db_row_primary_key,
                        'restrict': db_row_restrict,
                        'sheet_row_number': sheet_row_number,
                        'repeat_row_differential': repeat_row_differential
                    }]
                }
            })

    return db_table_names, db_tables

def send_db_message(message, pg_connection=None):

    if pg_connection is not None:
        try:
            cur = pg_connection.cursor()
            cur.execute(message)
            cur.close()
            pg_connection.commit()
        except Exception as e:
            n = type(e).__name__
            d = str(e).strip()
            print(f'[{n}] {d}', file=sys.stderr)
    else:
        print(message)

def csv_text_to_value(csv_text, row_type):
    if row_type == 'boolean':
        if len(csv_text) > 0 and csv_text != '×':
            value = 'TRUE'
        else:
            value = 'FALSE'   
    elif row_type == 'integer':
        value = csv_text
    else:
        value = f'\'{csv_text}\''
    return value

def create_models(db_tables_def, dataset_file_path, model_name=None, is_structured=False):

    if model_name is None:
        model_name = os.path.splitext(os.path.basename(dataset_file_path))[0]

    if not is_structured:
        db_table_name = f't_{model_name}'
        db_detail_name = None
        db_table_def = db_tables_def[db_table_name]
        db_detail_def = None
    else:
        db_table_name = f't_{model_name}_dataset'
        db_detail_name = f't_{model_name}_detail'
        db_table_def = db_tables_def[db_table_name]
        db_detail_def = db_tables_def[db_detail_name]

    models = []
    data_matrix = csv_to_matrix(dataset_file_path)

    for record in data_matrix:
        model = {}

        model_profile = {
            'name': model_name,
            'path': dataset_file_path,
            'table': {
                'name': db_table_name,
                'def': db_table_def
            },
            'detail': {
                'name': db_detail_name,
                'def': db_detail_def
            }
        }
        model.update({
            '__profile__': model_profile
        })

        model_main = {}
        model_pk = {}
        for row in db_table_def['rows']:
            value = csv_text_to_value(record[row['sheet_row_number']], row['type'])
            model_main.update({
                row['name']: value
            })
            if row['name'] in db_table_def['primary_key']:
                model_pk.update({
                    row['name']: value
                })
        model.update({
            '__main__': {
                '__instance__': model_main,
                '__pk__': model_pk
            }})

        if is_structured:
            auto_id_base = 0
            if db_detail_def['auto_id_row_number'] is not None:
                auto_id_base = int(record[db_detail_def['auto_id_row_number']]) + 1

            count = int((len(record) - db_detail_def['repeat_row_number']) / db_detail_def['repeat_row_length'])

            model_details = []
            for i in range(count):
                start = db_detail_def['repeat_row_number'] + db_detail_def['repeat_row_length'] * i
                end = start + db_detail_def['repeat_row_length']
                if len(''.join(record[start:end])) > 0:
                    model_detail = {}
                    model_detail_pk = {}
                    for row in db_detail_def['rows']:
                        if row['auto_id'] == True:
                            value = str(auto_id_base + i)
                        elif row['repeat_row_differential'] is not None:
                            value = csv_text_to_value(record[start + row['repeat_row_differential']], row['type'])
                        else:
                            value = csv_text_to_value(record[row['sheet_row_number']], row['type'])
                        model_detail.update({
                            row['name']: value
                        })
                        if row['name'] in db_detail_def['primary_key']:
                            model_detail_pk.update({
                                row['name']: value
                            })
                    model_details.append({
                        '__instance__': model_detail,
                        '__pk__': model_detail_pk
                    })
            model.update({
                '__detail__': model_details
            })

        models.append(model)

    return models

def convert_model_to_dml(action, db_entity_name, model_dict):

    if action == 'create':
        keys = []
        values = []
        for k, v in model_dict['__instance__'].items():
            keys.append(k)
            values.append(v)
        keys_str = ','.join(keys)
        values_str = ','.join(values)
        return f'insert into {db_entity_name} ({keys_str}) values ({values_str});'
    elif action == 'delete':
        conditions = []
        for k, v in model_dict['__pk__'].items():
            conditions.append(k + '=' + v)
        conditions_str = ','.join(conditions)
        return f'delete from {db_entity_name} where {conditions_str};'

def generate_dmls(action, models):

    dmls = []
    for model in models:
        dmls.append(convert_model_to_dml(action, model['__profile__']['table']['name'], model['__main__']))
        if '__detail__' in model:
            for detail in model['__detail__']:
                dmls.append(convert_model_to_dml(action, model['__profile__']['detail']['name'], detail))

    if action == 'delete':
        dmls.reverse()

    return dmls

def get_pg_connection(pg_connection):

    try:
        return psycopg2.connect(pg_connection)
    except Exception as e:
        n = type(e).__name__
        d = str(e).strip()
        print(f'[{n}] {d}', file=sys.stderr)
        return None
    
def convert_attribute_format(value, type):

    if type.lower() == 'datetime':
        value = datetime.strptime(value, '%Y/%m/%d %H:%M:%S').isoformat()
    return value

def create_data_entities(db_table_names, db_tables_def, filename):

    matrix = csv_to_matrix(filename)

    entities = {}
    for vec in matrix:
        if len(vec) < 5:
            pass

        entity_id = vec[0]
        entity_type = vec[1]
        attr_id = vec[2]
        attr_type = vec[3]
        attr_value = convert_attribute_format(vec[4], vec[3])
        if entity_id in entities:
            attributes = entities[entity_id]['__attr__']
            if attr_id in attributes:
                if not isinstance(attributes[attr_id]['value'], list):
                    attributes[attr_id]['value'] = [ attributes[attr_id]['value'] ]
                attributes[attr_id]['value'].append(attr_value)
            else:
                attributes.update({
                    attr_id: {
                        'type': attr_type,
                        'value': attr_value
                    }
                })
        else:
            entity = {
                '__main__': {
                    'id': entity_id,
                    'type': entity_type
                },
                '__attr__': {
                    attr_id: {
                        'type': attr_type,
                        'value': attr_value
                    }
                }
            }

            entities.update({
                entity_id: entity
            })

    entity_list = list(map(lambda x: entities[x], entities.keys()))

    return entity_list

def generate_message_to_create_entities(entity):

    profile = entity['__main__']
    attributes = entity['__attr__']
    message = {}
    message.update({
        'id': profile['id'],
        'type': profile['type']
    })
    for name, attribute in attributes.items():
        value = attribute['value']
        if type(value) == list:
            new_list = []
            for v in value:
                new_list.append(re.sub('[<>"\'=;()]', ' ', str(v)))
            value = new_list
        else:
            value = re.sub('[<>"\'=;()]', ' ', str(value))
        message.update({
            name: {
                'type': attribute['type'],
                'value': value
            }
        })

    return message

def send_broker_message(action, entity, broker_url=None):

    url = None
    res = None
    try:
        if action == 'create':
            message = generate_message_to_create_entities(entity)
            if broker_url is not None:
                headers = {
                    'Content-Type': 'application/json'
                }
                url = broker_url
                res = requests.post(url, json=message, headers=headers)
            else:
                print(f'POST {message}')
                return None
        elif action == 'delete':
            if broker_url is not None:
                if len(broker_url) > 0 and broker_url[-1] != '/':
                    broker_url = broker_url + '/'
                url = urljoin(broker_url, entity['__main__']['id'])
                res = requests.delete(url)
            else:
                id = entity['__main__']['id']
                print(f'DELETE {id}')
                return None
    except Exception as e:
        n = type(e).__name__
        d = str(e).strip()
        print(f'[{n}] {d}', file=sys.stderr)
        return None

    texts = []
    if res is None:
        texts.append('None')
    else:
        status = res.status_code
        texts.append(str(status))
        content_type = res.headers.get('Content-Type')
        if content_type is None or content_type != 'application/json':
            texts.append(res.text)
        else:
            res_text = json.loads(res.text)
            if status >= 400:
                error = res_text['error']
                detail = res_text['description']
                texts.append(f'{error}: {detail}')

    texts.append(url)

    return ' '.join(texts)

def main():

    import argparse
    from argparse import HelpFormatter
    from operator import attrgetter
    class SortingHelpFormatter(HelpFormatter):
        def add_arguments(self, actions):
            actions = sorted(actions, key=attrgetter('option_strings'))
            super(SortingHelpFormatter, self).add_arguments(actions)

    parser = argparse.ArgumentParser(description='Create DDL/DML from csv files', formatter_class=SortingHelpFormatter)
    sps = parser.add_subparsers(dest='subparser', title='action category arguments')

    sp_category = sps.add_parser('category', help='generate DML for categories')
    sps_category = sp_category.add_subparsers(required=True, dest='action', title='action type')
    sp_category_create = sps_category.add_parser('create', help='generate DML to create categories')
    sp_category_create.add_argument('table', nargs=1, metavar='TABLE-CSV', help='table definition csv file')
    sp_category_create.add_argument('category', nargs=1, metavar='CATEGORY-CSV', help='category csv file')
    sp_category_create.add_argument('--name', nargs=1, metavar='MODEL-NAME', help='dataset model name')
    sp_category_create.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')
    sp_category_delete = sps_category.add_parser('delete', help='generate DML to delete datasets')
    sp_category_delete.add_argument('table', nargs=1, metavar='TABLE-CSV', help='table definition csv file')
    sp_category_delete.add_argument('category', nargs=1, metavar='CATEGORY-CSV', help='category csv file')
    sp_category_delete.add_argument('--name', nargs=1, metavar='MODEL-NAME', help='dataset model name')
    sp_category_delete.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')

    sp_dataset = sps.add_parser('dataset', help='generate DML for datasets')
    sps_dataset = sp_dataset.add_subparsers(required=True, dest='action', title='action type')
    sp_dataset_create = sps_dataset.add_parser('create', help='generate DML to create datasets')
    sp_dataset_create.add_argument('table', nargs=1, metavar='TABLE-CSV', help='table definition csv file')
    sp_dataset_create.add_argument('dataset', nargs=1, metavar='DATASET-CSV', help='dataset csv file')
    sp_dataset_create.add_argument('--name', nargs=1, metavar='MODEL-NAME', help='dataset model name')
    sp_dataset_create.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')
    sp_dataset_delete = sps_dataset.add_parser('delete', help='generate DML to delete datasets')
    sp_dataset_delete.add_argument('table', nargs=1, metavar='TABLE-CSV', help='table definition csv file')
    sp_dataset_delete.add_argument('dataset', nargs=1, metavar='DATASET-CSV', help='dataset csv file')
    sp_dataset_delete.add_argument('--name', nargs=1, metavar='MODEL-NAME', help='dataset model name')
    sp_dataset_delete.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')

    sp_data = sps.add_parser('data', help='generate NGSI message for data')
    sps_data = sp_data.add_subparsers(required=True, dest='action', title='action type')
    sp_data_create = sps_data.add_parser('create', help='generate NGSI message to create data')
    sp_data_create.add_argument('table', nargs=1, metavar='TABLE-CSV', help='table definition csv file')
    sp_data_create.add_argument('data', nargs=1, metavar='DATA', help='data csv file')
    sp_data_create.add_argument('--send', nargs=1, metavar='BROKER-URL', help='send to NGSI v2 broker (eg. \'http://broker/v2/entities\')')
    sp_data_delete = sps_data.add_parser('delete', help='generate NGSI message to delete data')
    sp_data_delete.add_argument('table', nargs=1, metavar='TABLE-CSV', help='table definition csv file')
    sp_data_delete.add_argument('data', nargs=1, metavar='DATA', help='data csv file')
    sp_data_delete.add_argument('--send', nargs=1, metavar='BROKER-URL', help='send to NGSI v2 broker (eg. \'http://broker/v2/entities\')')

    if len(sys.argv) < 2:
        print(parser.format_usage(), file=sys.stderr)
        return 1

    args = parser.parse_args()
    subcommand = args.subparser

    if subcommand == 'table':
        action = args.action
        db_table_names, db_tables_def = load_table_def(args.table[0])
        if action == 'print':
            print_table_def(db_table_names, db_tables_def)
        elif action == 'create' or action == 'delete':
            if args.send is None:
                conn = None
            else:
                conn = get_pg_connection(args.send[0])
                if conn is None:
                    return 1
            ddls = generate_ddls(action, db_table_names, db_tables_def)
            for ddl in ddls:
                send_db_message(ddl, pg_connection=conn)
            if conn is not None:
                conn.close()
    elif subcommand == 'category' or subcommand == 'dataset':
        action = args.action
        if subcommand == 'category':
            dataset_file = args.category[0]
            is_structured = False
        else:
            dataset_file = args.dataset[0]
            is_structured = True
        model_name = args.name[0] if args.name is not None else None
        db_table_names, db_tables_def = load_table_def(args.table[0])
        if action == 'create' or action == 'delete':
            models = create_models(db_tables_def, dataset_file, model_name, is_structured=is_structured)
            dmls = generate_dmls(action, models)
            if args.send is None:
                conn = None
            else:
                conn = get_pg_connection(args.send[0])
                if conn is None:
                    return 1
            for dml in dmls:
                send_db_message(dml, pg_connection=conn)
            if conn is not None:
                conn.close()
    elif subcommand == 'data':
        action = args.action
        db_table_names, db_tables_def = load_table_def(args.table[0])
        if action == 'create' or action == 'delete':
            broker_url = args.send[0] if args.send is not None else None
            entities = create_data_entities(db_table_names, db_tables_def, args.data[0])
            for entity in entities:
                status_message = send_broker_message(action, entity, broker_url=broker_url)
                if status_message is not None:
                    id = entity['__main__']['id']
                    print(f'{id} {status_message}')

    return 0

if __name__ == '__main__':
    exit(main())
