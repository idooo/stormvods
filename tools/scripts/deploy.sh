#!/usr/bin/env bash

host=$1

grunt build

ssh $host 'rm -rf ~/stormvods; mkdir ~/stormvods'
rsync -rav -e ssh --exclude={docs,node_modules,web/src,web/assets,tests,.*,grunt,Gruntfile.js} ./ $host:~/stormvods

ssh $host << EOF

  cd ~/stormvods
  npm i --production
  cd ~/stormvods/tools/scripts
  npm i

  forever stop /var/www/stormvods/server.js

  rm -rf /var/www/stormvods
  rsync -av ~/stormvods /var/www;
  cd /var/www/stormvods

  cp ~/newrelic/newrelic.js /var/www/stormvods/newrelic.js
  mv /var/www/stormvods/config/production.json /var/www/stormvods/config/default.json

  forever start /var/www/stormvods/server.js
EOF
