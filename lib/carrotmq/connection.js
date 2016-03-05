var amqp = require('amqp');


/**
 * Connection constructor
 *
 * @params {String} name
 * @params {Object} config
 *
 * @return Promise
 * @api public
 *
 * @constructor
 */
var Connection = function(name, config) {

    // Check data
    if(typeof name !== "string")
        throw new Error("name have to be a string");
    if(typeof config !== "object" || config === null)
        throw new Error("config have to be an object");

    // Data
    var self = this;

    // Return promise
    return new Promise(function(resolve, reject) {

        // Connection to server
        var connection = amqp.createConnection(config, { reconnect: false });

        // Set error handler
        var errorHandler = function(err) {

            // Reject
            reject(err);
            return;

        };

        // On error
        connection.on('error', errorHandler);

        // On ready
        connection.once('ready', function() {

            // Set instance data
            self.name = name;
            self.driverInstance = connection;

            // Remove error listener
            connection.removeListener('error', errorHandler);

            // Resolve
            resolve(self);
            return;

        });

    });

};


/**
 * Connection datas
 */
Connection.prototype.name;
Connection.prototype.driverInstance;
Connection.prototype.exchanges = [];
Connection.prototype.queues = [];
Connection.prototype.replyExchange = null;
Connection.prototype.replyQueue = null;


/**
 * Module exports
 */
module.exports = Connection;