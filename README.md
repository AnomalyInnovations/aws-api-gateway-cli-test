# AWS API Gateway Test CLI <a href="https://www.npmjs.com/package/aws-api-gateway-cli-test"><img alt="NPM Version" src="https://img.shields.io/npm/v/aws-api-gateway-cli-test.svg?style=flat-square" /></a>

A simple CLI to test API Gateway endpoints with IAM authorization. Uses the AWS SDK, AWS Cognito JS SDK, and the generic [API Gateway Client][apiGClient]. Using the login information given, this tool logs a user into the Cognito User Pool, gets the temporary IAM credentials, and makes the API request. It can be difficult to do these steps by hand without scripting them.

### Installation

To install globally run the following:

```
$ npm install -g aws-api-gateway-cli-test
```

### Usage

```
$ apig-test \
  --username='johndoe' \
  --password='password' \
  --user-pool-id='us-east-1_Xxxxxxxx' \
  --app-client-id='29xxyyxxyxxxyyxxxyy' \
  --cognito-region='us-east-1' \
  --identity-pool-id='us-east-1:99xxyyx-9999-9999-xx0x-99xxxxxxxx' \
  --invoke-url='https://99xxxxxxx.execute-api.us-east-1.amazonaws.com' \
  --api-gateway-region='us-east-1' \
  --path-template='/users' \
  --method='GET' \
  --params='{}' \
  --additional-params='{}' \
  --body='{}'
```

This command takes the following options:

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

- `path-template`
  The path template of the API.

- `method`
  The API method. Defaults to `GET`.

- `params`
  The API params (path, header, querystring, etc) as a JSON string. Defaults to `'{}'`.

- `additional-params`
  Any additional params (including the querystring) as a JSON string. Defaults to `'{}'`.

- `body`
  The request body as a JSON string. Defaults to `'{}'`.

For additional documentation on the format for `params` and `additional-params`; refer to the generic [API Gateway Client][apiGClient] docs.

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

### Feedback

Send us your feedback via Twitter to Frank Wang ([@fanjiewang][fTwitter]) or Jay V ([@jayair][jTwitter]). Or send us an [email][email].


[apiGClient]: https://github.com/kndt84/aws-api-gateway-client
[fTwitter]: https://twitter.com/fanjiewang
[jTwitter]: https://twitter.com/jayair
[email]: mailto:contact@anoma.ly
