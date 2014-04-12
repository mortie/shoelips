var fs = require("fs");

function error(str) {
	console.log(str);
	process.exit();
}

function getVar(v, loc) {
	if (loc[v]) {
		return loc[v];
	} else {
		return globalVars[v];
	}
}

var globalVars = [];

function evaluate(str, preStack) {
	var operators = {
		"+": function() {
			stack.push(stack.pop()+stack.pop());
		},
		"-": function() {
			stack.push(stack.pop()-stack.pop());
		},
		"*": function() {
			stack.push(stack.pop()*stack.pop());
		},
		"/": function() {
			stack.push(stack.pop()/stack.pop());
		},
		"%": function() {
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

		"defglobal": function() {
			var key = stack.pop();
			var val = stack.pop();
			globalVars[key] = val;
		},
		"def": function() {
			localVars[stack.pop()] = stack.pop();
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

			var ret = (evaluate(exp, evaluate(args)));
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
				condResult = evaluate(condition);
				if (condResult[condResult.length-1] === true) {
					expResult = evaluate(expression);

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
			var condResult = evaluate(condition);
			var i;

			if (condResult[condResult.length-1] === true) {
				expResult = evaluate(expression);

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
	var tokenIndex;

	for (tokenIndex=0; tokenIndex<tokens.length; ++tokenIndex) {
		var token = tokens[tokenIndex];

		if (token[0] == "$") {
			var vName = token.slice(1);
			var v = getVar(vName, localVars);
			if (v !== undefined) {
				stack.push(v);
			} else {
				error("Undefined variable: "+vName);
			}
		} else if (token.match(/[0-9\.]/)) {
			stack.push(parseFloat(token));
		} else if (token) {
			if (operators[token] !== undefined) {
				operators[token]();
			} else {
				stack.push(token);
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
