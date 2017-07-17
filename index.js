#!/usr/bin/env node

var AWS = require('aws-sdk');
var AWSCognito = require('amazon-cognito-identity-js');
var apigClientFactory = require('aws-api-gateway-client').default;

var argv = require('yargs')
  .option('username', {
    describe: 'Username of the user',
    demandOption: true
  })
  .option('password', {
    describe: 'Password of the user',
    demandOption: true
  })
  .option('user-pool-id', {
    describe: 'Cognito user pool id',
    demandOption: true
  })
  .option('app-client-id', {
    describe: 'Cognito user pool app client id',
    demandOption: true
  })
  .option('cognito-region', {
    describe: 'Cognito region',
    default: 'us-east-1'
  })
  .option('identity-pool-id', {
    describe: 'Cognito identity pool id',
    demandOption: true
  })
  .option('invoke-url', {
    describe: 'API Gateway URL',
    demandOption: true
  })
  .option('api-gateway-region', {
    describe: 'API Gateway region',
    default: 'us-east-1'
  })
  .option('path-template', {
    describe: 'API path template',
    demandOption: true
  })
  .option('method', {
    describe: 'API method',
    default: 'GET'
  })
  .option('params', {
    describe: 'API request params',
    default: '{}'
  })
  .option('additional-params', {
    describe: 'API request additional params',
    default: '{}'
  })
  .option('body', {
    describe: 'API request body',
    default: '{}'
  })
  .argv;


function authenticate(callback) {
  var poolData = {
    UserPoolId : argv.userPoolId,
    ClientId : argv.appClientId
  };

  AWS.config.update({ region: argv.cognitoRegion });
  var userPool = new AWSCognito.CognitoUserPool(poolData);

  var userData = {
    Username: argv.username,
    Pool: userPool
  };
  var authenticationData = {
    Username: argv.username,
    Password: argv.password
  };
  var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

  var cognitoUser = new AWSCognito.CognitoUser(userData);

  console.log('Authenticating with User Pool');

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      callback(result.getIdToken().getJwtToken());
    },
    onFailure: function(err) {
      console.log(err.message ? err.message : err);
    }
  });
}

function getCredentials(userToken, callback) {
  console.log('Getting temporary credentials');

  var logins = {};

  logins['cognito-idp.' + argv.cognitoRegion + '.amazonaws.com/' + argv.userPoolId] = userToken;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: argv.identityPoolId,
    Logins: logins
  });

  AWS.config.credentials.get(function(err) {
    if (err) {
      console.log(err.message ? err.message : err);
      return;
    }

    callback();
  });
}

function makeRequest() {
  console.log('Making API request');

  var apigClient = apigClientFactory.newClient({
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: argv.apiGatewayRegion,
    invokeUrl: argv.invokeUrl
  });

  var params = JSON.parse(argv.params);
  var additionalParams = JSON.parse(argv.additionalParams);
  var body = JSON.parse(argv.body);

  apigClient.invokeApi(params, argv.pathTemplate, argv.method, additionalParams, body)
    .then(function(result) {
      console.dir({
        status: result.status,
        statusText: result.statusText,
        data: result.data
      });
    })
    .catch(function(result) {
      if (result.response) {
        console.dir({
          status: result.response.status,
          statusText: result.response.statusText,
          data: result.response.data
        });
      }
      else {
        console.log(result.message);
      }
    });
}

authenticate(
  function(token) {
    getCredentials(token, makeRequest);
  }
);
