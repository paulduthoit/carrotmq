var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var haremq = require("../lib/haremq");
var config = require("./config");


// connection.js
describe('connection.js :', function() {

	// Create an exchange
	describe('Connection.createExchange', function() {
		
		it('should create an exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create exchange promise
					return mainConnection.createExchange('tasks');

				})
				.then(function(exchange) {

					// Log
					logInfo(String(exchange));

					// Test
					assert.equal(exchange instanceof haremq.Exchange, true);
					assert.equal(exchange.driverInstance.connection instanceof amqp.Connection, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Get all exchanges
	describe('Connection.getExchanges', function() {
		
		it('should get all exchanges', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create exchange promise
					return mainConnection.createExchange('tasks');

				})
				.then(function(exchange) {

					// Data
					var exchanges = mainConnection.getExchanges();

					// Log
					logInfo(String(exchanges));

					// Test
					assert.equal(exchanges instanceof Array, true);
					assert.equal(exchanges.length, 1);
					assert.equal(exchanges[0] instanceof haremq.Exchange, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Get an exchange
	describe('Connection.getExchange', function() {
		
		it('should return an error', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create exchange promise
					return mainConnection.createExchange('tasks');

				})
				.then(function(exchange) {

					// Test
					try{

						// Get exchange
						var exchange = mainConnection.getExchange('undefined_exchange');

						// Test
						assert.fail();
					
					} catch(e) {

						// Test
						assert.equal(e.message, 'undefined_exchange is not a defined exchange');

					}

					// Log
					logInfo(String(exchange));

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});
		
		it('should get an exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create exchange promise
					return mainConnection.createExchange('tasks');

				})
				.then(function(exchange) {

					// Data
					var exchange = mainConnection.getExchange('tasks');

					// Log
					logInfo(String(exchange));

					// Test
					assert.equal(exchange instanceof haremq.Exchange, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Remove an exchange
	describe('Connection.removeExchange', function() {
		
		it('should remove an exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create exchange promise
					return mainConnection.createExchange('tasks');

				})
				.then(function(connection) {

					// Remove exchange
					mainConnection.removeExchange('tasks');

					// Data
					var exchanges = mainConnection.exchanges;

					// Test
					assert.equal(exchanges instanceof Array, true);
					assert.equal(exchanges.length, 0);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create a queue
	describe('Connection.createQueue', function() {
		
		it('should create a queue', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create queue promise
					return mainConnection.createQueue('');

				})
				.then(function(queue) {

					// Log
					logInfo(String(queue));

					// Test
					assert.equal(queue instanceof haremq.Queue, true);
					assert.equal(queue.driverInstance.connection instanceof amqp.Connection, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create a reply exchange
	describe('Connection.createReplyExchange', function() {
		
		it('should create a reply exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create reply exchange promise
					return mainConnection.createReplyExchange('reply');

				})
				.then(function(exchange) {

					// Log
					logInfo(String(exchange));

					// Test
					assert.equal(exchange instanceof haremq.Exchange, true);
					assert.equal(exchange.driverInstance.connection instanceof amqp.Connection, true);
					assert.equal(exchange.connection.replyExchange instanceof haremq.Exchange, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create a reply queue
	describe('Connection.createReplyQueue', function() {
		
		it('should create a reply queue', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Return create reply queue promise
					return mainConnection.createReplyQueue();

				})
				.then(function(queue) {

					// Log
					logInfo(String(queue));

					// Test
					assert.equal(queue instanceof haremq.Queue, true);
					assert.equal(queue.driverInstance.connection instanceof amqp.Connection, true);
					assert.equal(queue.connection.replyQueue instanceof haremq.Queue, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Reply
	describe('Connection.reply', function() {
		
		it('should publish to reply exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Create reply exchange/queue promise
					return Promise.all([
							mainConnection.createReplyExchange('reply'),
							mainConnection.createReplyQueue()
						])
						.then(function(result) {

							// Init reply
							return mainConnection.initReply();

						});

				})
				.then(function() {

					/* CONSUMER */

						// Data
						var tasksQueue;

						// Create tasks queue
						return mainConnection.createQueue()
							.then(function(queue) {

								// Set tasks queue
								tasksQueue = queue;

								// Resolve
								return Promise.resolve();

							})
							.then(function() {

								// Bind tasks exchange
								return tasksQueue.bind('tasks', '');

							})
							.then(function() {

								// Subscribe
								return tasksQueue.subscribe(function(payload) {

									// Check payload
									if(payload.action !== 'INCREMENT') {
										return;
									}

									// Increment
									payload.count++;

									// Reply
									mainConnection.reply(payload._task_id, payload.count);

								});

							});

					/* /CONSUMER */

				})
				.then(function() {

					/* PROVIDER */

						// Data
						var tasksExchange;

						// Create tasks exchanges
						return mainConnection.createExchange('tasks')
							.then(function(exchange) {

								// Set tasks exchange
								tasksExchange = exchange;

								// Resolve
								return Promise.resolve();

							}).then(function() {

								// Request
								return tasksExchange.request('', { action: 'INCREMENT', count: 1 })
									.then(function(result) {

										// Log
										logInfo(result);

										// Test
										assert.equal(result, 2);

										// Destroy
										haremq.removeConnection('main');

										// Resolve
										return Promise.resolve();

									});

							});

					/* /PROVIDER */

				});

		});

	});

});