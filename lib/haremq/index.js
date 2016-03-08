var _ = require('underscore');
var amqp = require('amqp');


/**
 * HareMQ constructor
 */
var HareMQ = function() {};


/**
 * HareMQ datas
 */
HareMQ.connections = [];


/**
 * HareMQ children class
 */
HareMQ.Connection = require('./connection');
HareMQ.Exchange = require('./exchange');
HareMQ.Queue = require('./queue');


/**
 * Create connection
 *
 * @params {String} name
 * @params {Object|Array} config
 *
 * @return Promise of HareMQ.Connection
 * @api public
 */
HareMQ.createConnection = function(name, config) {

    // Check datas
    if(typeof name !== "string")
        throw new Error("name have to be a string");
    if(typeof config !== "object")
        throw new Error("config have to be an object");

    // Get existing connection
    var existingConnection = _.find(HareMQ.connections, function(obj) { return obj.name === name; });

    // Check if connection already exists
    if(existingConnection) {
        throw new Error(name + " is already a defined connection")
    }

    // Return promise
    return new HareMQ.Connection(name, config)
        .then(function(connection) {

            // Save connection
            HareMQ.connections.push(connection);

            // Resolve
            return Promise.resolve(connection);

        });

};

/**
 * Get connections
 *
 * @return [ HareMQ.Connection, ... ]
 * @api public
 */
HareMQ.getConnections = function() {
    return HareMQ.connections;
};

/**
 * Get connection
 *
 * @params {String} name
 *
 * @return HareMQ.Connection
 * @api public
 */
HareMQ.getConnection = function(name) {

    // Check data
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Get connection
    var connection = _.find(HareMQ.connections, function(obj) { return obj.name === name; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        return undefined;
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
HareMQ.removeConnection = function(name) {

    // Check datas
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Get connection
    var connection = _.find(HareMQ.connections, function(obj) { return obj.name === name; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(name + " is not a defined connection");
    }

    // Disconnect
    connection.driverInstance.disconnect();

    // Remove connection
    HareMQ.connections = _.reject(HareMQ.connections, function(obj) { return obj === connection; });

};


/**
 * Module exports
 */
module.exports = HareMQ;