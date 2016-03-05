var hat = require('hat');
var amqp = require('amqp');
var Connection = require('./connection.js');


/**
 * Exchange constructor
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
var Exchange = function(connection, name, options) {

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

        // Get exchange
        connection.driverInstance.exchange(name, options, function(exchange) {

            // Set instance data
            self.connection = connection;
            self.name = exchange.name;
            self.driverInstance = exchange;

            // Resolve
            resolve(self);
            return;

        });
        return;

    });

};


/**
 * Exchange datas
 */
Exchange.prototype.connection;
Exchange.prototype.name;
Exchange.prototype.driverInstance;


/**
 * Publish
 *
 * @params {String} routingKey
 * @params {Object} body
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
Exchange.prototype.publish = function(routingKey, body, options) {

    // Data
    var self = this;

    // If not in confirm mode
    if(!self.driverInstance.options.confirm) {

        // Data
        var publishError = null;

        // Publish (synchrone)
        self.driverInstance.publish(routingKey, body, options, function(hasErr, err) {

            // Set publishError if error
            if(hasErr) {
                publishError = err;
                return;
            }

        });

        // Check if publish error is defined
        if(publishError) return Promise.reject(publishError);
        else return Promise.resolve();

    }

    // If in confirm mode
    else {

        // Return promise
        return new Promise(function(resolve, reject) {

            // Publish
            self.driverInstance.publish(routingKey, body, options, function(hasErr, err) {

                // Reject if error
                if(hasErr) {
                    reject(err);
                    return;
                }

                // Resolve
                resolve();
                return;

            });

        });

    }

};


/**
 * Request
 *
 * @params {String} routingKey
 * @params {Object} body
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
Exchange.prototype.request = function(routingKey, body, options) {

    // Check data
    if(!(typeof body === "object" && body !== null))
        throw new Error("body have to be an object");

    // Data
    var self = this;
    var taskId = hat();

    // Set task id
    body._task_id = taskId;

    // Run promises
    return self.publish(routingKey, body, options)
        .then(function() {

            // Return promise
            return new Promise(function(resolve, reject) {

                // Data
                var ctag;

                // Reply handler
                var replyHandler = function(payload) {

                    // Stop if invalid task reply
                    if(payload._task_id !== taskId) {
                        return;
                    }

                    // Unsubscribe
                    self.connection.replyQueue.unsubscribe(ctag);

                    // Resolve
                    resolve(payload.result);

                };

                // Subscribe
                self.connection.replyQueue.subscribe(replyHandler)
                    .then(function(ok) {

                        // Set consumer tag
                        ctag = ok.consumerTag;

                    });

            });

        });

};


/**
 * Destroy
 *
 * @params {Boolean} ifUnused
 *
 * @return Promise
 * @api public
 */
Exchange.prototype.destroy = function(ifUnused) {

    // Unsubscribe
    this.driverInstance.destroy(ifUnused);

    // Resolve
    return Promise.resolve();

};


/**
 * Module exports
 */
module.exports = Exchange;