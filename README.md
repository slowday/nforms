# zushar-api #
[ ![Codeship Status for trendy_weshy/sibasi-health](https://app.codeship.com/projects/e803d190-e01a-0134-31eb-46050fed2f07/status?branch=master)](https://app.codeship.com/projects/205150)
> a RESTful web resource for zushar form builder web tool.

## How to install ##

- clone the project [zushar api](https://github.com/trendy-weshy/zushar-api.git)
- create a .env file and add MONGO_URI and JWT_TOKEN environment variables
- run `npm install` on the terminal
- run `npm run build` on the terminal to create build of the project files
- run `node index.js` on the terminal to start the server

## How to test ##

After a successful installation of the api. For insurance purposes:

- run `npm install -g mocha typescript tslint ts-node` _this step is not necessary but is a good insurance that running api will be successful_
- run `node index.js` on the terminal
- run `npm test`

**note**: for now you will have to clear database contents after the test run I have not yet implemented a clean-up
strategy for after the tests run.

## Changelog ##
check [release notes](https://github.com/trendy-weshy/zushar-api/releases)
## License ##
MIT
