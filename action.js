require('dotenv').config({ path: __dirname + '/.env' });
var request = require('request');
var KnowledgeObject = require('./sdk/object');

function main(event) {
  console.log('in chatbot action main');
  var id = event.results[0].id;
  console.log('oven id, because that\'s a thing is ', id);
  return KnowledgeObject.retrieve(id).then((ovenObj) => {
    console.log('Oven name is ', JSON.stringify(ovenObj));
    name = ovenObj.attributes.name;

    var post_data = {
      'key': process.env.api_key,
      'alert': 'HOLY SHIT! Your ${name} is open!'
    };
    var headers = {
      'Content-type': 'application/json',
    };
    var options = {
      url: 'http://wpa-chat-bot.mybluemix.net/notification',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post_data)
    };

    return new Promise(function (res, rej) {
      request(options, function (err, response, body) {
        if (err || response.statusCode !== 200) {
          console.log('ERROR status code ' + response.statusCode + ' : '+ err + ' ' + body);
          rejData = {code: response.statusCode, body: body};
          rej(rejData);
        } else {
          resData = {body: body};
          res(resData);
        }
      });
    });
  });
}

if (require.main === module) {
    console.log("running locally")
    // parse the input from the command line $ node index.js 123
    oId = process.argv[2]
    console.log(process.argv)
    main({ results: [{ id: oId, type: 'Oven' }] })
        .then((result) => {
            console.log("action is done running success");
            console.log(JSON.stringify(result));
        })
        .catch((err) => {
            console.log("action is done running error");
            console.log(JSON.stringify(err));
        });
} else {
    console.log("running in openwhisk")
    exports.main = main;
}
