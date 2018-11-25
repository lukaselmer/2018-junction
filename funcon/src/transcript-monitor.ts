import { defaultTranscript } from '../conversation';

function createSpeechRecognition(): SpeechRecognition {
  // @ts-ignore
  return new (window.SpeechRecognition || window.webkitSpeechRecognition)();
}

export interface Speech {
  transcript: string;
  speaker: number;
}

export type SpeechRecognitionResult = SpeechRecognitionAlternative & { speaker: number };
export type TranscriptListener = (speech: SpeechRecognitionResult) => void;

export class TranscriptMonitor {
  private continueListening = true;
  private isListening = false;
  private recognition: SpeechRecognition = createSpeechRecognition();
  private listeners: (TranscriptListener)[] = [];
  private speakerCounts = new Map<number, number>();
  conversation: Speech[] = defaultTranscript();

  constructor() {
    this.listeners.push(speech => this.conversation.push(speech));
    this.listeners.push(() => console.log(this.conversation));

    this.recognition.continuous = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onstart = () => (this.isListening = true);
    this.recognition.onerror = event => this.log('onerror', event);
    this.recognition.onresult = event => this.recordResult(event);
    this.recognition.onend = () =>
      this.continueListening ? this.recognition.start() : (this.isListening = false);
  }

  private recordResult(event: SpeechRecognitionEvent) {
    if (!this.continueListening) return;
    const result = event.results[event.resultIndex][0];
    const speaker = this.mostActiveSpeaker();
    this.listeners.forEach(listener =>
      listener({
        confidence: result.confidence,
        transcript: result.transcript,
        speaker
      })
    );
    this.speakerCounts.clear();
  }

  private mostActiveSpeaker() {
    const male = this.speakerCounts.get(0) || 0;
    const female = this.speakerCounts.get(1) || 0;
    const ratio = female / (male + female || -1);
    console.log(ratio.toFixed(3));
    // const topSpeaker = maxBy([...this.speakerCounts.entries()], ([, count]) => count);
    // if (!topSpeaker) return -1;
    return ratio > 0.18 ? 1 : 0;
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

  recordSpeakers(speakers: Set<number>) {
    for (const speaker of speakers)
      this.speakerCounts.set(speaker, (this.speakerCounts.get(speaker) || 0) + 1);
  }
}
