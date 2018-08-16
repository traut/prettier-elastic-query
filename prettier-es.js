var ohm = require('ohm-js');
var _ = require('underscore');
var PP = require('prettier-printer')

var INDENT_STYLE = 'lisp' // 'simple'

var actionDict = {
    'nonemptyListOf': flattenNonemptyListOf,
    'spaced': flattenSpaced,
    'parented': flattenParented,
    'boolOperator': flattenBoolOperator,
    'longNegation': flattenLongNegation,
    'simpleNegation': flattenSimpleNegation,
    'simpleMust': flattenSimpleMust,
    'detachedCond': flattenDetachedCondition,
    'fieldCond': flattenFieldCondition,
    'orSpace': flattenOrSpace,
    'rangeCond': flattenRangeCondition,
    '_terminal': terminalAction
}

function terminalAction() {
    return this.primitiveValue;
}

function flattenNonemptyListOf(first, separators, rest) {
    var node = this;
    var topNodes = [first].concat([separators, rest])
    var childrenWithOffsets = []
    topNodes.map(function(node) {
        for (idx in node.children) {
            childrenWithOffsets.push({
                'offset': node._node.childOffsets[idx],
                'child': node.children[idx]
            })
        }
    });
    var sortedChildren = _.sortBy(childrenWithOffsets, 'offset')
    return sortedChildren.map(function(wrap) {
        return wrap.child.flatten()
    });
}

function flattenSpaced(_, innerNode, _) {
    return innerNode.flatten();
}

function flattenOrSpace(children) {
    return {
        "type": "boolOperator",
        "value": "IMP-OR"
    }
}

function flattenParented(_, _, innerNode, _, _) {
    return {
        'type': 'parented',
        'value': innerNode.flatten()
    }
}

function flattenBoolOperator(children) {
    var operator = children._node.primitiveValue;
    return {
        "type": "boolOperator",
        "value": operator
    }
}

function flattenFieldCondition(nameNode, _, valueNode) {
    return {
        'type': 'fieldCondition',
        'name': nameNode.sourceString,
        'value': valueNode.flatten()
    }
}

function flattenRangeCondition(_, _, fromValue, _, toValue, _, _) {
    return {
        'type': 'rangeCondition',
        'from': fromValue.sourceString,
        'to': toValue.sourceString,
    }
}

function flattenLongNegation(negation, spaces, condition) {
    return {
        'type': 'marking',
        'op': 'NOT',
        'value': condition.flatten()
    }
}

function flattenSimpleNegation(_, condition) {
    return {
        'type': 'marking',
        'op': '-',
        'value': condition.flatten()
    }
}

function flattenSimpleMust(_, condition) {
    return {
        'type': 'marking',
        'op': '+',
        'value': condition.flatten()
    }
}

function flattenDetachedCondition(children) {
    return this.sourceString;
}


function isFlatList(list) {
    var nonFlat = list.filter(function(el) {
        return (
            !(el.value === undefined)
            && !(typeof(el.value) === 'string'))
    })
    return nonFlat.length == 0;
}

function wrap(result) {
    switch (INDENT_STYLE) {
        case 'lisp':
            // .align() starts from (
            return PP.group(PP.hang(1, result))
        case 'simple':
        default:
            // simple
            return PP.group(PP.nest(2, result))
    }
}

function removeNulls(values) {
    return _.filter(values, function(val) {
        return (val != null)
    });
}

var formatDict = {
    'parented': formatParented,
    'boolOperator': formatBoolOperator,
    'fieldCondition': formatFieldCondition,
    'marking': formatMarking,
    'rangeCondition': formatRangeCondition
}

function formatParented(node) {
    var children = removeNulls(prettifyNode(node['value']));
    return wrap(PP.enclose(
        PP.parens,
        PP.enclose([PP.softBreak, PP.softBreak], children)))
}

function formatBoolOperator(node) {
    if (node['value'] == 'IMP-OR') {
        // implicit OR operator
        return null;
    } else {
        // FIXME: in rare cases this lineBreak adds up to softLine in list
        // merge and produces empty lines in the output
        return PP.prepend(PP.lineBreak, node['value']);
    }
}

function formatFieldCondition(node) {
    var result = prettifyNode(node['value']);
    //return wrap([node['name'], ':', result])
    return [node['name'], ':', result]
}

function formatMarking(node) {
    if (node['op'] == 'NOT') {
        return wrap(
            PP.intersperse(PP.softLine, [node['op'], prettifyNode(node['value'])]))
    } else {
        // simple marking with "-" or "+" does not require a space
        return wrap([node['op'], prettifyNode(node['value'])])
    }
}

function formatRangeCondition(node) {
    return wrap([
        "[", 
        PP.intersperse(PP.softLine, [node['from'], 'TO', node['to']]),
        "]"])
}

function prettifyNode(node) {
    switch (typeof node) {
        case 'string':
            return node
        case 'object':
            if (node instanceof Array) {
                var children = removeNulls(node.map(prettifyNode));
                return PP.intersperse(PP.softLine, children)
            } else {
                var formatter = formatDict[node['type']]
                if (!formatter) {
                    return "<NO FORMATER FOR '" + node['type'] + "'>"
                }
                return formatter(node)
            }
        default:
            throw Error("Unknown object type")
    }
}


function prettyPrint(query, maxWidth, grammar) {
    var semantics = grammar.createSemantics().addOperation('flatten', actionDict)

    var match = grammar.match(query);
    var tree = semantics(match);
    var result = tree.flatten();

    //console.info(JSON.stringify(result, null, 4))

    var prettiness = PP.render(maxWidth, PP.group(prettifyNode(result)));
    return prettiness;
}

if (typeof Prism !== 'undefined') {
    Prism.languages.es = {
        'string' : {
            pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\])*\2/,
            greedy: true,
            lookbehind: true
        },
        'variable': /@[\w.$]+|@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
        //'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i, // Should we highlight user defined functions too?
        'keyword': /\b(?:WHITE|GREEN|AMBER|RED|_exists_|high|medium|low)\b/i,
        'boolean': /\b(?:true|false|null)\b/i,
        'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
        'operator': /[-+\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|OR|TO|NOT)\b/i,
        'punctuation': /[;[\]()`,.]/
    };
}


function prettyPrintElementText(elementId, width) {
    width = width || 150;
    elementId = elementId || 'query-code'

    var grammar = ohm.grammarFromScriptElement();
    var codeElement = document.getElementById(elementId);
    var query = codeElement.innerText;
    query = query.trim();
    var prettyQuery = prettyPrint(query, width, grammar)

    codeElement.innerHTML = Prism.highlight(
        prettyQuery, Prism.languages.es, "es")
}

function loadGrammar(grammarString) {
    return ohm.grammar(grammarString);
}


if (typeof window !== 'undefined') {
    window.prettyPrintElementText = prettyPrintElementText;
}

module.exports = {
    prettyPrintElementText: prettyPrintElementText,
    prettyPrint: prettyPrint,
    loadGrammar: loadGrammar
}
