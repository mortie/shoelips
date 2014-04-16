Shoelips
========

Shoelips is a stack based postfix language. This means that every token which isn't an operator will get put on the stack. Operators thus pop the appropriate amount of values from the stack, then push the result(s).

Find an online interpreter [here](http://d.mortie.org/webapp/shoelips).

Blocks are rather unusual in this language. Whenever you have a '(' in your code, everything until the matching ')'. That string can then be printed, concatinated, evaluated, or whatever you feel like doing with it.

I've written an example implementation of shoelips in javascript. The web version of it is in the web/ folder, the node.js folder is in nodejs/.

Operators
---------

### Math
There are four math operations. They all pop two values off the stack, then push the result.

* **add**: Addition
* **sub**: Subtraction
* **multi**: Multiplication
* **div**: Division
* **mod**: Modulus

### Comparison
There are six comparison operations. They all pop two values off the stack, then push the resulting boolean.

* **==**
* **!=**
* **>**
* **>=**
* **<**
* **<=**

### Flow Control
These are operations which control the flow of the program. They all involve "blocks", a piece of code enclosed in (parenthesis).

* **exec**: Expects two blocks on the stack. The stack produced by evaluating the first block will be passed into the second block, this to allow for parameters.
* **while**: Expects two blocks on the stack. The first block is the condition. If the last value on the stack produced by evaluating that block true boolean, execute the latter block. Repeat. If not, just keep on.
* **if**: Very similar to while, except that it doesn't repeat.

### I/O
These are operations which lets Shoelips programs interact with the environment.

* **readln**: Halts execution, prompting the user for a string. Puts said string on the stack afterwards.
* **print**: Displays the first value on the stack to the user.
* **readfile**: Reads the contents of a file into the stack as a string.
* **writefile**: Expects the first value on the stack to be the string to write, the second value to be the name of the file to write to.

### Misc

* **def**: Expects the first value on the stack to be a string, and the second to be any value. Defines a new variable with the name being the string in the first value on the stack, and the value being the second value on the stack. The variable is accessible only in its current expression and all expression it contains.
* **set**: Much like def, except it's used to modify existing variables, not make new ones.
* **concat**: Concatinate the two first values on the stack, then put the result on the stack.
* **void**: Delete the first value on the stack without returning anything.
* **tostring**: Take a number on the stack, and turn into a string.
* **tonumber**: Take the numerical string on the stack, and turn it into a number.

Examples
--------

The examples/ folder contains some examples of programs written in shoelips. This section is short examples of how to use various features.

### def

	10 foo def

Defines the variable "foo" as 10. The variable can be referenced with $foo.

### print

	( Hello World! ) print

Print the text "Hello World!".

### concat

	10 foo def
	$foo ( foo is ) concat print

Define the variable 'foo' as 10, then concatinate foo and the block ( foo is ). Print the result.
This prints "foo is 10".

### if

	(
		( foo is 10! ) print
	) ( 10 $foo == ) if

Print "foo is 10!" if the variable foo is 10

### while
	10 i def
	(
		( hi! ) print
		1 $i sub
	) ( 0 $i > ) while

Print "hi!", then decrement the variable i, while i is greater than 0.

### functions
Shoelips doesn't have functions in the same way most other languages does. Instead, you define a variable as a block, like this:

	(
		( Hello World! ) print
	) myFunc def

This will define the variable "myFunc" as a block which, when executed, prints "Hello World!". In all examples where I've used an inline block, I could've substituted that block with a "function".
