'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

/* Add sonic sensor module */
var GrovePi = require('node-grovepi').GrovePi

/* Add base classes */
var Commands = GrovePi.commands
var Board = GrovePi.board

/* Access analog sensor module */
var SoundSensor = GrovePi.sensors.LoudnessAnalog
var init = false;
var avgSoundSensor = 0;

const sampleSize = 500;

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/sensor' path has an operationId named 'sensor'.  Here,
  we specify that in the exports of this module that 'sensor' maps to the function named 'sensor'
 */
module.exports = {
    sensor: getSensorData
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
var soundSensor;

function startReading(){
    if(init != true)
        setInterval(readSensor, 1500);
}

function getSensorData(req, res) {

    var board = new Board({
        debug: true,
        onError: function(err) {
            console.log('Something wrong just happened')
            console.log(err)
        },
        onInit: function(response) {
            if (response) {
                console.log('GrovePi Version :: ' + board.version());
                soundSensor = new SoundSensor(0);
                soundSensor.start()
                console.log('GrovePi Loudnes Sensor initialized.');
            }
        }
    });

    if(init == false){
        board.init();
        init = true;
    }

    var avgSoundSensor = soundSensor.readAvgMax();
    var dataStr = [{"soundsensor" : avgSoundSensor}];
    res.json(dataStr);
}
