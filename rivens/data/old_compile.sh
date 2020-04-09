#!/usr/bin/env bash

echo "const data = {" > data.js
for f in *.json; do
    filename=$(echo $f | cut -d "." -f1)
    printf "$filename" >> data.js
    printf ": " >> data.js
    cat $f >> data.js
    echo "," >> data.js
done

echo "};" >> data.js
