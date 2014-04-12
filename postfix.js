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
		
	}
}

var stack = [];

function evaluate(str) {
	var tokens = str.split(/\s/);

	for (var i in tokens) {
		var token = tokens[i];

		if (token.match(/[0-9\.]/)) {
			stack.push(token);
		} else if (token[0] == "/") {
			stack.push(token.slice(1));
		} else {
			operators[token]();
		}
	}

	console.log(stack);
}

evaluate("/hello");

