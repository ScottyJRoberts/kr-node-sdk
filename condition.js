require('dotenv').config({path: __dirname + '/.env'});
var KnowledgeObject = require('./sdk/object');
var KnowledgeRelation = require('./sdk/relation');


function getHouseAndPersonForOven(ovenID) {
  console.log('within the get house and person for Oven');
  var oven, house, owner;
  return KnowledgeObject.retrieve(ovenID).then((ovenObj)=> {
    oven = ovenObj;
    console.log('Oven id is ', oven.id);

    //get the house of the oven
    return oven.both('has-as-part');
  }).then((parts)=> {
    console.log('parts are ', parts);
    house = parts[0];
    console.log('House id is ', house.id);
    return house.both('ownership');
  }).then((owners) => {
    console.log('Down to the ownership level');
    owner = owners[0];
    console.log('Owner id is ', owner.id);
    return new Promise((res, rej) => {
      res([oven, house, owner]);
    });
  }).catch((err) => {
    console.log('Error: ' + err);
  });
}

function checkType(event, type) {
  var eventType = event[0]['type'];
  if (eventType === type) {
    return true;
  } else {return false;}
}

function returnContent(value) {
  return {
    headers: {
      'Content-Type': 'text/plain'
    },
    statusCode: 200,
    body: `${value}`
  };
}


function main(event){
  console.log('within the main function');
  console.log('event is: ', event);
  var id = event.results[0]['id'];
  console.log('got oven id as ' + id);
  if (checkType(event.results, 'Oven')) {
    return getHouseAndPersonForOven(id).then((objects)=>{
      console.log('OBJECTS ARE: ', objects);

      var oven = objects[0];
      var house = objects[1];
      var owner = objects[2];
      //test to see if the oven has been made into the correct way
      if (oven.attributes.on && oven.attributes['temp'] != 400) {
        console.log('oven is at the wrong temp');
        return returnContent(true);
      }
      else if (oven.attributes.on && oven.attributes['temp'] == 400) {
        console.log('oven is at the right temp');
        return returnContent(false);
      } else {
        console.log('oven is not on');
        return returnContent(false);
      }
      //if the oven is open and the owner isn't home
      if (oven.attributes.isOpen && (
        owner.attributes['longitude'] != house.attributes['longitude'] ||
          owner.attributes['latitude'] != house.attributes['latitude']
      )) {
        console.log('OVENS ON HOUSE IS BURNING DOWN');
        return returnContent(true);
      } else {
        console.log('Oven is not on or the owner is home');
        return returnContent(false);
      }
    });
  } else {
    console.log('apparently it wasn\'t an oven....');
    return returnContent(false);
  }
}

if (require.main === module) {
  console.log('Running Locally');
  objId = process.argv[2];
  console.log('id pulled in is ', process.argv);
  main({results: [{id: objId, type: 'Oven'}]}).then((results) => {
    console.log('action is done running, GREAT SUCCESS');
    console.log(JSON.stringify(results));

  }).catch((err) =>{
    console.log('action is done running, error');
    console.log(err);
  })
} else {
  console.log('running in openwhisk');
  exports.main = main;
}
