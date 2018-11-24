// @ts-ignore
var recognition = new window.webkitSpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();

recognition.onstart = function() {
  console.log('Voice recognition activated. Try speaking into the microphone.');
};

recognition.onspeechend = function() {
  console.log('You were quiet for a while so voice recognition turned itself off.');

  noteContent = '';
  setTimeout(() => recognition.start(), 10);
};

recognition.onerror = function(event) {
  if (event.error === 'no-speech') console.log('No speech was detected. Try again.');
  else console.log(event);
};

let noteContent = '';

recognition.onresult = function(event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  noteContent += transcript;
  console.log(noteContent);
};

recognition.start();
