var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var carrotmq = require("../lib/carrotmq");
var config = require("./config");

// carrotmq
describe('carrotmq', function() {

	describe('carrotmq.createConnection', function() {
		
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

	describe('carrotmq.removeConnection', function() {
		
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

	describe('carrotmq.getConnections', function() {
		
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

	describe('carrotmq.getConnection', function() {
		
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

	describe('carrotmq.createExchange', function() {
		
		it('should create an exchange', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Return create exchange promise
					return carrotmq.createExchange('main', 'tasks');

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

	describe('carrotmq.createQueue', function() {
		
		it('should create a queue', function() {

			// Create connection
			return carrotmq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Return create queue promise
					return carrotmq.createQueue('main', '');

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

});