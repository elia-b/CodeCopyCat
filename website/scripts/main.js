const textElement = document.getElementById("text");
const testButton = document.getElementById("test");
const errorTextElement = document.getElementById("error-text");
const nextCharElement = document.getElementById("next-char");
const correctTextElement = document.getElementById("correct-text");
const urlForm = document.getElementById("urlForm");
const Http = new XMLHttpRequest();
let text = "";
let correctText = "";
let errorText = "";
let nextChar = "";
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

		if (keyChar == nextChar && errorText.length == 0) {
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
	correctText = correctText + nextChar;
	nextChar = text.charAt(0);
	text = text.substring(1);
	updateText();
}

function wrongAnswer(eventKey) {
	if (eventKey == 'Backspace' && errorText.length > 0) {
		errorText = errorText.slice(0, -1);
	}
	else if (eventKey == 'Backspace') {
		if (correctText.length > 0) {
			text = nextChar + text;
			nextChar = correctText.charAt(correctText.length - 1);
		}
		correctText = correctText.slice(0, -1);
	}
	else if (eventKey.length === 1) {
		errorText = errorText + eventKey;
	}
	updateText();
}

function updateText(){
	textElement.innerText = text;
	correctTextElement.innerText = correctText;
	errorTextElement.innerText = errorText;
	nextCharElement.innerText = nextChar;
}

function submitUrl() {
	let url = document.forms["urlForm"]["url"].value;
	console.log(url);
	loadUrl(url);
}

function loadUrl(url) {
	Http.open("GET", url);
	Http.send();

	Http.onreadystatechange = (e) => {
		text = Http.responseText;
		text = text.replace(/ /g, String.fromCharCode(0x0B7));
		nextChar = text.charAt(0);
		text = text.substring(1);
		correctText = "";
		errorText = "";
		pageStatus = "text";
		updateText();
	}

}

urlForm.addEventListener("submit", (e) => {
	e.preventDefault();
	submitUrl();
});

testButton.addEventListener("click", (e) => {
	loadUrl("https://raw.githubusercontent.com/elia-b/CodeCopyCat/main/website/examples/hello-word.c");
});

const sleepTime = 650;
function removeHighlight(){

	nextCharElement.classList.remove("underline");
    setTimeout(addHighlight, sleepTime);
}

function addHighlight(){
	nextCharElement.classList.add("underline");
    setTimeout(removeHighlight, sleepTime);
}

removeHighlight();
