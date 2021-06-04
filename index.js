#!/usr/bin/env node

var packageJson = require("./package.json");
var fs = require("fs");

var AWS = require("aws-sdk");
var AWSCognito = require("amazon-cognito-identity-js");
var apigClientFactory = require("aws-api-gateway-client").default;
var WindowMock = require("window-mock").default;

global.window = { localStorage: new WindowMock().localStorage };
global.navigator = function() {
  return null;
};

var argv = require("yargs")
  .option("username", {
    describe: "Username of the user",
    demandOption: true,
    string: true
  })
  .option("password", {
    describe: "Password of the user",
    demandOption: true
  })
  .option("user-pool-id", {
    describe: "Cognito user pool id",
    demandOption: true
  })
  .option("app-client-id", {
    describe: "Cognito user pool app client id",
    demandOption: true
  })
  .option("cognito-region", {
    describe: "Cognito region",
    default: "us-east-1"
  })
  .option("identity-pool-id", {
    describe: "Cognito identity pool id",
    demandOption: true
  })
  .option("invoke-url", {
    describe: "API Gateway URL",
    demandOption: true
  })
  .option("api-gateway-region", {
    describe: "API Gateway region",
    default: "us-east-1"
  })
  .option("api-key", {
    describe: "API Key",
    default: undefined
  })
  .option("path-template", {
    describe: "API path template",
    demandOption: true
  })
  .option("method", {
    describe: "API method",
    default: "GET"
  })
  .option("params", {
    describe: "API request params",
    default: "{}"
  })
  .option("additional-params", {
    describe: "API request additional params",
    default: "{}"
  })
  .option("body", {
    describe: "API request body",
    default: "{}"
  })
  .option("access-token-header", {
    describe: "Header to use to pass access token with request"
  })
	.option("debug",{
    describe: "Additional debug output for response and errors",
    default: false
  })
  .help("h")
	.alias("d", "debug")
  .alias("h", "help")
  .alias("v", "version")
  .version(packageJson.version)
  .wrap(null).argv;

function authenticate(callback) {
  var poolData = {
    UserPoolId: argv.userPoolId,
    ClientId: argv.appClientId
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
  var authenticationDetails = new AWSCognito.AuthenticationDetails(
    authenticationData
  );

  var cognitoUser = new AWSCognito.CognitoUser(userData);

  console.log("Authenticating with User Pool");

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      callback({
        idToken: result.getIdToken().getJwtToken(),
        accessToken: result.getAccessToken().getJwtToken()
      });
    },
    onFailure: function(err) {
      console.log(err.message ? err.message : err);
    },
    newPasswordRequired: function() {
      console.log("Given user needs to set a new password");
    },
    mfaRequired: function() {
      console.log("MFA is not currently supported");
    },
    customChallenge: function() {
      console.log("Custom challenge is not currently supported");
    }
  });
}

function getCredentials(userTokens, callback) {
  console.log("Getting temporary credentials");

  var logins = {};
  var idToken = userTokens.idToken;
  var accessToken = userTokens.accessToken;

  logins[
    "cognito-idp." + argv.cognitoRegion + ".amazonaws.com/" + argv.userPoolId
  ] = idToken;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: argv.identityPoolId,
    Logins: logins
  });

  AWS.config.credentials.get(function(err) {
    if (err) {
      console.log(err.message ? err.message : err);
      return;
    }

    callback(userTokens);
  });
}

function makeRequest(userTokens) {
  console.log("Making API request");

  var apigClient = apigClientFactory.newClient({
    apiKey: argv.apiKey,
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: argv.apiGatewayRegion,
    invokeUrl: argv.invokeUrl
  });

  var params = JSON.parse(argv.params);
  var additionalParams = JSON.parse(argv.additionalParams);

  var body = "";
  if (argv.body.startsWith("@")) {
    // Body from file
    const bodyFromFile = argv.body.replace(/^@/, "");
    const contentFromFile = fs.readFileSync(bodyFromFile);
    body = JSON.parse(contentFromFile);
  }
  else {
    body = JSON.parse(argv.body);
  }

  if (argv.accessTokenHeader) {
    const tokenHeader = {};
    tokenHeader[argv.accessTokenHeader] = userTokens.accessToken;
    additionalParams.headers = Object.assign(
      {},
      additionalParams.headers,
      tokenHeader
    );
  }

  apigClient
    .invokeApi(params, argv.pathTemplate, argv.method, additionalParams, body)
    .then(function(result) {
      console.dir({
        status: result.status,
        statusText: result.statusText,
				showHidden:argv.debug,
				depth:argv.debug ? null : 2,
				colors:argv.debug
      });
    })
    .catch(function(result) {
      if (result.response) {
        console.dir({
          status: result.response.status,
          statusText: result.response.statusText,
          showHidden:argv.debug,
          depth:argv.debug ? null : 2,
          colors:argv.debug
      });
      } else {
        console.log(result.message);
      }
    });
}

authenticate(function(tokens) {
  getCredentials(tokens, makeRequest);
});
