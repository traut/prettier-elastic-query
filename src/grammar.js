var ohm = require('ohm-js');
module.exports = ohm.makeRecipe(["grammar",{"source":"ESQueryGrammar {\n    ESQuery = query\n\n    reservedWord = \"AND\" | \"OR\" | \"NOT\" | \"TO\"\n    boolOperator = \"AND\" | \"OR\"\n    orSpace = space+\n    orLine = \"|\"\n\n    // STRING LITERALS\n    sourceCharacter = any\n    nonEscapeCharacter = ~(singleEscapeCharacter) sourceCharacter\n    characterEscapeSequence = singleEscapeCharacter\n                            | nonEscapeCharacter\n    singleEscapeCharacter = \"\\\"\" | \"\\\\\"\n    doubleStringCharacter = ~(\"\\\"\" | \"\\\\\") sourceCharacter -- nonEscaped\n                          | \"\\\\\" characterEscapeSequence -- Escaped\n    singleESEscapeCharacter = \" \" | \"+\" | \"-\" | \"=\" | \"!\" | \"(\" | \")\" | \"{\" | \"}\"\n                            | \"[\" | \"]\" | \"^\" | \"\\\"\" | \"~\" | \"*\" | \"?\" | \":\" | \"\\\\\" | \"/\"\n    escapedESStringCharacter = \"\\\\\" singleESEscapeCharacter\n\twildcardCharacter = \"*\" | \"?\"\n    regexCharacter = \"*\" | \"?\" | \"[\" | \"]\" | \"(\" | \")\"\n\n    unquotedString = ~reservedWord (escapedESStringCharacter | wildcardCharacter | alnum | \"_\" | \".\" | \"-\" | \"’\")+\n    quotedString = \"\\\"\" doubleStringCharacter* \"\\\"\"\n\n    unquotedFuzzyString = unquotedString \"~\" alnum+\n    quotedFuzzyString = \"\\\"\" doubleStringCharacter* \"\\\"\" \"~\" alnum+\n\n    detachedCond = quotedFuzzyString | unquotedFuzzyString | quotedString | unquotedString\n\n    // UTILS\n    spaced<x> = space+ x space+\n    parented<x> = \"(\" space* x space* \")\"\n\n    spacedBool = spaced<boolOperator>\n    genericBoolOp = spacedBool | orSpace | orLine\n\n    // FIELD QUERY\n    fieldName = ~reservedWord (alnum | \".\" | \"_\")+ &\":\"\n    fieldCond = fieldName \":\" subquery\n\n    // RANGE QUERY\n    rangeValue = ~space ((alnum | \"/\" | \"-\" | \":\" | \"+\")+ | \"*\")\n    rangeCond = ((\"[\" | \"{\") space* rangeValue spaced<\"TO\"> rangeValue space* (\"]\" | \"}\"))\n    simpleRangeCond = (\">\" subquery) | (\"<\" subquery) | (\">=\" subquery) | (\"<=\" subquery)\n\n    // REGEX QUERY\n    regexCond = \"/\" (alnum | regexCharacter)+ \"/\"\n\n    // CONDITIONS\n    genericCond = fieldCond | rangeCond | simpleRangeCond | regexCond | detachedCond\n    cond = parented<genericCond> | genericCond\n\n    simpleNegation = \"-\" subquery\n    simpleMust = \"+\" subquery\n    longNegation = \"NOT\" space+ subquery\n    markedCond = longNegation | simpleNegation | simpleMust\n\n    queryElement = markedCond | cond\n\tsubquery = parented<query> | queryElement\n    query = nonemptyListOf<subquery, genericBoolOp> | parented<query>\n}"},"ESQueryGrammar",null,"ESQuery",{"ESQuery":["define",{"sourceInterval":[21,36]},null,[],["app",{"sourceInterval":[31,36]},"query",[]]],"reservedWord":["define",{"sourceInterval":[42,84]},null,[],["alt",{"sourceInterval":[57,84]},["terminal",{"sourceInterval":[57,62]},"AND"],["terminal",{"sourceInterval":[65,69]},"OR"],["terminal",{"sourceInterval":[72,77]},"NOT"],["terminal",{"sourceInterval":[80,84]},"TO"]]],"boolOperator":["define",{"sourceInterval":[89,116]},null,[],["alt",{"sourceInterval":[104,116]},["terminal",{"sourceInterval":[104,109]},"AND"],["terminal",{"sourceInterval":[112,116]},"OR"]]],"orSpace":["define",{"sourceInterval":[121,137]},null,[],["plus",{"sourceInterval":[131,137]},["app",{"sourceInterval":[131,136]},"space",[]]]],"orLine":["define",{"sourceInterval":[142,154]},null,[],["terminal",{"sourceInterval":[151,154]},"|"]],"sourceCharacter":["define",{"sourceInterval":[183,204]},null,[],["app",{"sourceInterval":[201,204]},"any",[]]],"nonEscapeCharacter":["define",{"sourceInterval":[209,270]},null,[],["seq",{"sourceInterval":[230,270]},["not",{"sourceInterval":[230,254]},["app",{"sourceInterval":[232,253]},"singleEscapeCharacter",[]]],["app",{"sourceInterval":[255,270]},"sourceCharacter",[]]]],"characterEscapeSequence":["define",{"sourceInterval":[275,371]},null,[],["alt",{"sourceInterval":[301,371]},["app",{"sourceInterval":[301,322]},"singleEscapeCharacter",[]],["app",{"sourceInterval":[353,371]},"nonEscapeCharacter",[]]]],"singleEscapeCharacter":["define",{"sourceInterval":[376,411]},null,[],["alt",{"sourceInterval":[400,411]},["terminal",{"sourceInterval":[400,404]},"\""],["terminal",{"sourceInterval":[407,411]},"\\"]]],"doubleStringCharacter_nonEscaped":["define",{"sourceInterval":[440,484]},null,[],["seq",{"sourceInterval":[440,470]},["not",{"sourceInterval":[440,454]},["alt",{"sourceInterval":[442,453]},["terminal",{"sourceInterval":[442,446]},"\""],["terminal",{"sourceInterval":[449,453]},"\\"]]],["app",{"sourceInterval":[455,470]},"sourceCharacter",[]]]],"doubleStringCharacter_Escaped":["define",{"sourceInterval":[513,552]},null,[],["seq",{"sourceInterval":[513,541]},["terminal",{"sourceInterval":[513,517]},"\\"],["app",{"sourceInterval":[518,541]},"characterEscapeSequence",[]]]],"doubleStringCharacter":["define",{"sourceInterval":[416,552]},null,[],["alt",{"sourceInterval":[440,552]},["app",{"sourceInterval":[440,470]},"doubleStringCharacter_nonEscaped",[]],["app",{"sourceInterval":[513,541]},"doubleStringCharacter_Escaped",[]]]],"singleESEscapeCharacter":["define",{"sourceInterval":[557,724]},null,[],["alt",{"sourceInterval":[583,724]},["terminal",{"sourceInterval":[583,586]}," "],["terminal",{"sourceInterval":[589,592]},"+"],["terminal",{"sourceInterval":[595,598]},"-"],["terminal",{"sourceInterval":[601,604]},"="],["terminal",{"sourceInterval":[607,610]},"!"],["terminal",{"sourceInterval":[613,616]},"("],["terminal",{"sourceInterval":[619,622]},")"],["terminal",{"sourceInterval":[625,628]},"{"],["terminal",{"sourceInterval":[631,634]},"}"],["terminal",{"sourceInterval":[665,668]},"["],["terminal",{"sourceInterval":[671,674]},"]"],["terminal",{"sourceInterval":[677,680]},"^"],["terminal",{"sourceInterval":[683,687]},"\""],["terminal",{"sourceInterval":[690,693]},"~"],["terminal",{"sourceInterval":[696,699]},"*"],["terminal",{"sourceInterval":[702,705]},"?"],["terminal",{"sourceInterval":[708,711]},":"],["terminal",{"sourceInterval":[714,718]},"\\"],["terminal",{"sourceInterval":[721,724]},"/"]]],"escapedESStringCharacter":["define",{"sourceInterval":[729,784]},null,[],["seq",{"sourceInterval":[756,784]},["terminal",{"sourceInterval":[756,760]},"\\"],["app",{"sourceInterval":[761,784]},"singleESEscapeCharacter",[]]]],"wildcardCharacter":["define",{"sourceInterval":[786,815]},null,[],["alt",{"sourceInterval":[806,815]},["terminal",{"sourceInterval":[806,809]},"*"],["terminal",{"sourceInterval":[812,815]},"?"]]],"regexCharacter":["define",{"sourceInterval":[820,870]},null,[],["alt",{"sourceInterval":[837,870]},["terminal",{"sourceInterval":[837,840]},"*"],["terminal",{"sourceInterval":[843,846]},"?"],["terminal",{"sourceInterval":[849,852]},"["],["terminal",{"sourceInterval":[855,858]},"]"],["terminal",{"sourceInterval":[861,864]},"("],["terminal",{"sourceInterval":[867,870]},")"]]],"unquotedString":["define",{"sourceInterval":[876,986]},null,[],["seq",{"sourceInterval":[893,986]},["not",{"sourceInterval":[893,906]},["app",{"sourceInterval":[894,906]},"reservedWord",[]]],["plus",{"sourceInterval":[907,986]},["alt",{"sourceInterval":[908,984]},["app",{"sourceInterval":[908,932]},"escapedESStringCharacter",[]],["app",{"sourceInterval":[935,952]},"wildcardCharacter",[]],["app",{"sourceInterval":[955,960]},"alnum",[]],["terminal",{"sourceInterval":[963,966]},"_"],["terminal",{"sourceInterval":[969,972]},"."],["terminal",{"sourceInterval":[975,978]},"-"],["terminal",{"sourceInterval":[981,984]},"’"]]]]],"quotedString":["define",{"sourceInterval":[991,1038]},null,[],["seq",{"sourceInterval":[1006,1038]},["terminal",{"sourceInterval":[1006,1010]},"\""],["star",{"sourceInterval":[1011,1033]},["app",{"sourceInterval":[1011,1032]},"doubleStringCharacter",[]]],["terminal",{"sourceInterval":[1034,1038]},"\""]]],"unquotedFuzzyString":["define",{"sourceInterval":[1044,1091]},null,[],["seq",{"sourceInterval":[1066,1091]},["app",{"sourceInterval":[1066,1080]},"unquotedString",[]],["terminal",{"sourceInterval":[1081,1084]},"~"],["plus",{"sourceInterval":[1085,1091]},["app",{"sourceInterval":[1085,1090]},"alnum",[]]]]],"quotedFuzzyString":["define",{"sourceInterval":[1096,1159]},null,[],["seq",{"sourceInterval":[1116,1159]},["terminal",{"sourceInterval":[1116,1120]},"\""],["star",{"sourceInterval":[1121,1143]},["app",{"sourceInterval":[1121,1142]},"doubleStringCharacter",[]]],["terminal",{"sourceInterval":[1144,1148]},"\""],["terminal",{"sourceInterval":[1149,1152]},"~"],["plus",{"sourceInterval":[1153,1159]},["app",{"sourceInterval":[1153,1158]},"alnum",[]]]]],"detachedCond":["define",{"sourceInterval":[1165,1251]},null,[],["alt",{"sourceInterval":[1180,1251]},["app",{"sourceInterval":[1180,1197]},"quotedFuzzyString",[]],["app",{"sourceInterval":[1200,1219]},"unquotedFuzzyString",[]],["app",{"sourceInterval":[1222,1234]},"quotedString",[]],["app",{"sourceInterval":[1237,1251]},"unquotedString",[]]]],"spaced":["define",{"sourceInterval":[1270,1297]},null,["x"],["seq",{"sourceInterval":[1282,1297]},["plus",{"sourceInterval":[1282,1288]},["app",{"sourceInterval":[1282,1287]},"space",[]]],["param",{},0],["plus",{"sourceInterval":[1291,1297]},["app",{"sourceInterval":[1291,1296]},"space",[]]]]],"parented":["define",{"sourceInterval":[1302,1339]},null,["x"],["seq",{"sourceInterval":[1316,1339]},["terminal",{"sourceInterval":[1316,1319]},"("],["star",{"sourceInterval":[1320,1326]},["app",{"sourceInterval":[1320,1325]},"space",[]]],["param",{},0],["star",{"sourceInterval":[1329,1335]},["app",{"sourceInterval":[1329,1334]},"space",[]]],["terminal",{"sourceInterval":[1336,1339]},")"]]],"spacedBool":["define",{"sourceInterval":[1345,1378]},null,[],["app",{"sourceInterval":[1358,1378]},"spaced",[["app",{"sourceInterval":[1365,1377]},"boolOperator",[]]]]],"genericBoolOp":["define",{"sourceInterval":[1383,1428]},null,[],["alt",{"sourceInterval":[1399,1428]},["app",{"sourceInterval":[1399,1409]},"spacedBool",[]],["app",{"sourceInterval":[1412,1419]},"orSpace",[]],["app",{"sourceInterval":[1422,1428]},"orLine",[]]]],"fieldName":["define",{"sourceInterval":[1453,1504]},null,[],["seq",{"sourceInterval":[1465,1504]},["not",{"sourceInterval":[1465,1478]},["app",{"sourceInterval":[1466,1478]},"reservedWord",[]]],["plus",{"sourceInterval":[1479,1499]},["alt",{"sourceInterval":[1480,1497]},["app",{"sourceInterval":[1480,1485]},"alnum",[]],["terminal",{"sourceInterval":[1488,1491]},"."],["terminal",{"sourceInterval":[1494,1497]},"_"]]],["lookahead",{"sourceInterval":[1500,1504]},["terminal",{"sourceInterval":[1501,1504]},":"]]]],"fieldCond":["define",{"sourceInterval":[1509,1543]},null,[],["seq",{"sourceInterval":[1521,1543]},["app",{"sourceInterval":[1521,1530]},"fieldName",[]],["terminal",{"sourceInterval":[1531,1534]},":"],["app",{"sourceInterval":[1535,1543]},"subquery",[]]]],"rangeValue":["define",{"sourceInterval":[1568,1628]},null,[],["seq",{"sourceInterval":[1581,1628]},["not",{"sourceInterval":[1581,1587]},["app",{"sourceInterval":[1582,1587]},"space",[]]],["alt",{"sourceInterval":[1589,1627]},["plus",{"sourceInterval":[1589,1621]},["alt",{"sourceInterval":[1590,1619]},["app",{"sourceInterval":[1590,1595]},"alnum",[]],["terminal",{"sourceInterval":[1598,1601]},"/"],["terminal",{"sourceInterval":[1604,1607]},"-"],["terminal",{"sourceInterval":[1610,1613]},":"],["terminal",{"sourceInterval":[1616,1619]},"+"]]],["terminal",{"sourceInterval":[1624,1627]},"*"]]]],"rangeCond":["define",{"sourceInterval":[1633,1719]},null,[],["seq",{"sourceInterval":[1645,1719]},["alt",{"sourceInterval":[1647,1656]},["terminal",{"sourceInterval":[1647,1650]},"["],["terminal",{"sourceInterval":[1653,1656]},"{"]],["star",{"sourceInterval":[1658,1664]},["app",{"sourceInterval":[1658,1663]},"space",[]]],["app",{"sourceInterval":[1665,1675]},"rangeValue",[]],["app",{"sourceInterval":[1676,1688]},"spaced",[["terminal",{"sourceInterval":[1683,1687]},"TO"]]],["app",{"sourceInterval":[1689,1699]},"rangeValue",[]],["star",{"sourceInterval":[1700,1706]},["app",{"sourceInterval":[1700,1705]},"space",[]]],["alt",{"sourceInterval":[1708,1717]},["terminal",{"sourceInterval":[1708,1711]},"]"],["terminal",{"sourceInterval":[1714,1717]},"}"]]]],"simpleRangeCond":["define",{"sourceInterval":[1724,1809]},null,[],["alt",{"sourceInterval":[1742,1809]},["seq",{"sourceInterval":[1742,1756]},["terminal",{"sourceInterval":[1743,1746]},">"],["app",{"sourceInterval":[1747,1755]},"subquery",[]]],["seq",{"sourceInterval":[1759,1773]},["terminal",{"sourceInterval":[1760,1763]},"<"],["app",{"sourceInterval":[1764,1772]},"subquery",[]]],["seq",{"sourceInterval":[1776,1791]},["terminal",{"sourceInterval":[1777,1781]},">="],["app",{"sourceInterval":[1782,1790]},"subquery",[]]],["seq",{"sourceInterval":[1794,1809]},["terminal",{"sourceInterval":[1795,1799]},"<="],["app",{"sourceInterval":[1800,1808]},"subquery",[]]]]],"regexCond":["define",{"sourceInterval":[1834,1879]},null,[],["seq",{"sourceInterval":[1846,1879]},["terminal",{"sourceInterval":[1846,1849]},"/"],["plus",{"sourceInterval":[1850,1875]},["alt",{"sourceInterval":[1851,1873]},["app",{"sourceInterval":[1851,1856]},"alnum",[]],["app",{"sourceInterval":[1859,1873]},"regexCharacter",[]]]],["terminal",{"sourceInterval":[1876,1879]},"/"]]],"genericCond":["define",{"sourceInterval":[1903,1983]},null,[],["alt",{"sourceInterval":[1917,1983]},["app",{"sourceInterval":[1917,1926]},"fieldCond",[]],["app",{"sourceInterval":[1929,1938]},"rangeCond",[]],["app",{"sourceInterval":[1941,1956]},"simpleRangeCond",[]],["app",{"sourceInterval":[1959,1968]},"regexCond",[]],["app",{"sourceInterval":[1971,1983]},"detachedCond",[]]]],"cond":["define",{"sourceInterval":[1988,2030]},null,[],["alt",{"sourceInterval":[1995,2030]},["app",{"sourceInterval":[1995,2016]},"parented",[["app",{"sourceInterval":[2004,2015]},"genericCond",[]]]],["app",{"sourceInterval":[2019,2030]},"genericCond",[]]]],"simpleNegation":["define",{"sourceInterval":[2036,2065]},null,[],["seq",{"sourceInterval":[2053,2065]},["terminal",{"sourceInterval":[2053,2056]},"-"],["app",{"sourceInterval":[2057,2065]},"subquery",[]]]],"simpleMust":["define",{"sourceInterval":[2070,2095]},null,[],["seq",{"sourceInterval":[2083,2095]},["terminal",{"sourceInterval":[2083,2086]},"+"],["app",{"sourceInterval":[2087,2095]},"subquery",[]]]],"longNegation":["define",{"sourceInterval":[2100,2136]},null,[],["seq",{"sourceInterval":[2115,2136]},["terminal",{"sourceInterval":[2115,2120]},"NOT"],["plus",{"sourceInterval":[2121,2127]},["app",{"sourceInterval":[2121,2126]},"space",[]]],["app",{"sourceInterval":[2128,2136]},"subquery",[]]]],"markedCond":["define",{"sourceInterval":[2141,2196]},null,[],["alt",{"sourceInterval":[2154,2196]},["app",{"sourceInterval":[2154,2166]},"longNegation",[]],["app",{"sourceInterval":[2169,2183]},"simpleNegation",[]],["app",{"sourceInterval":[2186,2196]},"simpleMust",[]]]],"queryElement":["define",{"sourceInterval":[2202,2234]},null,[],["alt",{"sourceInterval":[2217,2234]},["app",{"sourceInterval":[2217,2227]},"markedCond",[]],["app",{"sourceInterval":[2230,2234]},"cond",[]]]],"subquery":["define",{"sourceInterval":[2236,2277]},null,[],["alt",{"sourceInterval":[2247,2277]},["app",{"sourceInterval":[2247,2262]},"parented",[["app",{"sourceInterval":[2256,2261]},"query",[]]]],["app",{"sourceInterval":[2265,2277]},"queryElement",[]]]],"query":["define",{"sourceInterval":[2282,2347]},null,[],["alt",{"sourceInterval":[2290,2347]},["app",{"sourceInterval":[2290,2329]},"nonemptyListOf",[["app",{"sourceInterval":[2305,2313]},"subquery",[]],["app",{"sourceInterval":[2315,2328]},"genericBoolOp",[]]]],["app",{"sourceInterval":[2332,2347]},"parented",[["app",{"sourceInterval":[2341,2346]},"query",[]]]]]]}]);
