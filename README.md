# Storm Vods

To run tests

```
./tools/scripts/api-test-runner.sh config/test.json
```

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

### Run

Run development server and watch client resources for changes:

```
grunt serve
```

## Build

Run grunt task to build client-side resources:

```
grunt build
```


## Deployment

To deploy using build int script (requires newrelic.js and production.json to existsL

```
npm run-script deploy 162.243.138.216
```


