var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var haremq = require("../lib/haremq");
var config = require("./config");


// haremq.js
describe('haremq.js :', function() {

	// Create connection
	describe('HareMQ.createConnection', function() {
		
		it('should return ENOTFOUND exception', function() {

			// Create connection
			return haremq.createConnection('main', { host: 'wrong_host', port: config.server.port, login: config.server.login, password: config.server.password })
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
			return haremq.createConnection('main', { host: config.server.host, port: 10, login: config.server.login, password: config.server.password })
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
				return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: 'guest', password: 'wrong_login' })
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
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Test
					assert.equal(connection instanceof haremq.Connection, true);
					assert.equal(connection.driverInstance instanceof amqp.Connection, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Get all connections
	describe('HareMQ.getConnections', function() {
		
		it('should get all connections', function() {

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Data
					var connections = haremq.getConnections();

					// Log
					logInfo(String(connections));

					// Test
					assert.equal(connections instanceof Array, true);
					assert.equal(connections.length, 1);
					assert.equal(connections[0] instanceof haremq.Connection, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Get a connection
	describe('HareMQ.getConnection', function() {
		
		it('should return an error', function() {

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Test
					try{

						// Get connection
						var connection2 = haremq.getConnection('undefined_connection');

						// Test
						assert.fail();
					
					} catch(e) {

						// Test
						assert.equal(e.message, 'undefined_connection is not a defined connection');

					}

					// Log
					logInfo(String(connection));

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});
		
		it('should get a connection', function() {

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Data
					var connection = haremq.getConnection('main');

					// Log
					logInfo(String(connection));

					// Test
					assert.equal(connection instanceof haremq.Connection, true);

					// Destroy
					haremq.removeConnection('main');

					// Resolve
					return Promise.resolve();

				});

		});

	});

	// Remove connection
	describe('HareMQ.removeConnection', function() {
		
		it('should remove a connection', function() {

			// Create connection
			return haremq.createConnection('main', { host: config.server.host, port: config.server.port, login: config.server.login, password: config.server.password })
				.then(function(connection) {

					// Destroy
					haremq.removeConnection('main');

					// Data
					var connections = haremq.connections;

					// Test
					assert.equal(connections instanceof Array, true);
					assert.equal(connections.length, 0);

					// Resolve
					return Promise.resolve();

				});

		});

	});

});