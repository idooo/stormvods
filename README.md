# Storm Vods

Community-driven spoiler-free catalog of competitive videos for Heroes of the Storm.

[![Dependency Status](https://dependencyci.com/github/idooo/stormvods/badge)](https://dependencyci.com/github/idooo/stormvods)

This project is not as relevant as before because Blizzard has done a great job and finally launched their HGC eSports website: [Check it out](http://us.heroesofthestorm.com/esports/en/)! gg wp =)

## Contribution

Stormvods.com is currently accepting contributions in the form of bug fixes or features
(things that add new or improved functionality). Your pull requests will be reviewed
and merged to master branch as soon as possible and deployed to the production.

##### Legal
Commiting your code to this repository, submitting pull requests you are granting us permission
to use the submitted change according to the terms of the project's license,
and that the work being submitted is under appropriate copyright.

Heroes of the Storm is a trademark of Blizzard Entertainment, Inc.

You can use Stormvods source code in any way MIT license allows you,
but you have no rights to use "Stormvods" trademark and you must clearly specify that your
product is based on Stormvods.com Source Code

## Setup

#### Install

Checkout repo and install all the dependencies:

```
git clone https://github.com/idooo/stormvods.git
cd stormvods
npm i
# or
yarn install
```

#### Database

Stormvods uses MongoDB as a database. For development you need to setup a database locally
or use one of cloud-based solutions like [mlab](https://mlab.com/) -
free tier there is more than enough for the development

Do not forget to setup a firewall if your database is not protected by password.
For example `ufw`:

```
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow from ip_address_of_your_stormvods_app
ufw enable
```

#### Reddit app

You have to create a Reddit application to be able to use login feature.
The setup is pretty straightforward, use `http://localhost:8080/callback` as your redirect uri

#### Config

Edit `default.conf` or to set right permissions for database, redis and other minor stuff

#### Scripts

Use scripts from `/tools/scripts` folder to set admin rights for your user, import teams
and other data if needed

## Development

Run development server and watch client resources for changes:

```
grunt serve
```

That command will also generate the latest version of server API docs in /docs folder

### Tests

To run api tests (add `--tests testname.test.js` to run specific test)

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

# License

##### The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

