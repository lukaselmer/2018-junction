function start() {
  // @ts-ignore
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onstart = function() {
    console.log(' - onstart');
  };

  recognition.onspeechend = function() {
    console.log(' - onspeechend');
  };

  recognition.onerror = function(event) {
    if (event.error === 'no-speech') console.log(' - no-speech');
    else console.log(event);
  };

  recognition.continuous = false;
  // recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognition.onresult = function(event) {
    // Get a transcript of what was said.
    // var transcript = event.results[current][0].transcript;
    console.table(event.results[event.resultIndex]);

    // Add the current transcript to the contents of our Note.
    // console.log(transcript);
  };

  recognition.onend = function() {
    recognition.start();
  };

  recognition.start();
}

start();
