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

/* Access sonic sensor module */
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var init = false;

const sampleSize = 2;

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
var value
var ultraSonicSensor1, ultraSonicSensor2, ultraSonicSensor3, ultraSonicSensor4
var lightSensor

function getSensorData(req, res) {

    var board = new Board({
        debug: true,
        onError: function(err) {
            console.log('Something wrong just happened')
            console.log(err)
        },
        onInit: function(response) {
            if (response) {
                console.log('GrovePi Version :: ' + board.version())
                ultraSonicSensor1 = new UltrasonicDigitalSensor(2)
                ultraSonicSensor2 = new UltrasonicDigitalSensor(3)
                ultraSonicSensor3 = new UltrasonicDigitalSensor(4)
                ultraSonicSensor4 = new UltrasonicDigitalSensor(8)
                lightSensor = new LightAnalogSensor(0)

            }
        }
    })

   if(init == false){
       board.init();
       init = true;
   }


    var avgSensor1 = 0;
    var avgSensor2 = 0;
    var avgSensor3 = 0;
    var avgSensor4 = 0;

    console.log(lightSensor.read())

    var avglightSensor = 0
    for (var i = 0; i < 1000; i++) {
        var temp = lightSensor.read()
        if (!isNaN(temp))
            avglightSensor += temp
    }

    console.log("avg:" + Math.round(avglightSensor / 1000))


    /*console.log('Light Analog Sensor (start watch)')
    lightSensor.on('change', function(res) {
        console.log('Light onChange value=' + res)
    })
    lightSensor.watch()
*/
    for (var i = 0; i < sampleSize; i++) {
        avgSensor1 += ultraSonicSensor1.read()
        avgSensor2 += ultraSonicSensor2.read()
        avgSensor3 += ultraSonicSensor3.read()
        avgSensor4 += ultraSonicSensor4.read()
    }

    avgSensor1 = avgSensor1 / sampleSize
    avgSensor2 = avgSensor2 / sampleSize
    avgSensor3 = avgSensor3 / sampleSize
    avgSensor4 = avgSensor4 / sampleSize

    avgSensor1 = Math.round(avgSensor1)
    avgSensor2 = Math.round(avgSensor2)
    avgSensor3 = Math.round(avgSensor3)
    avgSensor4 = Math.round(avgSensor4)


    var dataStr = [{"sensor1" : avgSensor1, "sensor2" : avgSensor2, "sensor3" : avgSensor3, "sensor4" : avgSensor4}]

    res.json(dataStr)
}
