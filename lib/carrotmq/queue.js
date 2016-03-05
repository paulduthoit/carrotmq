var amqp = require('amqp');
var Connection = require('./connection.js');


/**
 * Queue constructor
 *
 * @params {Broker.Connection} connection
 * @params {String} name
 * @params {Object} [options]
 *
 * @return Promise
 * @api public
 *
 * @constructor
 */
var Queue = function(connection, name, options) {

    // Check arguments
    if(typeof options === "undefined")
        options = {};

    // Check data
    if(!(connection instanceof Connection))
        throw new Error("connection have to be a Broker.Connection");
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Data
    var self = this;

    // Return promise
    return new Promise(function(resolve, reject) {

        // Get queue
        connection.driverInstance.queue(name, options, function(queue) {

            // Set instance data
            self.connection = connection;
            self.name = queue.name;
            self.driverInstance = queue;

            // Resolve
            resolve(self);
            return;

        });
        return;

    });

};


/**
 * Queue datas
 */
Queue.prototype.connection;
Queue.prototype.name;
Queue.prototype.driverInstance;


/**
 * Bind
 *
 * @params {String} exchangeName
 * @params {String} routingKey
 *
 * @return Promise
 * @api public
 */
Queue.prototype.bind = function(exchangeName, routingKey) {

    // Data
    var self = this;

    // Return promise
    return new Promise(function(resolve, reject) {

        // Publish
        self.driverInstance.bind(exchangeName, routingKey, function() {

            // Resolve
            resolve();
            return;

        });
        return;

    });

};


/**
 * Unbind
 *
 * @params {String} exchangeName
 * @params {String} routingKey
 *
 * @return Promise
 * @api public
 */
Queue.prototype.unbind = function(exchangeName, routingKey) {

    // Unbind
    this.driverInstance.unbind(exchangeName, routingKey);

    // Resolve
    return Promise.resolve();

};


/**
 * Subscribe
 *
 * @params {Object} options
 * @params {Function} listener
 *
 * @return Promise
 * @api public
 */
Queue.prototype.subscribe = function(options, listener) {

    // Data
    var self = this;

    // Return promise
    return new Promise(function(resolve, reject) {

        // Subscribe
        self.driverInstance.subscribe(options, listener)
            .addCallback(function(ok) {

                // Resolve
                resolve(ok);
                return;

            });
            return;

    });

};


/**
 * Unsubscribe
 *
 * @params {String} consumerTag
 *
 * @return Promise
 * @api public
 */
Queue.prototype.unsubscribe = function(consumerTag) {

    // Unsubscribe
    this.driverInstance.unsubscribe(consumerTag);

    // Resolve
    return Promise.resolve();

};


/**
 * Destroy
 *
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
Queue.prototype.destroy = function(options) {

    // Unsubscribe
    this.driverInstance.destroy(options);

    // Resolve
    return Promise.resolve();

};


/**
 * Module exports
 */
module.exports = Queue;