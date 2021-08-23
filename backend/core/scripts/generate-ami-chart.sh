#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: generate-ami-chart.sh path/to/FILE"
  exit
fi

# Get the file name and the path separately.
DIRECTORY=$(dirname "$1")
FILE=$(basename "$1")
FILENAME=${FILE%.*}


echo "dir: $DIRECTORY file: $FILENAME"

read -r -d '' OUTPUT << EOM
import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

// THIS FILE WAS AUTOMATICALLY GENERATED
export const $FILENAME: Omit<AmiChartCreateDto, keyof BaseEntity> = {
  name: "$FILENAME",
  items: [
EOM



echo "$OUTPUT"
