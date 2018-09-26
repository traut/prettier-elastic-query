#!/usr/bin/env node
'use strict';

var ohm = require('ohm-js');
var fs = require('fs');

var args = process.argv.slice(2);

if (args.length != 1) {
    var node = process.argv[0];
    var file = process.argv[1];
    console.info("Usage: " + node + " " + file + " <grammar.ohm>")
    process.exit(1);
}

var filename = args[0];
var source;

try {
    source = fs.readFileSync(filename).toString();
} catch (err) {
    console.error('error: cannot read file', filename);
    process.exit(2);
}

var grammar = ohm.grammar(source);
console.log("var ohm = require('ohm-js');");
console.log("module.exports = ohm.makeRecipe(" + grammar.toRecipe() + ");");
