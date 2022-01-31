#!/usr/bin/env sh

for f in `ls ${DIR:-.}/*.xlsx`
do
    xlsx2csv --all --dateformat '%Y/%m/%d %H:%M:%S' $f ${OUTDIR:-.}
done

