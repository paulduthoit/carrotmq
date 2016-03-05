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
 * @return Promise
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
 * Create exchange
 *
 * @params {String} connectionName
 * @params {String} exchangeName
 * @params {Object} options
 *
 * @return Promise
 * @api public
 */
CarrotMQ.createExchange = function(connectionName, exchangeName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get connection
    connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return new CarrotMQ.Exchange(connection, exchangeName, options)
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
CarrotMQ.createReplyExchange = function(connectionName, exchangeName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Get connection
    connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return CarrotMQ.createExchange(connectionName, exchangeName, options)
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
 * @return [ CarrotMQ.Exchange, ... ]
 * @api public
 */
CarrotMQ.getExchanges = function(connectionName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
 * @return CarrotMQ.Exchange
 * @api public
 */
CarrotMQ.getExchange = function(connectionName, exchangeName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
CarrotMQ.removeExchange = function(connectionName, exchangeName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
CarrotMQ.createQueue = function(connectionName, queueName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get connection
    connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return new CarrotMQ.Queue(connection, queueName, options)
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
CarrotMQ.createReplyQueue = function(connectionName, queueName, options) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Get connection
    connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });

    // Check if exists
    if(typeof connection === "undefined") {
        throw new Error(connectionName + " is not a defined connection");
    }

    // Return promise
    return CarrotMQ.createQueue(connectionName, queueName, options)
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
 * @return [ CarrotMQ.Queue, ... ]
 * @api public
 */
CarrotMQ.getQueues = function(connectionName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
 * @return CarrotMQ.Queue
 * @api public
 */
CarrotMQ.getQueue = function(connectionName, queueName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
CarrotMQ.removeQueue = function(connectionName, queueName) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
CarrotMQ.reply = function(connectionName, taskId, result) {

    // Check data
    if(typeof connectionName !== "string")
        throw new Error("connectionName have to be a string");
    if(typeof taskId !== "string")
        throw new Error("taskId have to be a string");

    // Get connection
    var connection = _.find(CarrotMQ.connections, function(obj) { return obj.name === connectionName; });
    
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
module.exports = CarrotMQ;