prettier-es
===========

[prettier-es](https://github.com/traut/prettier-es) is a library for formatting and highlighting Elasticsearch queries.

prettier-es uses [Ohm](https://ohmlang.github.io/) parser to parse the query and [Prism](https://prismjs.com/) for highlighting it.
See [demo page](https://traut.github.io/prettier-es/index.html) for examples or try [live editor](https://traut.github.io/prettier-es/index.html) with your own query.


Getting Started
---------------
### Installation

If you are using Node.js, you can just install the `prettier-es` package using [npm](http://npmjs.org):

    npm install prettier-es

This will install prettier-es in the local `node_modules` folder. Use `require` to access it from a Node script:

```js
var prettier = require('prettier-es');
```

If you want to use prettier-es in a browser, you can download [prettier-es.min.js](https://raw.githubusercontent.com/traut/prettier-es/master/dist/prettier-es.min.js) and [prettier-es.min.css](https://raw.githubusercontent.com/traut/prettier-es/master/dist/prettier-es.min.css) and reference it in your HTML file.

```html
<link href="resources/prettier-es.min.css" rel="stylesheet" type="text/css"/>
<script src="resources/prettier-es.min.js" type="text/javascript"></script>
<script>
    console.info(PrettierEs.prettify("query text", 80));
</script>
```

See [demo page source](https://github.com/traut/prettier-es/blob/master/docs/index.html) for usage example.

API reference
-------------

_`format(query, maxWidth, style)`_ - format ES query, fitting it in `maxWidth` characters per line and following provided style. Possible style options are `lisp` and `simple`, with `lisp` being used if no style argument provided;

_`highlight(query)`_ - highlight query with [Prism](https://prismjs.com/). prettier-es build provides default Prism css theme. You can use any Prism theme, just include theme's css style file in your html file;

_`prettify(query, maxWidth, style)`_ - format and highlight ES query. Calls `format()` and `highlight()` functions inside;


_`prettifyElement(elementId, showErrors, maxWidth, errorCss)`_ - formats and highlights ES query inplace inside HTML element. `showErrors` - boolean indicating if error information should be rendered, false by default. `errorCss` class to be used in error message formatting;

_`extendHighlighter(keywordsList)`_ - extends Prism highlighter with custom keywords;

_`markErrorInQuery(query, error, cssClass)`_ - inserts `<u>` element around offending character in the query. `error` here is an instance of the error thrown by `format` function.
