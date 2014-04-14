#!/usr/bin/env node
var fs = require("fs");

function error(str, token) {
	console.log(str+" at token "+(1+token));
	process.exit();
}

function getVar(v, loc, scope) {
	if (loc[v] !== undefined) {
		return loc[v];
	} else {
		return scope[v];
	}
}

function evaluate(str, preStack, preVars) {
	var operators = {
		"add": function() {
			stack.push(stack.pop()+stack.pop());
		},
		"sub": function() {
			stack.push(stack.pop()-stack.pop());
		},
		"multi": function() {
			stack.push(stack.pop()*stack.pop());
		},
		"div": function() {
			stack.push(stack.pop()/stack.pop());
		},
		"mod": function() {
			stack.push(stack.pop()%stack.pop());
		},

		"==": function() {
			stack.push((stack.pop()==stack.pop())?true:false);
		},
		"!=": function() {
			stack.push((stack.pop()!=stack.pop())?true:false);
		},
		">": function() {
			stack.push((stack.pop()>stack.pop())?true:false);
		},
		"<": function() {
			stack.push((stack.pop()<stack.pop())?true:false);
		},
		">=": function() {
			stack.push((stack.pop()>=stack.pop())?true:false);
		},
		"<=": function() {
			stack.push((stack.pop()<=stack.pop())?true:false);
		},

		"def": function() {
			localVars[stack.pop()] = stack.pop();
		},
		"set": function() {
			var vName = stack.pop();
			var val = stack.pop();

			if (localVars[vName] !== undefined) {
				localVars[vName] = val;
			} else if (scopeVars[vName] !== undefined) {
				scopeVars[vName] = val;
			} else {
				error("Undefined variable: "+vName, tokenIndex);
			}
		},

		"print": function() {
			console.log(stack.pop());
		},
		"concat": function() {
			stack.push(stack.pop()+" ".concat(stack.pop()));
		},

		"exec": function() {
			var args = stack.pop();
			var exp = stack.pop();

			var ret = (evaluate(exp, evaluate(args), localVars));
			var i;

			for (i=0; i<ret.length; ++i) {
				stack.push(ret[i]);
			}
		},

		"while": function() {
			var condition = stack.pop();
			var expression = stack.pop();
			var condResult;
			var expResult;
			var i;

			while (true) {
				condResult = evaluate(condition, [], localVars);
				if (condResult[condResult.length-1] === true) {
					expResult = evaluate(expression, [], localVars);

					for (i=0; i<expResult.length; ++i) {
						stack.push(expResult[i]);
					}
				} else {
					return;
				}
			}
		},
		"if": function() {
			var condition = stack.pop();
			var expression = stack.pop();
			var condResult = evaluate(condition, [], localVars);
			var i;

			if (condResult[condResult.length-1] === true) {
				expResult = evaluate(expression, [], localVars);

				for (i=0; i<expResult.length; ++i) {
					stack.push(expResult[i]);
				}
			}
		},

		"(": function() {
			var result = "";
			var depth = 0;
			var i;

			for (i=tokenIndex+1; i<tokens.length; ++i) {
				token = tokens[i];

				if (token == "(") {
					++depth;
				} else if (token == ")") {
					if (depth <= 0) {
						break;
					} else {
						--depth;
					}
				}
				result += token+" ";
			}

			tokenIndex = i;
			stack.push(result.slice(0, -1));
		}
	}

	var stack = preStack || [];
	var tokens = str.split(/\s+/);
	var localVars = [];
	var scopeVars = preVars || [];
	var tokenIndex;

	for (tokenIndex=0; tokenIndex<tokens.length; ++tokenIndex) {
		var token = tokens[tokenIndex];

		if (token[0] == "$") {
			var vName = token.slice(1);
			var v = getVar(vName, localVars, scopeVars);
			if (v === undefined) {
				error("Undefined variable: "+vName, tokenIndex);
			} else {
				stack.push(v);
			}
		} else if (token.match(/[0-9\.]/)) {
			stack.push(parseFloat(token));
		} else if (token) {
			if (operators[token] === undefined) {
				stack.push(token);
			} else {
				operators[token]();
			}
		}
	}

	return stack;
}

(function() {
	var file = process.argv[2];
	if (file) {
		fs.readFile(file, "utf8", function(err, data) {
			console.log(evaluate(data));
			process.kill();
		});
	} else {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', function (data) {
			console.log(evaluate(data));
		});
	}
})();
