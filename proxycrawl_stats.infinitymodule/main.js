const fiplab = require('fiplab');
const request = require('request');
const util = require('util');

let userArguments = fiplab.arguments;

const urlFormat = 'https://proxycrawl.com/dashboard/tokens?normal=%s&javascript=%s';
const options = {
  url: util.format(urlFormat, userArguments.normalToken, userArguments.javascriptToken)
};

const parseJSONResponse = (json) => {
  try {
    const stats = json.stats;
    let value;
    if (userArguments.display === 'total_count') {
      value = stats.normal_count * 1 + stats.javascript_count * 1;
    } else if (userArguments.display === 'total_price') {
      value = stats.normal_price * 1 + stats.javascript_price * 1;
    } else {
      value = stats[userArguments.display];
    }
    value = Math.round(value * 100) / 100;
    if (userArguments.display.indexOf('_price') > -1) {
      value = '$' + value;
    }
    fiplab.exit('' + value, true);
  } catch(exception) {
    console.error(json);
    console.error(exception.toString());
    fiplab.exit('Invalid response from the server.', false);
  }
};

let callback = (error, resp, body) => {
  if (resp.statusCode !== 200){
    fiplab.exit('Invalid tokens.', false);
  }
  try {
    let json = JSON.parse(body);
    parseJSONResponse(json);
  } catch(exception){
    fiplab.exit(exception.toString(), false);
  }
};

request(options, callback);
