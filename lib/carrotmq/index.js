var _ = require('underscore');
var amqp = require('amqp');


/**
 * CarrotMQ constructor
 */
var CarrotMQ = function() {};


/**
 * CarrotMQ datas
 */
CarrotMQ.connections = [];


/**
 * CarrotMQ children class
 */
CarrotMQ.Connection = require('./connection');
CarrotMQ.Exchange = require('./exchange');
CarrotMQ.Queue = require('./queue');


/**
 * Create connection
 *
 * @params {String} name
 * @params {Object|Array} config
 *
 * @return Promise of CarrotMQ.Connection
 * @api public
 */
CarrotMQ.createConnection = function(name, config) {

    // Check datas
    if(typeof name !== "string")
        throw new Error("name have to be a string");
    if(typeof config !== "object")
        throw new Error("config have to be an object");

    // Get existing connection
    var existingConnection = _.find(CarrotMQ.connections, function(obj) { return obj.name === name; });

    // Check if connection already exists
    if(existingConnection) {
        throw new Error(name + " is already a defined connection")
    }

    // Return promise
    return new CarrotMQ.Connection(name, config)
        .then(function(connection) {

            // Save connection
            CarrotMQ.connections.push(connection);

            // Resolve
            return Promise.resolve(connection);

        });

};

/**
 * Get connections
 *
 * @return [ CarrotMQ.Connection, ... ]
 * @api public
 */
CarrotMQ.getConnections = function() {
    return CarrotMQ.connections;
};

/**
 * Get connection
 *
 * @params {String} name
 *
 * @return CarrotMQ.Connection
 * @api public
 */
CarrotMQ.getConnection = function(name) {

    // Check data
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === name; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(name + " is not a defined connection");
    }

    // Return connection
    return connection;

};

/**
 * Remove connection
 *
 * @params {String} name
 *
 * @api public
 */
CarrotMQ.removeConnection = function(name) {

    // Check datas
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === name; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(name + " is not a defined connection");
    }

    // Disconnect
    connection.driverInstance.disconnect();

    // Remove connection
    CarrotMQ.connections = _.reject(CarrotMQ.connections, function(obj) { return obj === connection; });

};


/**
 * Module exports
 */
module.exports = CarrotMQ;