function start() {
  // @ts-ignore
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onstart = function() {
    console.log(' - onstart');
  };

  recognition.onspeechend = function(e) {
    console.log(' - onspeechend');
    console.log(e);
  };

  recognition.onsoundend = function(e) {
    console.log(' - onsoundend');
    console.log(e);
  };

  recognition.onaudioend = function(e) {
    console.log(' - onaudioend');
    console.log(e);
  };

  recognition.onerror = function(event) {
    if (event.error === 'no-speech') console.log(' - no-speech');
    else console.log(event);
  };

  recognition.continuous = false;
  // recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    // Get a transcript of what was said.
    // var transcript = event.results[current][0].transcript;
    const result = event.results[event.resultIndex][0];

    // Add the current transcript to the contents of our Note.
    console.table(result);
  };

  recognition.onend = function(e) {
    console.log(' - onend');
    console.log(e);
    recognition.start();
  };

  recognition.start();
}

start();
