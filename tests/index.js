var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var amqp = require("amqp");
var carrotmq = require("../lib/carrotmq");
var config = require("./config");

// carrotmq
describe('CarrotMQ', function() {

	// Test carrotmq
	describe('', function() { require('./carrotmq'); });
	
});