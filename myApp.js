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
    'on': false
  });

};

var createRelations = function() {
  personToOven = new KnowledgeRelation(
    'ownership', person, oven
  );
};

Promise.all(
  [createObjects(),
  person.create(),
  oven.create()
]).then(
  function (results) {
    console.log('All Objects created \n\n');

    Promise.all(
      [createRelations(),
      personToOven.create()]
    ).then(
      function (results) {
        console.log('All relations created\n\n');
      }
    );
  }
);
