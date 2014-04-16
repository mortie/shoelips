#!/usr/bin/env node
var fs = require("fs");

function error(str, token) {
	console.log("Error: "+str);
	process.exit();
}

function getVar(v, loc, scope) {
	if (loc[v] !== undefined) {
		return loc[v];
	} else {
		return scope[v];
	}
}

function pop(stack) {
	var popped = stack.pop();
	if (popped !== undefined) {
		return popped;
	} else {
		error("Nothing on the stack");
	}
}

var platform = {
	"readline": function() {
		return "";
		console.log("Warning: readline isn't supported in node.js yet.");
	}
	"readfile": function(name) {
		return fs.readFileSync(name, "utf-8");
	},
	"writeFile": function(name, data) {
		fs.writeFileSync(name, data, "utf-8");
	},
	"print": function(msg) {
		console.log(msg);
	}
}

function evaluate(str, preStack, preVars) {
	var operators = {
		"add": function() {
			stack.push(pop(stack) + pop(stack));
		},
		"sub": function() {
			stack.push(pop(stack) - pop(stack));
		},
		"multi": function() {
			stack.push(pop(stack) * pop(stack));
		},
		"div": function() {
			stack.push(pop(stack) / pop(stack));
		},
		"mod": function() {
			stack.push(pop(stack) % pop(stack));
		},

		"==": function() {
			stack.push((pop(stack) === pop(stack))?true:false);
		},
		"!=": function() {
			stack.push((pop(stack) != pop(stack))?true:false);
		},
		">": function() {
			stack.push((pop(stack) > pop(stack))?true:false);
		},
		"<": function() {
			stack.push((pop(stack) < pop(stack))?true:false);
		},
		">=": function() {
			stack.push((pop(stack) >= pop(stack))?true:false);
		},
		"<=": function() {
			stack.push((pop(stack) <= pop(stack))?true:false);
		},

		"def": function() {
			localVars[pop(stack)] = pop(stack);
		},
		"set": function() {
			var vName = pop(stack);
			var val = pop(stack);

			if (localVars[vName] !== undefined) {
				localVars[vName] = val;
			} else if (scopeVars[vName] !== undefined) {
				scopeVars[vName] = val;
			} else {
				error("Undefined variable: "+vName);
			}
		},

		"print": function() {
			platform.print(pop(stack));
		},
		"readline": function() {
			stack.push(platform.readline());
		},
		"readfile": function() {
			stack.push(platform.readfile(pop(stack)));
		},
		"writefile": function() {
			pratform.writefile(pop(stack), pop(stack));
		},

		"concat": function() {
			stack.push(pop(stack)+" ".concat(pop(stack)));
		},
		"void": function() {
			pop(stack);
		},
		"tostring": function() {
			stack.push(pop(stack).toString());
		},
		"tonumber": function() {
			stack.push(pop(parseFloat(stack)));
		},

		"exec": function() {
			var args = pop(stack);
			var exp = pop(stack);

			var ret = evaluate(exp, evaluate(args), localVars)[0];
			var i;

			for (i=0; i<ret.length; ++i) {
				stack.push(ret[i]);
			}
		},

		"while": function() {
			var condition = pop(stack);
			var expression = pop(stack);
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
			var condition = pop(stack);
			var expression = pop(stack);
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
		} else if (token.match(/(^[0-9]+$)|(^[0-9]+\.[0-9]+)/)) {
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
			//process.kill();
		});
	} else {
		console.log("You must supply a file.");
	}
})();
