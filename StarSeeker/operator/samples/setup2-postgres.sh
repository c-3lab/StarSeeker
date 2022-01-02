#!/usr/bin/env sh

# Create model definitions
psql -f env/generate_tables.sql
psql -f env/generate_models.sql
