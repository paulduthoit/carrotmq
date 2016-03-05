var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var carrotmq = require("../lib/carrotmq");
var config = require("./config");


// carrotmq.js
describe('carrotmq.js :', function() {

	// Create connection
	describe('CarrotMQ.createConnection', function() {
		
		it('should return ENOTFOUND exception', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: 'wrong_host', port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Resolve
					return Promise.reject();

				})
				.catch(function(err) {

					// Log
					logInfo(err);

					// Test
					assert.equal(typeof err, 'object');
					assert.notEqual(err, null);
					assert.equal(err.code, 'ENOTFOUND');

					// Resolve
					return Promise.resolve();

				});

		});
		
		it('should return ECONNREFUSED exception', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: 10, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Resolve
					return Promise.reject();

				})
				.catch(function(err) {

					// Log
					logInfo(err);

					// Test
					assert.equal(typeof err, 'object');
					assert.notEqual(err, null);
					assert.equal(err.code, 'ECONNREFUSED');

					// Resolve
					return Promise.resolve();

				});

		});

		if(config.testAll) {
		
			it('should return ECONNRESET exception', function() {

				// Create connection
				return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: 'guest', password: 'wrong_login' })
					.then(function(connection) {

						// Resolve
						return Promise.reject();

					})
					.catch(function(err) {

						// Log
						logInfo(err);

						// Test
						assert.equal(typeof err, 'object');
						assert.notEqual(err, null);
						assert.equal(err.code, 'ECONNRESET');

						// Resolve
						return Promise.resolve();

					});

			});

		}
		
		it('should create connection', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Test
					assert.equal(connection instanceof carrotmq.Connection, true);
					assert.equal(connection.driverInstance instanceof amqp.Connection, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Remove connection
	describe('CarrotMQ.removeConnection', function() {
		
		it('should remove a connection', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Destroy
					carrotmq.removeConnection('main');

					// Data
					var connections = carrotmq.connections;

					// Test
					assert.equal(connections instanceof Array, true);
					assert.equal(connections.length, 0);

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Get all connections
	describe('CarrotMQ.getConnections', function() {
		
		it('should get all connections', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Data
					var connections = carrotmq.getConnections();

					// Log
					logInfo(String(connections));

					// Test
					assert.equal(connections instanceof Array, true);
					assert.equal(connections.length, 1);
					assert.equal(connections[0] instanceof carrotmq.Connection, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Get a connection
	describe('CarrotMQ.getConnection', function() {
		
		it('should return an error', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Test
					try{

						// Get connection
						var connection2 = carrotmq.getConnection('undefined_connection');

						// Test
						assert.fail();
					
					} catch(e) {

						// Test
						assert.equal(e.message, 'undefined_connection is not a defined connection');

					}

					// Log
					logInfo(String(connection));

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});
		
		it('should get a connection', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Data
					var connection = carrotmq.getConnection('main');

					// Log
					logInfo(String(connection));

					// Test
					assert.equal(connection instanceof carrotmq.Connection, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create an exchange
	describe('Connection.createExchange', function() {
		
		it('should create an exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
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
					assert.equal(exchange instanceof carrotmq.Exchange, true);
					assert.equal(exchange.driverInstance.connection instanceof amqp.Connection, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create a queue
	describe('CarrotMQ.createQueue', function() {
		
		it('should create a queue', function() {

			// Data
			var mainConnection;

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
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
					assert.equal(queue instanceof carrotmq.Queue, true);
					assert.equal(queue.driverInstance.connection instanceof amqp.Connection, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create a reply exchange
	describe('CarrotMQ.createReplyExchange', function() {
		
		it('should create a reply exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
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
					assert.equal(exchange instanceof carrotmq.Exchange, true);
					assert.equal(exchange.driverInstance.connection instanceof amqp.Connection, true);
					assert.equal(exchange.connection.replyExchange instanceof carrotmq.Exchange, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Create a reply queue
	describe('CarrotMQ.createReplyQueue', function() {
		
		it('should create a reply queue', function() {

			// Data
			var mainConnection;

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
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
					assert.equal(queue instanceof carrotmq.Queue, true);
					assert.equal(queue.driverInstance.connection instanceof amqp.Connection, true);
					assert.equal(queue.connection.replyQueue instanceof carrotmq.Queue, true);

					// Destroy
					carrotmq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Reply
	describe('CarrotMQ.reply', function() {
		
		it('should publish to reply exchange', function() {

			// Data
			var mainConnection;

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
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
										carrotmq.removeConnection('main');

										// Resolve
										return Promise.resolve();

									});

							});

					/* /PROVIDER */

				});

		});

	});

});