function speak(text, voice) {
  const speach = new SpeechSynthesisUtterance(text);
  speach.voice = speechSynthesis.getVoices()[voice];
  speechSynthesis.speak(speach);
}

function male(text) {
  speak(text, 0);
}

function female(text) {
  speak(text, 36);
}

female('Hi Lukas, how are you doing?');
male('Hi Marion, I am doing great. How about you?');
female('Me too, everything is fine.');
male('What have you been up to lately?');
female('I’ve been travelling the US for three weeks.');
male('Oh, this sounds great. Where have you been?');
female('In Washington and California. What have you been doing?');
male('I’ve been working hard and I organised a few meetups.');
female('Sounds wonderful. Should we catch up and go for a coffee sometime?');
male('Yes, please. How about Monday?');
female('Monday works for me. See you then!');
male('See you, looking forward to it!');
