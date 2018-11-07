#!/usr/bin/env node

var fs = require('fs');
var pretty = require('prettier-elastic-query');

var args = process.argv.slice(2);

if (args.length != 1 && args.length != 2) {
  var node = process.argv[0];
  var file = process.argv[1];
  console.info("Usage: " + node + " " + file + " <line-width> <query text>")
  console.info("Usage: " + node + " " + file + " <text-file-with-query-per-line>")
  process.exit(1);
}

var ONLY_ERRORS = false;

if (args.length == 2) {
  var width = parseInt(args[0]);
  var query = args[1];
  var formatted = pretty.format(query, width);
  console.info(formatted);
} else {
  var filename = args[0];
  var lines = fs.readFileSync(filename);
  var width = 80;
  var failures_count = 0;
  var runs_count = 0;
  lines.toString().trim().split("\n").map(function(query) {
    runs_count += 1;
    try {
      var output = pretty.format(query, width);
    } catch (err) {
      failures_count += 1;
      console.info("----------------------");
      console.info("Input:", query)
      console.info("Failure:")
      console.info(err.message)
      return;
    }
    if (!ONLY_ERRORS) {
      console.info("----------------------");
      console.info(output);
    }
  });
  console.info("======================");
  console.info(failures_count + " failures out of " + runs_count + " runs");
}
