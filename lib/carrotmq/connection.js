var _ = require('underscore');
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
            self.exchanges = [];
            self.queues = [];
            self.replyExchange = null;
            self.replyQueue = null;

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
Connection.prototype.exchanges;
Connection.prototype.queues;
Connection.prototype.replyExchange;
Connection.prototype.replyQueue;


/**
 * Create exchange
 *
 * @params {String} exchangeName
 * @params {Object} options
 *
 * @return Promise of CarrotMQ.Exchange
 * @api public
 *
 * @alternative Connection.prototype.createExchange = function() { ... };
 * @alternative Connection.prototype.createExchange = function(exchangeName) { ... };
 * @alternative Connection.prototype.createExchange = function(options) { ... };
 * @alternative Connection.prototype.createExchange = function(exchangeName, options) { ... };
 */
Connection.prototype.createExchange = function(exchangeName, options) {

    // Data
    var exchangeName;
    var options;

    // Check arguments
    if(arguments.length === 2) {
        exchangeName = arguments[0];
        options = arguments[1];
    } else if(arguments.length === 1 && _.isObject(arguments[0])) {
        options = arguments[0];
    } else if(arguments.length === 1) {
        exchangeName = arguments[0];
    }

    // Default data
    if(_.isUndefined(exchangeName))
        exchangeName = '';
    if(_.isUndefined(options))
        options = {};

    // Check data
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Data
    var self = this;
    var Exchange = require('./exchange');

    // Return promise
    return new Exchange(self, exchangeName, options)
        .then(function(exchange) {

            // Save exchange
            self.exchanges.push(exchange);

            // Resolve
            return Promise.resolve(exchange);

        });

};

/**
 * Get exchanges
 *
 * @return [ CarrotMQ.Exchange, ... ]
 * @api public
 */
Connection.prototype.getExchanges = function() {

    // Return exchanges
    return this.exchanges;

};

/**
 * Get exchange
 *
 * @params {String} exchangeName
 *
 * @return CarrotMQ.Exchange
 * @api public
 */
Connection.prototype.getExchange = function(exchangeName) {

    // Check data
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get exchange
    var exchange = _.find(this.exchanges, function(obj) { return obj.name === exchangeName; });
    
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
 * @params {String} exchangeName
 *
 * @api public
 */
Connection.prototype.removeExchange = function(exchangeName) {

    // Check data
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");

    // Get exchange
    var exchange = _.find(this.exchanges, function(obj) { return obj.name === exchangeName; });
    
    // Check if exists
    if(typeof exchange === "undefined") {
        throw new Error(exchangeName + " is not a defined exchange");
    }

    // Remove exchange
    this.exchanges = _.reject(this.exchanges, function(obj) { return obj === exchange; });

};


/**
 * Create queue
 *
 * @params {String} [queueName]
 * @params {Object} [options]
 *
 * @return Promise of CarrotMQ.Queue
 * @api public
 *
 * @alternative CarrotMQ.createQueue = function() { ... };
 * @alternative CarrotMQ.createQueue = function(queueName) { ... };
 * @alternative CarrotMQ.createQueue = function(options) { ... };
 * @alternative CarrotMQ.createQueue = function(queueName, options) { ... };
 */
Connection.prototype.createQueue = function() {

    // Data
    var queueName;
    var options;

    // Check arguments
    if(arguments.length === 2) {
        queueName = arguments[0];
        options = arguments[1];
    } else if(arguments.length === 1 && _.isObject(arguments[0])) {
        options = arguments[0];
    } else if(arguments.length === 1) {
        queueName = arguments[0];
    }

    // Default data
    if(_.isUndefined(queueName))
        queueName = '';
    if(_.isUndefined(options))
        options = {};

    // Check data
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Data
    var self = this;
    var Queue = require('./queue');

    // Return promise
    return new Queue(self, queueName, options)
        .then(function(queue) {

            // Save queue
            self.queues.push(queue);

            // Resolve
            return Promise.resolve(queue);

        });

};

/**
 * Get queues
 *
 * @return [ CarrotMQ.Queue, ... ]
 * @api public
 */
Connection.prototype.getQueues = function() {

    // Return queues
    return this.queues;

};

/**
 * Get queue
 *
 * @params {String} queueName
 *
 * @return CarrotMQ.Queue
 * @api public
 */
Connection.prototype.getQueue = function(queueName) {

    // Check data
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get queue
    var queue = _.find(this.queues, function(obj) { return obj.name === queueName; });
    
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
 * @params {String} queueName
 *
 * @api public
 */
Connection.prototype.removeQueue = function(queueName) {

    // Check data
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");

    // Get queue
    var queue = _.find(this.queues, function(obj) { return obj.name === queueName; });
    
    // Check if exists
    if(typeof queue === "undefined") {
        throw new Error(queueName + " is not a defined queue");
    }

    // Remove queue
    this.queues = _.reject(this.queues, function(obj) { return obj === queue; });

};




/**
 * Create reply exchange
 *
 * @params {String} exchangeName
 * @params {Object} [options]
 *
 * @return Promise of CarrotMQ.Exchange
 * @api public
 */
Connection.prototype.createReplyExchange = function(exchangeName, options) {

    // Data
    var exchangeName;
    var options;

    // Default data
    if(_.isUndefined(options))
        options = {};

    // Check data
    if(typeof exchangeName !== "string")
        throw new Error("exchangeName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Data
    var self = this;

    // Check if reply exchange already exists
    if(self.replyExchange !== null) {
        throw new Error("The reply exchange of " + self.name + " connection is already created");
    }

    // Return promise
    return self.createExchange(exchangeName, options)
        .then(function(exchange) {

            // Save exchange
            self.replyExchange = exchange;

            // Resolve
            return Promise.resolve(exchange);

        });

};

/**
 * Create reply queue
 *
 * @params {String} [queueName]
 * @params {Object} [options]
 *
 * @return Promise of CarrotMQ.Queue
 * @api public
 *
 * @alternative CarrotMQ.createReplyQueue = function() { ... };
 * @alternative CarrotMQ.createReplyQueue = function(queueName) { ... };
 * @alternative CarrotMQ.createReplyQueue = function(options) { ... };
 * @alternative CarrotMQ.createReplyQueue = function(queueName, options) { ... };
 */
Connection.prototype.createReplyQueue = function(connectionName) {

    // Data
    var queueName;
    var options;

    // Check arguments
    if(arguments.length === 2) {
        queueName = arguments[0];
        options = arguments[2];
    } else if(arguments.length === 1 && _.isObject(arguments[0])) {
        options = arguments[0];
    } else if(arguments.length === 1) {
        queueName = arguments[0];
    }

    // Default data
    if(_.isUndefined(queueName))
        queueName = '';
    if(_.isUndefined(options))
        options = {};

    // Check data
    if(typeof queueName !== "string")
        throw new Error("queueName have to be a string");
    if(typeof options !== "object")
        throw new Error("options have to be an object");

    // Data
    var self = this;

    // Check if reply queue already exists
    if(self.replyQueue !== null) {
        throw new Error("The reply queue of " + self.name + " connection is already created");
    }

    // Return promise
    return self.createQueue(queueName, options)
        .then(function(queue) {

            // Save queue
            self.replyQueue = queue;

            // Resolve
            return Promise.resolve(queue);

        });

};

/**
 * Init reply
 *
 * @return Promise of Boolean
 * @api public
 */
Connection.prototype.initReply = function() {
    
    // Check if reply exchange/queue exists
    if(this.replyExchange === null) {
        throw new Error("The reply exchange of " + this.name + " connection is not defined");
    } else if(this.replyQueue === null) {
        throw new Error("The reply queue of " + this.name + " connection is not defined");
    }

    // Bind queue
    return this.replyQueue.bind(this.replyExchange.name, '');

};

/**
 * Reply
 *
 * @params {String} taskId
 * @params {Any} result
 *
 * @return Promise
 * @api public
 */
Connection.prototype.reply = function(taskId, result) {

    // Check data
    if(typeof taskId !== "string")
        throw new Error("taskId have to be a string");

    // Check if reply exchange/queue exists
    if(this.replyExchange === null) {
        throw new Error("The reply exchange of " + this.name + " connection is not defined");
    } else if(this.replyQueue === null) {
        throw new Error("The reply queue of " + this.name + " connection is not defined");
    }

    // Publish
    return this.replyExchange.publish('', { _task_id: taskId, result: result });

};


/**
 * Module exports
 */
module.exports = Connection;