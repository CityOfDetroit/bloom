#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: generate-ami-chart.sh path/to/FILE"
  exit
fi

# Get the file name and the path separately.
DIRECTORY=$(dirname "$1")
FILE=$(basename "$1")
FILENAME=${FILE%.*}
OUTPUT_FILE="$DIRECTORY/$FILENAME.ts"


echo "Generating $OUTPUT_FILE"

cat << EOF > $OUTPUT_FILE
import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

// THIS FILE WAS AUTOMATICALLY GENERATED FROM $FILE.
export const $FILENAME: Omit<AmiChartCreateDto, keyof BaseEntity> = {
  name: "$FILENAME",
  items: [
EOF

# For each line, generate a set of JSON values
sed -e "s/%//g" -e "s/,//g" $1 |
  while read -ra INCOME; do
    # AMI is the first column
    AMI=${INCOME[0]}
    for i in $(seq 8); do
      # print this AMI table value to the OUTPUT
      cat << EOF >> $OUTPUT_FILE
    {
      percentOfAmi: $AMI,
      householdSize: $i,
      income: ${INCOME[$i]},
    },
EOF
    done
  done

# Finish the JSON
cat << EOF >> $OUTPUT_FILE
  ],
}
EOF
