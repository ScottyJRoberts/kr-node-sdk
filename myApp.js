require('dotenv').config();
var KnowledgeObject = require('./sdk/object');
var KnowledgeRelation = require('./sdk/relation');

var createObjects = function() {
  person = new KnowledgeObject('Person', {
    'name': 'TestScott',
    'latitude': 12.456,
    'longitude': 67.99
  }
);
  oven = new KnowledgeObject('Oven', {
    'name': 'Oven',
    'isOpen': false,
    'on': false,
    'temp': 0
  });

  house = new KnowledgeObject('House', {
    'latitude': 12.345,
    'longitude': 67.890,
    'name': 'home'
  });

};

var createRelations = function() {
  personToHouse = new KnowledgeRelation(
    'ownership', person, house
  );

  houseToOven = new KnowledgeRelation(
    'has-as-part', house, oven
  );
};

Promise.all(
  [createObjects(),
  person.create(),
  house.create(),
  oven.create()
]).then(
  function (results) {
    console.log('All Objects created \n\n');

    Promise.all(
      [createRelations(),
      personToHouse.create(),
      houseToOven.create()]
    ).then(
      function (results) {
        console.log('All relations created\n\n');
      }
    );
  }
);
