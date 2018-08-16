var fs = require('fs');
var pretty = require('./prettier-es')

var ONLY_ERRORS = false;

if (process.argv.length != 3 && process.argv.length != 4) {
    console.info("Usage: node runner.js <width> <query>")
    console.info("Usage: node runner.js <file>")
    process.exit(1);
}

var grammar = pretty.loadGrammar(fs.readFileSync('es-query.ohm'));

if (process.argv.length == 4) {
    var width = parseInt(process.argv[2]);
    var query = process.argv[3];
    var prettyQuery = pretty.prettyPrint(query, width, grammar);
    console.info(prettyQuery);

} else {
    var filename = process.argv[2];
    var lines = fs.readFileSync(filename);
    var width = 80;

    var failures_count = 0;
    var runs_count = 0;
    lines.toString().trim().split("\n").map(function(query) {
        if (query.indexOf("”") > -1) {
            return
        }
        runs_count += 1;
        try {
            var output = pretty.prettyPrint(query, width, grammar)
        } catch (err) {
            failures_count += 1;
            console.info("----------------------");
            console.info("Input:", query)
            console.info("Failure:", err)
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
