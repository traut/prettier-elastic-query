prettier-elastic-query
======================

[![npm version](https://badge.fury.io/js/prettier-elastic-query.svg)](https://badge.fury.io/js/prettier-elastic-query)

[prettier-elastic-query](https://github.com/traut/prettier-elastic-query) is a library for formatting and highlighting Elasticsearch queries.

prettier-elastic-query uses [Ohm](https://ohmlang.github.io/) parser to parse the query and [Prism](https://prismjs.com/) for highlighting it.
See [demo page](https://traut.github.io/prettier-elastic-query/demos/index.html) for examples or try [live editor](https://traut.github.io/prettier-elastic-query/demos/editor.html) with your own query.


Getting Started
---------------
### Installation

If you are using Node.js, you can just install the `prettier-elastic-query` package using [npm](http://npmjs.org):

    npm install prettier-elastic-query

This will install prettier-elastic-query in the local `node_modules` folder. Use `require` to access it from a Node script:

```js
var prettier = require('prettier-elastic-query');
```

If you want to use prettier-elastic-query in a browser, you can download [prettier-elastic-query.min.js](https://raw.githubusercontent.com/traut/prettier-elastic-query/master/dist/prettier-elastic-query.min.js) and reference it in your HTML file.

```html
<script src="prettier-elastic-query.min.js" type="text/javascript"></script>
<script>
    console.info(PrettierEs.prettify("query text", 80));
</script>
```

See [demo page source](https://github.com/traut/prettier-elastic-query/blob/master/dist/demos/index.html) for usage example.

API reference
-------------

`prettify(query, maxWidth, style)` - format and highlight ES query. Calls `format()` and `highlight()` functions inside;

`prettifyElement(elementId, showErrors, maxWidth, errorCss)` - formats and highlights ES query inplace inside HTML element. `showErrors` - boolean indicating if error information should be rendered, false by default. `errorCss` class to be used in error message formatting;

`format(query, maxWidth, style)` - format ES query, fitting it in `maxWidth` characters per line and following provided style. Possible style options are `lisp` and `simple`, with `lisp` being used if no style argument provided;

`highlight(query)` - highlight query with [Prism](https://prismjs.com/). prettier-elastic-query build provides default Prism css theme. You can use any Prism theme, just include theme's css style file in your html file;

`parse(query)` - parse query and return syntax tree. This function throws an error if parsing fails. Used by `format()` function;

`extendHighlighter(options)` - takes `options` dictionary and extends Prism highlighter. At the moment only `keywords` key in `options` is supported and is used to extend `keyword` Prism language configuration;

`markErrorInQuery(query, error, cssClass)` - inserts `<u>` element around offending character in the query. `error` here is an instance of the error thrown by `format` function.

`prism` - Prism object;

`grammar` - Ohm grammar.
