var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var haremq = require("../lib/haremq");
var config = require("./config");

// haremq
describe('HareMQ', function() {

	// Test haremq
	describe('', function() { require('./haremq'); });

	// Test connection
	describe('', function() { require('./connection'); });
	
});