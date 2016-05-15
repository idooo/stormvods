#!/usr/bin/env bash

host=$1

grunt build

ssh $host 'rm -rf ~/stormvods; mkdir ~/stormvods'
rsync -rav -e ssh --exclude={docs,node_modules,web/src,web/assets,tests,.*,grunt,Gruntfile.js} ./ $host:~/stormvods

ssh $host << EOF
  forever stop /var/www/stormvods/server.js

  rm -rf /var/www/stormvods
  rsync -av stormvods /var/www;
  cd /var/www/stormvods
  npm i --production
  cp ~/newrelic/newrelic.js /var/www/stormvods/newrelic.js

  mv /var/www/stormvods/config/production.json /var/www/stormvods/config/default.json

  cd /var/www/stormvods/tools/scripts
  npm i

  forever start /var/www/stormvods/server.js
EOF
