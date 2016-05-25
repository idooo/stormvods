# Storm Vods

## Setup

### Database

Do not forget to setup a firewall on your MongoDB instance. For example `ufw`:

```
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow from ip_address_of_your_stormvods_app
ufw enable
```

### Install

Checkout repo and install all the dependencies:

```
git clone https://github.com/idooo/stormvods.git
cd stormvods
npm i
```

### Config

Edit `default.conf` to set right permissions for database, redis and other minor stuff

### Development

Run development server and watch client resources for changes:

```
grunt serve
```

### Tests

To run tests (add `--tests testname.test.js` to run specific test)

```
./tools/scripts/api-test-runner.sh config/test.json
```


### Production Build

Run grunt task to build client-side resources:

```
grunt build
```

### Run

Build static assets first

```
config=<config path> node server.js
```



### Deployment

To deploy using build int script (requires newrelic.js and production.json to existsL

```
npm run-script deploy 162.243.138.216
```


