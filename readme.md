Shoelips
========

Shoelips is a stack based postfix language. This means that every token which isn't an operator will get put on the stack. Operators thus pop the appropriate amount of values from the stack, then push the result(s).

Operators
---------

* **Math**:
	There are four math operations. They all pop two values off the stack, then push the result.
	* **add**: Addition
	* **sub**: Subtraction
	* **multi**: Multiplication
	* **div**: Division
	* **mod**: Modulus

* **Comparison**:
	There are six comparison operations. They all pop two values off the stack, then push the resulting boolean.
	* **==**
	* **!=**
	* **>**
	* **>=**
	* **<**
	* **<=**

* **Flow Control**:
	These are operations which control the flow of the program. They all involve "expressions", a piece of code enclosed in (parenthesis).
	* **exec**: Expects two expressions on the stack. The stack produced by the first expression will be passed into the second expression, this to allow for parameters.
	* **while**: Expects two expressions on the stack. The first expression is the condition; if the last value on the stack after that expression is a true boolean, execute the latter condition and repeat. If not, just keep on.
	* **if**: Very similar to while, except that it doesn't repeat until the first expression is false.

* **Misc**:
	**def**: Expects the first value on the stack to be a string, and the second to be any value. Defines a new variable with the name being the string in the first value on the stack, and the value being the second value on the stack. The variable is accessible only in its current expression and all expression it contains.
	**set**: Much like def, except it's used to modify existing variables, not make new ones.

	**print**: Print out the first value on the stack.
	**concat**: Concatinate the two first values on the stack, then put the result on the stack.
	**void**: Delete the first value on the stack without returning anything.
