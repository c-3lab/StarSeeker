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

def load_table_def():

    db_tables = {
        't_tenant': {
            'name': 't_tenant',
            'delete_key_names': [ 'tenant_name' ],
            'rows': [
                {'auto_id': False, 'name': 'tenant_name', 'type': 'string', 'no':0, 'rep_diff': None }
            ]
        },
        't_service_path': {
            'name': 't_service_path',
            'delete_key_names': [ 'service_path_name', 'tenant_id' ],
            'rows': [
                {'auto_id': False, 'name': 'service_path_name', 'type': 'string', 'no':0, 'rep_diff': None },
                {'auto_id': False, 'name': 'tenant_id', 'no': None, 'rep_diff': None,
                 'subquery': {
                     'table': 't_tenant',
                     'name': 'tenant_id',
                     'cond': [
                         { 'name': 'tenant_name', 'type': 'string', 'no': 1 }
                     ]
                 }
                }
            ]
        },
        't_category': {
            'name': 't_category',
            'auto_id_row_number': None,
            'delete_key_names': [ 'category_name', 'service_path_id' ],
            'rep_number': None,
            'rep_length': 0,
            'rows': [
                {'auto_id': False, 'name': 'category_name', 'type': 'string', 'no': 0, 'rep_diff': None},
                {'auto_id': False, 'name': 'service_path_id', 'no': None, 'rep_diff': None,
                 'subquery': {
                     'table': 't_service_path',
                     'name': 'service_path_id',
                     'innerjoin': {
                         'target': 't_tenant',
                         'on_left': 'tenant_id',
                         'on_right': 'tenant_id'
                     },
                     'cond': [
                         { 'table': 't_tenant', 'name': 'tenant_name', 'type': 'string', 'no': 1 },
                         { 'table': 't_service_path', 'name': 'service_path_name', 'type': 'string', 'no': 2 }
                     ]

                 }
                },
                {'auto_id': False, 'name': 'category_color', 'type': 'string', 'no': 3, 'rep_diff': None},
                {'auto_id': False, 'name': 'display_order', 'type': 'integer', 'no': 4, 'rep_diff': None},
                {'auto_id': False, 'name': 'enabled', 'type': 'boolean', 'no': 5, 'rep_diff': None}
            ]
        },
        't_point_dataset': {
            'name': 't_point_dataset',
            'auto_id_row_number': None,
            'delete_key_names': [ 'entity_type', 'category_id' ],
            'rep_number': None,
            'rep_length': 0,
            'rows': [
                {'auto_id': False, 'name': 'point_dataset_name', 'type': 'string', 'no': 0, 'rep_diff': None},
                {'auto_id': False, 'name': 'category_id', 'no': None, 'rep_diff': None,
                 'subquery': {
                     'table': 't_category',
                     'name': 'category_id',
                     'innerjoin': {
                         'target': {
                             'alias': 'cat',
                             'subquery': {
                                 'table': 't_service_path',
                                 'name': 'service_path_id',
                                 'innerjoin': {
                                     'target': 't_tenant',
                                     'on_left': 'tenant_id',
                                     'on_right': 'tenant_id'
                                 },
                                 'cond': [
                                     { 'table': 't_tenant', 'name': 'tenant_name', 'type': 'string', 'no': 1 },
                                     { 'table': 't_service_path', 'name': 'service_path_name', 'type': 'string', 'no': 2 }
                                 ]
                             }
                         },
                         'on_left': 'service_path_id',
                         'on_right': 'service_path_id'
                     },
                     'cond': [
                         { 'table': 't_category', 'name': 'category_name', 'type': 'string', 'no': 3 }
                     ]
                 }
                },
                {'auto_id': False, 'name': 'entity_type', 'type': 'string', 'no': 4, 'rep_diff': None},
                {'auto_id': False, 'name': 'point_color_code', 'type': 'string', 'no': 5, 'rep_diff': None},
                {'auto_id': False, 'name': 'coordinates_attr_name', 'type': 'string', 'no': 7, 'rep_diff': None},
                {'auto_id': False, 'name': 'register_time_attr_name', 'type': 'string', 'no': 8, 'rep_diff': None},
                {'auto_id': False, 'name': 'enabled', 'type': 'boolean', 'no': 6, 'rep_diff': None}
            ]
        },
        't_point_detail': {
            'name': 't_point_detail',
            'auto_id_row_number': None,
            'delete_key_names': [ 'point_dataset_id' ],
            'rep_number': 9,
            'rep_length': 4,
            'rows': [
                {'auto_id': False, 'name': 'point_dataset_id', 'no': None, 'rep_diff': None,
                 'subquery': {
                     'table': 't_point_dataset',
                     'name': 'point_dataset_id',
                     'innerjoin': {
                         'target': {
                             'alias': 'ds',
                             'subquery': {
                                 'table': 't_category',
                                 'name': [ 'category_id', 'category_name' ],
                                 'innerjoin': {
                                     'target': {
                                         'alias': 'cat',
                                         'subquery': {
                                             'table': 't_service_path',
                                             'name': 'service_path_id',
                                             'innerjoin': {
                                                 'target': 't_tenant',
                                                 'on_left': 'tenant_id',
                                                 'on_right': 'tenant_id'
                                             },
                                             'cond': [
                                                 { 'table': 't_tenant', 'name': 'tenant_name', 'type': 'string', 'no': 1 },
                                                 { 'table': 't_service_path', 'name': 'service_path_name', 'type': 'string', 'no': 2 }
                                             ]
                                         }
                                     },
                                     'on_left': 'service_path_id',
                                     'on_right': 'service_path_id'
                                 }
                             }
                         },
                         'on_left': 'category_id',
                         'on_right': 'category_id'
                     },
                     'cond': [
                         { 'table': 'ds', 'name': 'category_name', 'type': 'string', 'no': 3 },
                         { 'table': 't_point_dataset', 'name': 'entity_type', 'type': 'string', 'no': 4 }
                     ]
                 }
                },
                {'auto_id': False, 'name': 'item_attr_name', 'type': 'string', 'no': 0, 'rep_diff': 1},
                {'auto_id': False, 'name': 'data_type', 'type': 'integer', 'no': 0, 'rep_diff': 2},
                {'auto_id': False, 'name': 'display_title', 'type': 'string', 'no': 0, 'rep_diff': 0},
                {'auto_id': False, 'name': 'display_order', 'type': 'integer', 'no': 0, 'rep_diff': 3},
                {'auto_id': False, 'name': 'enabled', 'type': 'boolean', 'no': 6, 'rep_diff': None}
            ]
        },
        't_surface_dataset': {
            'name': 't_surface_dataset',
            'auto_id_row_number': None,
            'delete_key_names': [ 'entity_type', 'category_id' ],
            'rep_number': None,
            'rep_length': 0,
            'rows': [
                {'auto_id': False, 'name': 'surface_dataset_name', 'type': 'string', 'no': 0, 'rep_diff': None},
                {'auto_id': False, 'name': 'category_id', 'no': None, 'rep_diff': None,
                 'subquery': {
                     'table': 't_category',
                     'name': 'category_id',
                     'innerjoin': {
                         'target': {
                             'alias': 'cat',
                             'subquery': {
                                 'table': 't_service_path',
                                 'name': 'service_path_id',
                                 'innerjoin': {
                                     'target': 't_tenant',
                                     'on_left': 'tenant_id',
                                     'on_right': 'tenant_id'
                                 },
                                 'cond': [
                                     { 'table': 't_tenant', 'name': 'tenant_name', 'type': 'string', 'no': 1 },
                                     { 'table': 't_service_path', 'name': 'service_path_name', 'type': 'string', 'no': 2 }
                                 ]
                             }
                         },
                         'on_left': 'service_path_id',
                         'on_right': 'service_path_id'
                     },
                     'cond': [
                         { 'table': 't_category', 'name': 'category_name', 'type': 'string', 'no': 3 }
                     ]
                 }
                },
                {'auto_id': False, 'name': 'entity_type', 'type': 'string', 'no': 4, 'rep_diff': None},
                {'auto_id': False, 'name': 'border_color_code', 'type': 'string', 'no': 5, 'rep_diff': None},
                {'auto_id': False, 'name': 'fill_color_code', 'type': 'string', 'no': 6, 'rep_diff': None},
                {'auto_id': False, 'name': 'coordinates_attr_name', 'type': 'string', 'no': 8, 'rep_diff': None},
                {'auto_id': False, 'name': 'register_time_attr_name', 'type': 'string', 'no': 9, 'rep_diff': None},
                {'auto_id': False, 'name': 'enabled', 'type': 'boolean', 'no': 7, 'rep_diff': None}
            ]
        },
        't_surface_detail': {
            'name': 't_surface_detail',
            'auto_id_row_number': None,
            'delete_key_names': [ 'surface_dataset_id' ],
            'rep_number': 10,
            'rep_length': 3,
            'rows': [
                {'auto_id': False, 'name': 'surface_dataset_id', 'type': 'integer', 'no': None, 'rep_diff': None,
                 'subquery': {
                     'table': 't_surface_dataset',
                     'name': 'surface_dataset_id',
                     'innerjoin': {
                         'target': {
                             'alias': 'ds',
                             'subquery': {
                                 'table': 't_category',
                                 'name': [ 'category_id', 'category_name' ],
                                 'innerjoin': {
                                     'target': {
                                         'alias': 'cat',
                                         'subquery': {
                                             'table': 't_service_path',
                                             'name': 'service_path_id',
                                             'innerjoin': {
                                                 'target': 't_tenant',
                                                 'on_left': 'tenant_id',
                                                 'on_right': 'tenant_id'
                                             },
                                             'cond': [
                                                 { 'table': 't_tenant', 'name': 'tenant_name', 'type': 'string', 'no': 1 },
                                                 { 'table': 't_service_path', 'name': 'service_path_name', 'type': 'string', 'no': 2 }
                                             ]
                                         }
                                     },
                                     'on_left': 'service_path_id',
                                     'on_right': 'service_path_id'
                                 }
                             }
                         },
                         'on_left': 'category_id',
                         'on_right': 'category_id'
                     },
                     'cond': [
                         { 'table': 'ds', 'name': 'category_name', 'type': 'string', 'no': 3 },
                         { 'table': 't_surface_dataset', 'name': 'entity_type', 'type': 'string', 'no': 4 }
                     ]
                 }
                },
                {'auto_id': False, 'name': 'item_attr_name', 'type': 'string', 'no': 0, 'rep_diff': 1},
                {'auto_id': False, 'name': 'display_title', 'type': 'string', 'no': 0, 'rep_diff': 0},
                {'auto_id': False, 'name': 'display_order', 'type': 'integer', 'no': 0, 'rep_diff': 2},
                {'auto_id': False, 'name': 'enabled', 'type': 'boolean', 'no': 7, 'rep_diff': None}
            ]
        }
    }

    return db_tables

def send_db_message(message, pg_connection=None):

    if pg_connection is not None:
        try:
            cur = pg_connection.cursor()
            cur.execute(message)
            cur.close()
            pg_connection.commit()
        except Exception as e:
            n = type(e).__name__
            d = str(e).strip().replace('\n', '; ')
            print(f'[{n}] {d}; SQL: {message}', file=sys.stderr)
    else:
        print(message)

def csv_text_to_value(csv_text, row_type, is_nullable=True):
    if row_type == 'boolean':
        if len(csv_text) > 0 and csv_text != '×':
            value = 'TRUE'
        else:
            value = 'FALSE'   
    elif row_type == 'integer':
        value = csv_text
    else:
        if is_nullable is True and csv_text == 'NULL':
            value = 'NULL'
        else:
            value = f'\'{csv_text}\''
    return value

def build_subquery(record, subquery, is_nullable=True):

    names = subquery['name']
    if type(names) is list:
        name_str = ', '.join(names)
    else:
        name_str = names

    table = subquery['table']
    if type(table) is dict:
        alias_str = table['alias']
        table_subquery = build_subquery(record, table['subquery'], is_nullable=is_nullable)
        table_str = f'(select {alias_str}.{name_str} from {table_subquery} as {alias_str})'
        table_name = alias_str
    else:
        table_str = table
        table_name = table

    innerjoin = subquery.get('innerjoin')
    if innerjoin is None:
        innerjoin_str = ''
    else:
        innerjoin_target = innerjoin['target']
        innerjoin_on_left_str = innerjoin['on_left']
        innerjoin_on_right_str = innerjoin['on_right']
        if type(innerjoin_target) is str:
            innerjoin_target_str = innerjoin_target
            innerjoin_target_name = innerjoin_target
        elif type(innerjoin_target) is dict:
            alias_str = innerjoin_target['alias']
            innerjoin_target_subquery = build_subquery(record, innerjoin_target['subquery'], is_nullable=is_nullable)
            innerjoin_target_str = f'{innerjoin_target_subquery} as {alias_str}'
            innerjoin_target_name = alias_str
        innerjoin_str = f'inner join {innerjoin_target_str} on {table_name}.{innerjoin_on_left_str} = {innerjoin_target_name}.{innerjoin_on_right_str}'

    if subquery.get('cond') is None:
        cond_str = ''
    else:
        conds = []
        for cond in subquery['cond']:
            cond_table = cond['table'] if cond.get('table') is not None else subquery['table']
            cond_name = cond['name']
            cond_no = cond['no']
            cond_type = cond['type']
            cond_value = csv_text_to_value(record[cond_no], cond_type, is_nullable=is_nullable)
            if is_nullable is True and cond_value == 'NULL':
                conds.append(f'{cond_table}.{cond_name} IS NULL')
            else:
                conds.append(f'{cond_table}.{cond_name} = {cond_value}')
        cond_str = 'where ' + (' and '.join(conds))

    return f'(select {name_str} from {table_str} {innerjoin_str} {cond_str})'

def create_models(db_tables_def, dataset_file_path, model_name=None, is_structured=False, is_nullable=True):

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
                'def': db_table_def,
            },
            'detail': {
                'name': db_detail_name,
                'def': db_detail_def,
            }
        }
        model.update({
            '__profile__': model_profile
        })

        model_main = {}
        for row in db_table_def['rows']:
            value = None
            if row['no'] is not None:
                value = csv_text_to_value(record[row['no']], row['type'], is_nullable=is_nullable)
            else:
                value = build_subquery(record, row['subquery'], is_nullable=is_nullable)
            model_main.update({
                row['name']: value
            })
        model.update({
            '__main__': {
                '__instance__': model_main,
                '__delete_keys__': db_table_def['delete_key_names']
            }})

        if is_structured:
            auto_id_base = 0
            if db_detail_def['auto_id_row_number'] is not None:
                auto_id_base = int(record[db_detail_def['auto_id_row_number']]) + 1

            count = int((len(record) - db_detail_def['rep_number']) / db_detail_def['rep_length'])

            model_details = []
            for i in range(count):
                start = db_detail_def['rep_number'] + db_detail_def['rep_length'] * i
                end = start + db_detail_def['rep_length']
                if len(''.join(record[start:end])) > 0:
                    model_detail = {}
                    for row in db_detail_def['rows']:
                        if row['auto_id'] == True:
                            value = str(auto_id_base + i)
                        elif row['rep_diff'] is not None:
                            value = csv_text_to_value(record[start + row['rep_diff']], row['type'], is_nullable=is_nullable)
                        elif row['no'] is not None:
                            value = csv_text_to_value(record[row['no']], row['type'], is_nullable=is_nullable)
                        else:
                            value = build_subquery(record, row['subquery'], is_nullable=is_nullable)
                        model_detail.update({
                            row['name']: value
                        })
                    model_details.append({
                        '__instance__': model_detail,
                        '__delete_keys__': db_detail_def['delete_key_names']
                    })
            model.update({
                '__detail__': model_details
            })

        models.append(model)

    return models

def convert_model_to_dml(action, db_entity_name, model_dict, is_nullable=True):

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
        for k in model_dict['__delete_keys__']:
            v = model_dict['__instance__'][k]
            if v == 'NULL':
                conditions.append(f'{k} IS NULL')
            else:
                conditions.append(f'{k} = {v}')
        conditions_str = ' and '.join(conditions)
        return f'delete from {db_entity_name} where {conditions_str};'

def generate_dmls(action, models, is_nullable=True):

    dmls = []
    for model in models:
        dmls.append(convert_model_to_dml(action, model['__profile__']['table']['name'], model['__main__'], is_nullable=is_nullable))
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

def create_data_entities(db_tables_def, filename):

    matrix = csv_to_matrix(filename)

    entities = {}
    for vec in matrix:
        if len(vec) < 7:
            pass

        entity_id = vec[0]
        tenant = vec[1]
        service_path = vec[2]
        entity_type = vec[3]
        attr_id = vec[4]
        attr_type = vec[5]
        attr_value = convert_attribute_format(vec[6], vec[5])
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
                    'type': entity_type,
                    'tenant': tenant if len(tenant) > 1 else None,
                    'service_path': service_path if len(service_path) > 1 else None
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
            tenant = entity['__main__']['tenant'] if entity['__main__']['tenant'] else ''
            service_path = entity['__main__']['service_path'] if entity['__main__']['service_path'] else ''
            if broker_url is not None:
                headers = {
                    'Content-Type': 'application/json'
                }
                if tenant != 'NULL':
                    headers.update({
                        'Fiware-Service': tenant
                    })
                if service_path != 'NULL':
                    headers.update({
                        'Fiware-ServicePath': service_path
                    })
                url = broker_url
                res = requests.post(url, json=message, headers=headers)
            else:
                print(f'POST {message} tenant={tenant} service_path={service_path}')
                return None
        elif action == 'delete':
            id = entity['__main__']['id']
            tenant = entity['__main__']['tenant'] if entity['__main__']['tenant'] else ''
            service_path = entity['__main__']['service_path'] if entity['__main__']['service_path'] else ''
            if broker_url is not None:
                headers = {}
                if tenant != 'NULL':
                    headers.update({
                        'Fiware-Service': tenant
                    })
                if service_path != 'NULL':
                    headers.update({
                        'Fiware-ServicePath': service_path
                    })
                if len(broker_url) > 0 and broker_url[-1] != '/':
                    broker_url = broker_url + '/'
                url = urljoin(broker_url, id)
                if len(headers) > 0:
                    res = requests.delete(url, headers=headers)
                else:
                    res = requests.delete(url)
            else:
                print(f'DELETE {id} tenant={tenant} service_path={service_path}')
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

    sp_tenant = sps.add_parser('tenant', help='generate DML for tenant')
    sps_tenant = sp_tenant.add_subparsers(required=True, dest='action', title='action type')
    sp_tenant_create = sps_tenant.add_parser('create', help='generate DML to create tenants')
    sp_tenant_create.add_argument('source', nargs=1, metavar='TENANT-CSV', help='tenant csv file')
    sp_tenant_create.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')
    sp_tenant_delete = sps_tenant.add_parser('delete', help='generate DML to delete tenants')
    sp_tenant_delete.add_argument('source', nargs=1, metavar='TENANT-CSV', help='tenant csv file')
    sp_tenant_delete.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')

    sp_service_path = sps.add_parser('servicepath', help='generate DML for service paths')
    sps_service_path = sp_service_path.add_subparsers(required=True, dest='action', title='action type')
    sp_service_path_create = sps_service_path.add_parser('create', help='generate DML to create service paths')
    sp_service_path_create.add_argument('source', nargs=1, metavar='SERVICE-PATH-CSV', help='service path csv file')
    sp_service_path_create.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')
    sp_service_path_delete = sps_service_path.add_parser('delete', help='generate DML to delete service paths')
    sp_service_path_delete.add_argument('source', nargs=1, metavar='SERVICE_PATH-CSV', help='service path csv file')
    sp_service_path_delete.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')

    sp_category = sps.add_parser('category', help='generate DML for categories')
    sps_category = sp_category.add_subparsers(required=True, dest='action', title='action type')
    sp_category_create = sps_category.add_parser('create', help='generate DML to create categories')
    sp_category_create.add_argument('source', nargs=1, metavar='CATEGORY-CSV', help='category csv file')
    sp_category_create.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')
    sp_category_delete = sps_category.add_parser('delete', help='generate DML to delete categories')
    sp_category_delete.add_argument('source', nargs=1, metavar='CATEGORY-CSV', help='category csv file')
    sp_category_delete.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')

    sp_dataset = sps.add_parser('dataset', help='generate DML for datasets')
    sps_dataset = sp_dataset.add_subparsers(required=True, dest='action', title='action type')
    sp_dataset_create = sps_dataset.add_parser('create', help='generate DML to create datasets')
    sp_dataset_create.add_argument('source', nargs=1, metavar='DATASET-CSV', help='dataset csv file')
    sp_dataset_create.add_argument('--name', nargs=1, metavar='MODEL-NAME', help='dataset model name')
    sp_dataset_create.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')
    sp_dataset_delete = sps_dataset.add_parser('delete', help='generate DML to delete datasets')
    sp_dataset_delete.add_argument('source', nargs=1, metavar='DATASET-CSV', help='dataset csv file')
    sp_dataset_delete.add_argument('--name', nargs=1, metavar='MODEL-NAME', help='dataset model name')
    sp_dataset_delete.add_argument('--send', nargs=1, metavar='DSN', help='send to database (eg. \'postgresql://user:password@host:port/dbname\')')

    sp_data = sps.add_parser('data', help='generate NGSI message for data')
    sps_data = sp_data.add_subparsers(required=True, dest='action', title='action type')
    sp_data_create = sps_data.add_parser('create', help='generate NGSI message to create data')
    sp_data_create.add_argument('source', nargs=1, metavar='DATA', help='data csv file')
    sp_data_create.add_argument('--send', nargs=1, metavar='BROKER-URL', help='send to NGSI v2 broker (eg. \'http://broker/v2/entities\')')
    sp_data_delete = sps_data.add_parser('delete', help='generate NGSI message to delete data')
    sp_data_delete.add_argument('source', nargs=1, metavar='DATA', help='data csv file')
    sp_data_delete.add_argument('--send', nargs=1, metavar='BROKER-URL', help='send to NGSI v2 broker (eg. \'http://broker/v2/entities\')')

    if len(sys.argv) < 2:
        print(parser.format_usage(), file=sys.stderr)
        return 1

    args = parser.parse_args()
    subcommand = args.subparser

    is_nullable = True

    if subcommand != 'data':
        action = args.action
        if subcommand == 'tenant' or subcommand == 'servicepath' or subcommand == 'category':
            dataset_file = args.source[0]
            is_structured = False
            model_name = subcommand if subcommand != 'servicepath' else 'service_path'
        else:
            dataset_file = args.source[0]
            is_structured = True
            model_name = args.name[0] if args.name is not None else None
        db_tables_def = load_table_def()
        if action == 'create' or action == 'delete':
            models = create_models(db_tables_def, dataset_file, model_name, is_structured=is_structured, is_nullable=is_nullable)
            dmls = generate_dmls(action, models)
            for dml in dmls:
                if args.send is None:
                    conn = None
                else:
                    conn = get_pg_connection(args.send[0])
                    if conn is None:
                        return 1
                send_db_message(dml, pg_connection=conn)
                if conn is not None:
                    conn.close()
    else:
        action = args.action
        db_tables_def = load_table_def()
        if action == 'create' or action == 'delete':
            broker_url = args.send[0] if args.send is not None else None
            entities = create_data_entities(db_tables_def, args.source[0])
            for entity in entities:
                status_message = send_broker_message(action, entity, broker_url=broker_url)
                if status_message is not None:
                    id = entity['__main__']['id']
                    print(f'{id} {status_message}')

    return 0

if __name__ == '__main__':
    exit(main())
