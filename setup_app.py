
import json
import os.path
import shutil
import sys

name = sys.argv[1]

with open('package.json') as file:
    package = json.load(file)

if 'proxy' not in package:
    package.update({
        'homepage': f'/{name}',
        'name': name,
        'proxy': 'http://localhost:5000'
    })

    print('Updating package.json')
    if not os.path.exists('package.json.bak'):
        shutil.copyfile('package.json', 'package.json.bak')

    with open('package.json', 'w') as file:
        print(json.dumps(package, indent=2), file=file)

