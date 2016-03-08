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


/**
 * Create exchange
 *
 * @params {String} exchangeName
 * @params {Object} options
 *
 * @return Promise of HareMQ.Exchange
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
 * @return [ HareMQ.Exchange, ... ]
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
 * @return HareMQ.Exchange
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
        return undefined;
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

    // Destroy exchange
    exchange.destroy();

};


/**
 * Create queue
 *
 * @params {String} [queueName]
 * @params {Object} [options]
 *
 * @return Promise of HareMQ.Queue
 * @api public
 *
 * @alternative HareMQ.createQueue = function() { ... };
 * @alternative HareMQ.createQueue = function(queueName) { ... };
 * @alternative HareMQ.createQueue = function(options) { ... };
 * @alternative HareMQ.createQueue = function(queueName, options) { ... };
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
 * @return [ HareMQ.Queue, ... ]
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
 * @return HareMQ.Queue
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
        return undefined;
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

    // Destroy queue
    queue.destroy();

};


/**
 * Publish
 *
 * @params {String|HareMQ.Exchange} exchange
 * @params {String} routing
 * @params {Object} payload
 * @params {Object} [options]
 *
 * @return Promise
 * @api public
 */
Connection.prototype.publish = function(exchange, routing, payload, options) {

    // Data
    var self = this;
    var Exchange = require('./exchange');

    // Transform queues argument
    if(_.isString(exchange)) {
        exchange = self.getExchange(exchange);
    }

    // Check arguments
    if(_.isUndefined(options))
        options = {};

    // Check data
    if(!(exchange instanceof Exchange))
        throw new Error("exchange have to be a HareMQ.Exchange");
    if(!(typeof routing === "string"))
        throw new Error("routing have to be a string");
    if(!(typeof payload === "object"))
        throw new Error("payload have to be an object");
    if(!(typeof options === "object"))
        throw new Error("options have to be an object");

    // Publish
    return exchange.publish(routing, payload, options);

};


/**
 * Request
 *
 * @params {Object|Array} queues
 * @params {Object} task
 *
 * @return Promise
 * @api public
 */
Connection.prototype.request = function(queues, task) {

    // Data
    var self = this;
    var Exchange = require('./exchange');
    var Queue = require('./queue');

    // Transform queues argument
    if(!(queues instanceof Array) && typeof queues === "object") {
        queues = [ queues ];
    }

    // Transform task.exchange argument
    if(_.isString(task.exchange)) {
        task.exchange = self.getExchange(task.exchange);
    }

    // Check arguments
    if(_.isObject(task) && _.isUndefined(task.options))
        task.options = {};

    // Check data
    if(!(queues instanceof Array))
        throw new Error("queues have to be an object or an array");
    if(!(typeof task === "object"))
        throw new Error("task have to be an object");
    if(!(task.exchange instanceof Exchange))
        throw new Error("task.exchange have to be a HareMQ.Exchange");
    if(!(typeof task.routing === "string"))
        throw new Error("task.routing have to be a string");
    if(!(typeof task.payload === "object"))
        throw new Error("task.payload have to be an object");
    if(!(typeof task.options === "object"))
        throw new Error("task.options have to be an object");

    // Check each queue
    _.each(queues, function(obj, index) {

        // Transform queue argument
        if(_.isString(obj.queue)) {
            var existingQueue = self.getQueue(obj.queue);
            if(!_.isUndefined(existingQueue)) {
                obj.queue = existingQueue;
            }
        }

        // Transform bindExchange argument
        if(obj.bindExchange instanceof Exchange) {
            obj.bindExchange = obj.bindExchange.name;
        }

        // Default arguments
        if(!(obj.queue instanceof Queue) && _.isUndefined(obj.options))
            obj.options = {};
        if(_.isUndefined(obj.subscribeOptions))
            obj.subscribeOptions = {};

        // Check data
        if(!(obj.queue instanceof Queue || typeof obj.queue === "string"))
            throw new Error("queues[" + index + "].queue have to be a string or a HareMQ.Queue");
        if(obj.queue instanceof Queue && !(typeof obj.options === "undefined"))
            throw new Error("queues[" + index + "].options can't be provided if queues[" + index + "].queue is a HareMQ.Queue");
        if(!(obj.queue instanceof Queue) && !(typeof obj.options === "object"))
            throw new Error("queues[" + index + "].options have to be an object");
        if(!(typeof obj.bindExchange === "string"))
            throw new Error("queues[" + index + "].bindExchange have to be a HareMQ.Exchange");
        if(!(typeof obj.bindRouting === "string"))
            throw new Error("queues[" + index + "].bindRouting have to be a string");
        if(!(typeof obj.subscribeOptions === "object"))
            throw new Error("queues[" + index + "].subscribeOptions have to be an object");
        if(!(typeof obj.subscribeListener === "function"))
            throw new Error("queues[" + index + "].subscribeListener have to be a function");

    });

    // Create queues
    var createQueuesLoad = function() {

        // Create all queues
        return Promise.all(_.map(queues, function(obj) {

            // If queue is a string
            if(typeof obj.queue === "string") {

                // Create queue
                return self.createQueue(obj.queue, obj.options)
                    .then(function(queue) {

                        // Save created queue
                        obj.queue = queue;

                    });

            }

            // Resolve if queue is already exist
            else {
                return Promise.resolve();
            }

        }));

    };

    // Bind queues
    var bindQueuesLoad = function() {

        // Bind all queues
        return Promise.all(_.map(queues, function(obj) {

            // Bind queue to exchange
            return obj.queue.bind(obj.bindExchange, obj.bindRouting);

        }));

    };

    // Subscribe queues
    var subscribeQueuesLoad = function() {

        // Subscribe all queues
        return Promise.all(_.map(queues, function(obj) {

            // Subscribe queue to exchange
            return obj.queue.subscribe(obj.subscribeOptions, function() {

                // Call listener
                obj.subscribeListener.apply({ queues: queues }, arguments);

            });

        }));

    };

    // Publish
    var publishLoad = function() {

        // Publish
        return task.exchange.publish(task.routing, task.payload, task.options);

    };

    // Return promises
    return createQueuesLoad()
        .then(bindQueuesLoad)
        .then(subscribeQueuesLoad)
        .then(publishLoad);

};


/**
 * Module exports
 */
module.exports = Connection;