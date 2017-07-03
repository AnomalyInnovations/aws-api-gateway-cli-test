# aws-api-gateway-cli-test

A simple CLI to test API Gateway endpoints with IAM authorization

### Installation

To install globally run the following:

```
$ npm install -g aws-api-gateway-cli-test
```

### Usage

Example:

```
aws-api-gateway-cli-test index.js \
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
