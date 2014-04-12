var fs = require("fs");

function evaluate(str) {
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

		"def": function() {
			variables[stack.pop()] = stack.pop();
		},
		"get": function() {
			stack.push(variables[stack.pop()]);
		},
		"exec": function() {
			var ret = (evaluate(stack.pop()));
			var i;

			for (i=0; i<ret.length; ++i) {
				stack.push(ret[i]);
			}
		},

		"{": function() {
			var result = "";
			var depth = 0;
			var i;

			for (i=tokenIndex+1; i<tokens.length; ++i) {
				token = tokens[i];

				if (token == "{") {
					++depth;
				} else if (token == "}") {
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

	var stack = [];
	var variables = [];
	var tokens = str.split(/\s/);
	var tokenIndex;

	for (tokenIndex=0; tokenIndex<tokens.length; ++tokenIndex) {
		var token = tokens[tokenIndex];

		if (token.match(/[0-9\.]/)) {
			stack.push(token);
		} else if (token[0] == "/") {
			stack.push(token.slice(1));
		} else {
			operators[token]();
		}
	}

	return stack;
}

function() {
	var file = process.arguments[2];
	if (file) {
		fs.readFile(file, "utf8", function(err, data) {
			console.log(evaluate(data));
			process.kill();
		});
	} else {
		process.stdin.on('data', function (data) {
			console.log(evaluate(data));
		});
	}
}
