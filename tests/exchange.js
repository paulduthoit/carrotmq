var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var haremq = require("../lib/haremq");
var config = require("./config");


// exchange.js
describe('exchange.js :', function() {

	// Create connection
	describe('Exchange.createConnection', function() {
		
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

	});

});