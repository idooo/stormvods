#!/usr/bin/env bash

host=$1

ssh $host 'rm -rf ~/stormvods; mkdir ~/stormvods'
rsync -rav -e ssh --exclude={docs,node_modules,web/src,web/assets,tests,.*,grunt,Gruntfile.js} ./ $host:~/stormvods

ssh $host << EOF
  forever stop /var/www/stormvods/server.js

  rm -rf /var/www/stormvods
  rsync -av stormvods /var/www;
  cd /var/www/stormvods
  npm i --production
  cp ~/newrelic/newrelic.js /var/www/stormvods/newrelic.js

  forever start /var/www/stormvods/server.js
EOF
