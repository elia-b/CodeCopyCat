const textElement = document.getElementById("text");
const urlForm = document.getElementById("urlForm");
const Http = new XMLHttpRequest();
let text;
let correctText = "";
let errorText = "";
let pageStatus = "no text";


window.addEventListener("keydown", function (event) {
	if (pageStatus === "text"){
		let keyChar;

		switch (event.key) {
			case 'Enter':
				keyChar = String.fromCharCode(0x000A);
				break;
			case ' ':
				keyChar = String.fromCharCode(0x0B7);
				break;
			default:
				keyChar = event.key;
		}

		if (keyChar == text.charAt(0) && errorText.length == 0) {
			correctAnswer();
		} 

		else {
			wrongAnswer(keyChar);
		}
		if (event.key != "Escape") {
			event.preventDefault();
		}
		else {
			pageStatus = "pause";
		}

		if (text.length === 0) {
			finishedText();
		}
	}
	else if (pageStatus === "pause" && event.key === "r") {
		pageStatus = "text";
	}
	
}, true);

function finishedText() {
	pageStatus = "no text";
	console.log("Finished Text");
}

function correctAnswer() {
	correctText = correctText + text.charAt(0);
	text = text.substring(1);
	updateText();
}

function wrongAnswer(eventKey) {
	if (eventKey == 'Backspace' && errorText.length > 0) {
		errorText = errorText.slice(0, -1);
	}
	else if (eventKey == 'Backspace') {
		text = correctText.charAt(correctText.length - 1) + text;
		correctText = correctText.slice(0, -1);
	}
	else if (eventKey.length === 1) {
		errorText = errorText + eventKey;
	}
	updateText();
}

function updateText(){
	let correctTextElement = document.createElement('span');
	let errorTextElement = document.createElement('span');
	errorTextElement.classList.add("error");
	correctTextElement.innerHTML = correctText;
	errorTextElement.innerHTML = errorText;
	textElement.innerHTML = correctTextElement.outerHTML + errorTextElement.outerHTML + text;
}

function submitUrl() {
	let url = document.forms["urlForm"]["url"].value;
	console.log(url);

	Http.open("GET", url);
	Http.send();

	Http.onreadystatechange = (e) => {
		text = Http.responseText;
		text = text.replace(/ /g, String.fromCharCode(0x0B7));
		textElement.innerHTML = text;
	}

	correctText = "";
	errorText = "";
	pageStatus = "text";
}

urlForm.addEventListener("submit", (e) => {
	e.preventDefault();
	submitUrl();
});
