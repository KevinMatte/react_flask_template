#!/bin/bash

find . \( \
     -name build \
     -o -name node_modules \
     -o -name .git \
     -o -name '*~' \
     -o -name .idea \
     -o -name .bak \
     \) -prune -o -type f -print
