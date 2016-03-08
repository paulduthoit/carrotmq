var _ = require('underscore');
var hat = require('hat');
var amqp = require('amqp');


/**
 * Exchange constructor
 *
 * @params {HareMQ.Connection} connection
 * @params {String} name
 * @params {Object} [options]
 *
 * @return Promise
 * @api public
 *
 * @constructor
 */
var Exchange = function(connection, name, options) {

    // Data
    var HareMQ = require('./index');

    // Check arguments
    if(typeof options === "undefined")
        options = {};

    // Check data
    if(!(connection instanceof HareMQ.Connection))
        throw new Error("connection have to be a HareMQ.Connection");
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
 * Destroy
 *
 * @params {Boolean} ifUnused
 *
 * @return Promise
 * @api public
 */
Exchange.prototype.destroy = function(ifUnused) {

    // Data
    var HareMQ = require('./index');
    var self = this;

    // Destroy
    this.driverInstance.destroy(ifUnused);

    // Remove exchange from connection exchanges
    self.connection.exchanges = _.reject(self.connection.exchanges, function(obj) { return obj === self; });

};


/**
 * Module exports
 */
module.exports = Exchange;