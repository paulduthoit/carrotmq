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

					// Get exchange
					var exchange = mainConnection.getExchange('undefined_exchange');

					// Log
					logInfo(String(exchange));

					// Test
					assert.equal(typeof exchange, 'undefined');

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

	// Publish
	describe('Connection.publish', function() {
		
		it('should publish 1', function() {

			// Data
			var mainConnection;

			// Return promise
			return new Promise(function(resolve, reject) {

				// Create connection
				haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
					.then(function(connection) {

						// Set main connection
						mainConnection = connection;

						// Create tasks exchange
						return mainConnection.createExchange('tasks')

					})
					.then(function() {

						/* CONSUMER */

							// Create tasks queue
							return mainConnection.createQueue('increment')
								.then(function(queue) {

									// Resolve
									return queue.bind('tasks', 'increment')
										.then(function() {

											// Subscribe
											return queue.subscribe(function(payload) {

												// Log
												logInfo(payload);

												// Test
												assert.equal(payload.body.count, 1);

												// Destroy
												haremq.removeConnection('main');

												// Resolve
												resolve();
												return;

											});

										});

								});

						/* /CONSUMER */

					})
					.then(function() {

						/* PRODUCER */

							// Run request
							return mainConnection.publish('tasks', 'increment', { taskId: 'id1', body: { count: 1 } });

						/* /PRODUCER */

					})
					.catch(function(err) {

						// Reject
						reject(err);
						return

					});

			});

		});

	});

	// Request
	describe('Connection.request', function() {
		
		it('should publish 1 and return 2', function() {

			// Data
			var mainConnection;

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Set main connection
					mainConnection = connection;

					// Create tasks exchange
					return mainConnection.createExchange('tasks')

				})
				.then(function() {

					/* CONSUMER */

						// Create tasks queue
						return mainConnection.createQueue('increment')
							.then(function(queue) {

								// Resolve
								return queue.bind('tasks', 'increment')
									.then(function() {

										// Subscribe
										return queue.subscribe(function(payload) {

											// Increment
											payload.body.count++;

											// Publish
											mainConnection.publish('tasks', 'increment_result', { taskId: payload.taskId, result: payload.body.count });

										});

									});

							});

					/* /CONSUMER */

				})
				.then(function() {

					/* PRODUCER */

						// Return promise
						return new Promise(function(resolve, reject) {

							// Subscribe listener
							var subscribeListener = function(message) {

								// Check taskId
								if(message.taskId !== 'id1') {
									return;
								}

								// Destroy queues
								_.each(this.queues, function(obj) {
									obj.queue.destroy();
								});

								// Log
								logInfo(message);

								// Test
								assert.equal(message.result, 2);

								// Destroy
								haremq.removeConnection('main');

								// Resolve
								resolve();
								return;

							};

							// Set request data
							var queue = {
								queue: '',
								bindExchange: 'tasks',
								bindRouting: 'increment_result',
								subscribeListener: subscribeListener
							};
							var task = {
								exchange: 'tasks',
								routing: 'increment',
								payload: {
									taskId: 'id1',
									body: {
										count: 1
									}
								}
							};

							// Run request
							mainConnection.request(queue, task)
								.catch(function(err) {

									// Reject
									reject(err);
									return

								});

						});

					/* /PRODUCER */

				});

		});

	});

});