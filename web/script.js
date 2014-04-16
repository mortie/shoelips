function interpret() {
	document.getElementById("output").value = "";

	var input = document.getElementById("input").value;
	evaluate(input);
}

function loadExample(element) {
	if (element.value == "0") {
		document.getElementById("input").value = "";
		document.getElementById("description").innerHTML = "";
	} else {
		console.log("Loading "+element.value);

		//ask for code
		ajax("examples/"+element.value+".shoe", function(result) {
			document.getElementById("input").value = result;
		});

		//ask for description
		ajax("descriptions/"+element.value+".html", function(result) {
			document.getElementById("description").innerHTML = result;
		});
	}
}

function ajax(path, callback) {
	var request = new XMLHttpRequest();
	request.overrideMimeType("text/plain");

	request.open("post", path, true);
	request.onreadystatechange = function() {
		console.log("is "+request.readyState);
		if (request.readyState == 4) {
			callback(request.responseText);
		}
	}
	request.send();
}
