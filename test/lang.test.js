const { describe, test, expect } = require('bun:test');
const {parse,CONFIG} = require('../src/lang')

CONFIG.given = "SACHANT"
const features = parse(`
FEATURE feature
	SCENARIO name
		SACHANT setup
		WHEN action
		THEN test
	SCENARIO name2
		SACHANT setup2
		WHEN action2
		THEN test2
`)
//console.log(features)