function createSpeechRecognition(): SpeechRecognition {
  // @ts-ignore
  return new (window.SpeechRecognition || window.webkitSpeechRecognition)();
}

export class Transcript {
  private continueListening = true;
  private recognition: SpeechRecognition = createSpeechRecognition();

  start(onSpeech: (speech: SpeechRecognitionAlternative) => void) {
    this.recognition.continuous = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onstart = () => console.log(' - onstart');
    this.recognition.onerror = event => console.log(' - error', event);
    this.recognition.onresult = event => onSpeech(event.results[event.resultIndex][0]);
    this.recognition.onend = () => this.continueListening && this.recognition.start();
    this.recognition.start();
  }

  stop() {
    this.continueListening = false;
  }
}
