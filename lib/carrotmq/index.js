var _ = require('underscore');
var amqp = require('amqp');


/**
 * Broker constructor
 */
var Broker = function() {};


/**
 * Broker datas
 */
Broker.connections = [];


/**
 * Broker children class
 */
Broker.Connection = require('./Connection');
Broker.Exchange = require('./Exchange');
Broker.Queue = require('./Queue');


/**
 * Create connection
 *
 * @params {String} name
 * @params {Object|Array} config
 *
 * @return Promise
 * @api public
 */
Broker.createConnection = function(name, config) {

    // Check datas
    if(typeof name !== "string")
        throw new Error("name have to be a string");
    if(typeof config !== "object")
        throw new Error("config have to be an object");

    // Get existing connection
    var existingConnection = _.find(Broker.connections, function(obj) { return obj.name === name; });

    // Check if connection already exists
    if(existingConnection) {
        throw new Error(name + " is already a defined connection")
    }

    // Return promise
    return new Broker.Connection(name, config)
        .then(function(connection) {

            // Save connection
            Broker.connections.push(connection);

            // Resolve
            return Promise.resolve(connection);

        });

};

/**
 * Get connections
 *
 * @return [ Broker.Connection, ... ]
 * @api public
 */
Broker.getConnections = function() {
    return Broker.connections;
};

/**
 * Get connection
 *
 * @params {String} name
 *
 * @return Broker.Connection
 * @api public
 */
Broker.getConnection = function(name) {

    // Check data
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === name; });
    
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
Broker.removeConnection = function(name) {

    // Check datas
    if(typeof name !== "string")
        throw new Error("name have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === name; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(name + " is not a defined connection");
    }

    // Disconnect
    connection.driverInstance.disconnect();

    // Remove connection
    Broker.connections = _.reject(Broker.connections, function(obj) { return obj === connection; });

};


/**
 * Create exchange
 *
 * @params {String} connectionName
 * @params {String} exchangeName
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
Broker.createExchange = function(connectionName, exchangeName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get connection
    connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return new Broker.Exchange(connection, exchangeName, options)
        .then(function(exchange) {

            // Save exchange
            connection.exchanges.push(exchange);

            // Resolve
            return Promise.resolve(exchange);

        });

};

/**
 * Create reply exchange
 *
 * @params {String} connectionName
 * @params {String} exchangeName
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
Broker.createReplyExchange = function(connectionName, exchangeName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Get connection
    connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return Broker.createExchange(connectionName, exchangeName, options)
        .then(function(exchange) {

            // Save exchange
            connection.replyExchange = exchange;

            // Resolve
            return Promise.resolve(exchange);

        });

};

/**
 * Get exchanges
 *
 * @params {String} connectionName
 *
 * @return [ Broker.Exchange, ... ]
 * @api public
 */
Broker.getExchanges = function(connectionName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return exchanges
    return connection.exchanges;

};

/**
 * Get exchange
 *
 * @params {String} connectionName
 * @params {String} exchangeName
 *
 * @return Broker.Exchange
 * @api public
 */
Broker.getExchange = function(connectionName, exchangeName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Get exchange
    var exchange = _.find(connection.exchanges, function(obj) { return obj.name === exchangeName; });
    
    // Check if exists
    if(typeof exchange === "undefined") {
        throw new Error(exchangeName + " is not a defined exchange");
    }

    // Return exchange
    return exchange;

};

/**
 * Remove exchange
 *
 * @params {String} connectionName
 * @params {String} exchangeName
 *
 * @api public
 */
Broker.removeExchange = function(connectionName, exchangeName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Get exchange
    var exchange = _.find(connection.exchanges, function(obj) { return obj.name === exchangeName; });
    
    // Check if exists
    if(typeof exchange === "undefined") {
        throw new Error(exchangeName + " is not a defined exchange");
    }

    // Remove exchange
    connection.exchanges = _.reject(connection.exchanges, function(obj) { return obj === exchange; });

};


/**
 * Create queue
 *
 * @params {String}       connectionName
 * @params {String}       queueName
 * @params {Object|Array} options
 *
 * @return Promise
 * @api public
 */
Broker.createQueue = function(connectionName, queueName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get connection
    connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return new Broker.Queue(connection, queueName, options)
        .then(function(queue) {

            // Save queue
            connection.queues.push(queue);

            // Resolve
            return Promise.resolve(queue);

        });

};

/**
 * Create reply queue
 *
 * @params {String} connectionName
 * @params {String} queueName
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
Broker.createReplyQueue = function(connectionName, queueName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Get connection
    connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return Broker.createQueue(connectionName, queueName, options)
        .then(function(queue) {

            // Save queue
            connection.replyQueue = queue;

            // Resolve
            return Promise.resolve(queue);

        });

};

/**
 * Get queues
 *
 * @params {String} connectionName
 *
 * @return [ Broker.Queue, ... ]
 * @api public
 */
Broker.getQueues = function(connectionName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return queues
    return connection.queues;

};

/**
 * Get queue
 *
 * @params {String} connectionName
 * @params {String} queueName
 *
 * @return Broker.Queue
 * @api public
 */
Broker.getQueue = function(connectionName, queueName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Get queue
    var queue = _.find(connection.queues, function(obj) { return obj.name === queueName; });
    
    // Check if exists
    if(typeof queue === "undefined") {
        throw new Error(queueName + " is not a defined queue");
    }

    // Return queue
    return queue;

};

/**
 * Remove queue
 *
 * @params {String} connectionName
 * @params {String} queueName
 *
 * @api public
 */
Broker.removeQueue = function(connectionName, queueName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Get queue
    var queue = _.find(connection.queues, function(obj) { return obj.name === queueName; });
    
    // Check if exists
    if(typeof queue === "undefined") {
        throw new Error(queueName + " is not a defined queue");
    }

    // Remove queue
    connection.queues = _.reject(connection.queues, function(obj) { return obj === queue; });

};


/**
 * Reply
 *
 * @params {String} connectionName
 * @params {String} taskId
 * @params {Any} result
 *
 * @api public
 */
Broker.reply = function(connectionName, taskId, result) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof taskId !== "string")
        throw new Error("taskId have to be a string");

    // Get connection
    var connection = _.find(Broker.connections, function(obj) { return obj.name === connectionName; });
    
    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Publish
    return connection.replyExchange.publish('', { _task_id: taskId, result: result });

};


/**
 * Module exports
 */
module.exports = Broker;