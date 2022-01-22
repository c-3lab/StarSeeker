#!/usr/bin/env python3

import csv
import json
import os
import pprint
import re
import requests
import sys
import time
from datetime import datetime
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

def load_table_def(filename, dir_path=''):

    matrix = csv_to_matrix(os.path.join(dir_path, filename))

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
        db_row_restrict = vec[4].lower()
        if len(vec) > 5 and len(vec[5]) > 0:
            if len(vec[5]) > 1:
                if vec[5][0] == '#':
                    auto_id_row_number = ord(vec[5][1:].lower()) - 0x61
                    auto_id = True
                elif vec[5][0] == ':':
                    repeat = vec[5][1:]
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
                sheet_row_number = ord(vec[5][0].lower()) - 0x61

        if db_table_name in db_tables:
            if auto_id_row_number:
                db_tables[db_table_name]['auto_id_row_number'] = auto_id_row_number
            if repeat_row_number:
                db_tables[db_table_name]['repeat_row_number'] = repeat_row_number
                db_tables[db_table_name]['repeat_row_length'] = repeat_row_length
            db_tables[db_table_name]['rows'].append({
                'auto_id': auto_id,
                'name': db_row_name,
                'type': db_row_type,
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
                    'rows': [{
                        'auto_id': auto_id,
                        'name': db_row_name,
                        'type': db_row_type,
                        'restrict': db_row_restrict,
                        'sheet_row_number': sheet_row_number,
                        'repeat_row_differential': repeat_row_differential
                    }]
                }
            })

    return db_table_names, db_tables

def generate_printable_table(name, content_list):

    from tabulate import tabulate
    contents = []
    sep = '=' * len(name)
    return f'{name}\n{sep}\n' + tabulate(content_list, headers='keys')

def print_table_def(db_table_names, db_table_def):

    def pop_sheet_row_number(x):
        x = x.copy()
        x.pop('sheet_row_number')
        x.pop('repeat_row_differential')
        return x
    contents = []
    for db_table_name in db_table_names:
        rows = db_tables_def[db_table_name]['rows']
        rows = list(map(lambda x: pop_sheet_row_number(x), db_tables_def[db_table_name]['rows']))
        contents.append(generate_printable_table(db_table_name, rows))
    print('\n\n'.join(contents))

def create_ddls(db_table_names, db_tables_def):

    ddls = []
    for db_table_name in db_table_names:
        rows_fragments = []
        for row in db_tables_def[db_table_name]['rows']:
            rows_fragments.append(' '.join([row['name'], row['type'], row['restrict']]))
        ddl = '\n'.join(['create table ' + db_table_name + '(',
                         ',\n'.join(rows_fragments),
                         ');'])
        ddls.append(ddl)

    return ddls

def csv_text_to_value(csv_text, row_type):
    if row_type == 'boolean':
        if csv_text == '〇':
            value = 'TRUE'
        else:
            value = 'FALSE'   
    elif row_type == 'integer':
        value = csv_text
    else:
        value = f'\'{csv_text}\''
    return value

def create_models(db_entity_name, db_tables_def, dir_path = '', is_structured=False):

    if not is_structured:
        db_table_name = f't_{db_entity_name}'
        db_table_def = db_tables_def[db_table_name]
    else:
        db_table_name = f't_{db_entity_name}_dataset'
        db_table_def = db_tables_def[db_table_name]
        db_detail_name = f't_{db_entity_name}_detail'
        db_detail_def = db_tables_def[db_detail_name]

    models = []
    data_matrix = csv_to_matrix(os.path.join(dir_path, f'{db_entity_name}.csv'))

    for record in data_matrix:
        model = {}

        model_main = {}
        for row in db_table_def['rows']:
            value = csv_text_to_value(record[row['sheet_row_number']], row['type'])
            model_main.update({
                row['name']: value
            })
        model.update({
            '__main__': model_main
        })
            
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
                    model_details.append(model_detail)
            model.update({
                '__detail__': model_details
            })
        models.append(model)

    return models

def convert_model_to_dml(model_dict, db_entity_name):
    keys = []
    values = []
    for k, v in model_dict.items():
        keys.append(k)
        values.append(v)
    return f'insert into {db_entity_name} (' + ','.join(keys) + ') values (' + ','.join(values) + ');'

def create_model_dmls(models, db_entity_name, is_structured=False):

    if not is_structured:
        db_table_name = f't_{db_entity_name}'
    else:
        db_table_name = f't_{db_entity_name}_dataset'
        db_detail_name = f't_{db_entity_name}_detail'

    dmls = []
    for model in models:
        dmls.append(convert_model_to_dml(model['__main__'], db_table_name))
        if '__detail__' in model:
            for detail in model['__detail__']:
                dmls.append(convert_model_to_dml(detail, db_detail_name))
    return dmls

def convert_attribute_format(value, type):

    if type.lower() == 'datetime':
        value = datetime.strptime(value, '%Y/%m/%d %H:%M:%S').isoformat()
    return value

def create_data_entities(db_table_names, db_tables_def, filename, dir_path = ''):

    matrix = csv_to_matrix(os.path.join(dir_path, filename))

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

def create_entity_json(entity):

    profile = entity['__main__']
    attributes = entity['__attr__']
    json = {}
    json.update({
        'id': profile['id'],
        'type': profile['type']
    })
    for name, attribute in attributes.items():
        value = attribute['value']
        value = re.sub('[<>"\'=;()]', ' ', value)
        json.update({
            name: {
                'type': attribute['type'],
                'value': value
            }
        })

    return json

def send_entity_to_broker(entity_json, broker_url, do_print_message=False):

    message = entity_json

    if do_print_message is True:
        pprint.pprint(message)
        return None

    headers = {
        'Content-Type': 'application/json'
    }

    res = None
    try:
        res = requests.post(broker_url, json=message, headers=headers)
    except Exception as e:
        n = type(e).__name__
        d = str(e)
        print(f'{n}: failed to fetch {broker_url}', file=sys.stderr)
        print(f'{d}', file=sys.stderr)
        return None

    if res is not None:
        status = res.status_code
        content_type = res.headers.get('Content-Type')
        if content_type is None or content_type != 'application/json':
            text = res.text
        else:
            text = json.loads(res.text)

        if status >= 400:
            if text is not None:
                error = text['error']
                detail = text['description']
                text = f'{error}({status}): {detail}'
            else:
                text = f'Error({status})'

    return text

if __name__ == '__main__':

    import argparse
    from argparse import HelpFormatter
    from operator import attrgetter
    class SortingHelpFormatter(HelpFormatter):
        def add_arguments(self, actions):
            actions = sorted(actions, key=attrgetter('option_strings'))
            super(SortingHelpFormatter, self).add_arguments(actions)

    parser = argparse.ArgumentParser(description='Create DDL/DML from csv files', formatter_class=SortingHelpFormatter)
    sps = parser.add_subparsers(dest='subparser_name', title='action arguments')
    sp_ddl = sps.add_parser('ddl', help='Create DDL for data model management')
    sp_ddl.add_argument('model', nargs=1, metavar='MODEL', help='data model definition csv file')
    sp_ddl.add_argument('--dir', '-d', default='', metavar='DIRPATH', help='directory path of data source csv files')
    sp_ddl.add_argument('--print-structure', '-p', action='store_true', help='print structure only')
    sp_model = sps.add_parser('model', help='Create DML for data model')
    sp_model.add_argument('model', nargs=1, metavar='MODEL', help='data model definition csv file')
    sp_model.add_argument('--dir', '-d', default='', metavar='DIRPATH', help='directory path of data source csv files')
    sp_action = sps.add_parser('action', help='action to broker server')
    sp_action.add_argument('model', nargs=1, metavar='MODEL', help='data model definition csv file')
    sp_action.add_argument('data', nargs=1, metavar='DATA', help='data csv file')
    sp_action.add_argument('url', nargs=1, metavar='URL', help='broker server url')
    sp_action.add_argument('--dir', '-d', default='', metavar='DIRPATH', help='directory path of data source csv files')
    sp_action.add_argument('--print-message', '-p', action='store_true', help='print action message only')

    if len(sys.argv) < 2:
        print(parser.format_usage(), file=sys.stderr)
        exit(1)

    args = parser.parse_args()
    subcommand = args.subparser_name

    if subcommand == 'ddl':
        db_table_names, db_tables_def = load_table_def(args.model[0], args.dir)
        if args.print_structure is True:
            print_table_def(db_table_names, db_tables_def)
        else:
            ddls = create_ddls(db_table_names, db_tables_def)
            for ddl in ddls:
                print(ddl)
    elif subcommand == 'model':
        db_table_names, db_tables_def = load_table_def(args.model[0], args.dir)
        db_entities = [('category', False), ('point', True), ('surface', True)]
        for db_entity_name, is_structured in db_entities:
            models = create_models(db_entity_name, db_tables_def, args.dir, is_structured=is_structured)
            dmls = create_model_dmls(models, db_entity_name, is_structured)
            for dml in dmls:
                print(dml)
    elif subcommand == 'action':
        db_table_names, db_tables_def = load_table_def(args.model[0], args.dir)
        entities = create_data_entities(db_table_names, db_tables_def, args.data[0], args.dir)
        for entity in entities:
            entity_json = create_entity_json(entity)
            status_message = send_entity_to_broker(entity_json, args.url[0], do_print_message=args.print_message)
            if status_message is not None:
                id = entity['__main__']['id']
                print(f'{id} {status_message}')

