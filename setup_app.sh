#!/bin/bash


name=${1:sample}

[ \! -f package.json ] && npx create-react-app .

workon ${name} || mkvirtualenv -p $(which python3) -r server/requirements.txt ${name}
python create_template.py ${name}



