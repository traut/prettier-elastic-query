var fs = require('fs');
var pretty = require('./prettier-es')

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
    lines.toString().trim().split("\n").map(function(query) {
        console.info("----------------------");
        console.info(pretty.prettyPrint(query, width, grammar));
    });
}
