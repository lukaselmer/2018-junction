function createSpeechRecognition(): SpeechRecognition {
  // @ts-ignore
  return new (window.SpeechRecognition || window.webkitSpeechRecognition)();
}

export type TranscriptListener = (speech: SpeechRecognitionAlternative) => void;

export class TranscriptMonitor {
  private continueListening = true;
  private isListening = false;
  private recognition: SpeechRecognition = createSpeechRecognition();
  private listeners: (TranscriptListener)[] = [];
  conversation: string[] = [];

  constructor() {
    this.listeners.push(speech => this.conversation.push(speech.transcript));
    this.listeners.push(() => console.log(this.conversation));

    this.recognition.continuous = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onstart = () => (this.isListening = true);
    this.recognition.onerror = event => this.log('onerror', event);
    this.recognition.onresult = event =>
      this.continueListening &&
      this.listeners.forEach(listener => listener(event.results[event.resultIndex][0]));
    this.recognition.onend = () =>
      this.continueListening ? this.recognition.start() : (this.isListening = false);
  }

  addListener(listener: TranscriptListener) {
    this.listeners.push(listener);
  }

  clearListeners() {
    this.listeners.splice(0, this.listeners.length);
  }

  start() {
    this.conversation.splice(0, this.conversation.length);
    this.continueListening = true;
    if (this.isListening) return;
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
    this.continueListening = false;
  }

  private log(msg, ...args) {
    console.log(` - ${msg}`, ...args);
    return true;
  }
}
