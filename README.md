# AWS API Gateway Test CLI <a href="https://www.npmjs.com/package/aws-api-gateway-cli-test"><img alt="NPM Version" src="https://img.shields.io/npm/v/aws-api-gateway-cli-test.svg?style=flat-square" /></a>

A simple CLI to test API Gateway endpoints with IAM authorization. Uses the AWS SDK, AWS Cognito JS SDK, and the generic [API Gateway Client][apiGClient]. Using the login information given, this tool logs a user into the Cognito User Pool, gets the temporary IAM credentials, and makes the API request. It can be difficult to do these steps by hand without scripting them.

### Installation

To install globally run the following:

```
$ npm install -g aws-api-gateway-cli-test
```

You can also use it locally using:

```
$ npx aws-api-gateway-cli-test
```

### Usage

If you have it globally installed:

``` bash
$ apig-test \
  --username='johndoe' \
  --password='password' \
  --user-pool-id='us-east-1_Xxxxxxxx' \
  --app-client-id='29xxyyxxyxxxyyxxxyy' \
  --cognito-region='us-east-1' \
  --identity-pool-id='us-east-1:99xxyyx-9999-9999-xx0x-99xxxxxxxx' \
  --invoke-url='https://99xxxxxxx.execute-api.us-east-1.amazonaws.com' \
  --api-gateway-region='us-east-1' \
  --api-key='x3xaacea33DCDA3aqafae28aCdaeEWXX1ada3acx' \
  --path-template='/users' \
  --method='GET' \
  --params='{}' \
  --additional-params='{}' \
  --access-token-header='cognito-access-token' \
  --body='{}'
```

If you have it locally installed:

``` bash
$ npx aws-api-gateway-cli-test --options
```

This command takes the following options:

- `config`
  Read parameters from a file.  File must be valid JSON and end in a .json extension.  Command line parameters will override the same config file parameter.

- `username`
  The username of the Cognito User Pool user.

- `password`
  The password of the Cognito User Pool user.

- `user-pool-id`
  The Cognito User Pool Id.

- `app-client-id`
  The Cognito User Pool App Client Id.

- `cognito-region`
  The Cognito User Pool region. Defaults to `us-east-1`.

- `identity-pool-id`
  The Cognito Identity Pool Id.

- `invoke-url`
  The API Gateway root endpoint.

- `api-gateway-region`
  The API Gateway region. Defaults to `us-east-1`.
  
- `api-key`
  The API key if required by the method. Defaults to none.

- `path-template`
  The path template of the API.

- `method`
  The API method. Defaults to `GET`.

- `params`
  The API path params as a JSON string. Defaults to `'{}'`.

- `additional-params`
  Any additional params (including the headers and querystring) as a JSON string. Defaults to `'{}'`.

- `access-token-header`
  Header field on which to pass the access token.

- `body`
  The request body as a JSON string. Defaults to `'{}'`. Alternatively, reference a file with a JSON string using `--body='@mocks/create.json'` where `mocks/create.json` is the file with the request body.

For additional documentation on the format for `params` and `additional-params`; refer to the generic [API Gateway Client][apiGClient] docs.

### Examples

To pass in path parameters with your request.

``` bash
$ npx aws-api-gateway-cli-test \
--username='email@example.com' \
--password='password' \
--user-pool-id='abc' \
--app-client-id='def' \
--cognito-region='us-east-1' \
--identity-pool-id='ghi' \
--invoke-url='https://123.execute-api.us-east-1.amazonaws.com/prod' \
--api-gateway-region='us-east-1' \
--path-template='/notes/{id}' \
--params='{"id":"456"}' \
--method='GET'
```

To pass in query parameters and headers with your request.

``` bash
$ npx aws-api-gateway-cli-test \
--username='email@example.com' \
--password='password' \
--user-pool-id='abc' \
--app-client-id='def' \
--cognito-region='us-east-1' \
--identity-pool-id='ghi' \
--invoke-url='https://123.execute-api.us-east-1.amazonaws.com/prod' \
--api-gateway-region='us-east-1' \
--path-template='/notes' \
--additional-params='{"queryParams":{"param0":"abc"},"headers":{"param1":"123"}}' \
--method='GET'
```


### Local Development

Clone the repo and initialize the project.

```
$ git clone https://github.com/AnomalyInnovations/aws-api-gateway-cli-test
$ cd aws-api-gateway-cli-test
$ npm install
```

Test the command using `node index.js`.

To install the `apig-test` command, run the following:

```
$ npm link
```


[apiGClient]: https://github.com/kndt84/aws-api-gateway-client
[fTwitter]: https://twitter.com/fanjiewang
[jTwitter]: https://twitter.com/jayair
[email]: mailto:hello@serverless-stack.com
