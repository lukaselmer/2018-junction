import { defaultTranscript, initialTranscript } from '../conversation';

const debug = false;

function createSpeechRecognition(): SpeechRecognition {
  // @ts-ignore
  return new (window.SpeechRecognition || window.webkitSpeechRecognition || SpeechRecognitionMock)();
}

class SpeechRecognitionMock {
  continuous: any;
  maxAlternatives: any;
  onstart: any;
  onerror: any;
  onresult: any;
  onend: any;
  start() {}
  stop() {}
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
    if (debug) this.listeners.push(() => console.log(this.conversation));

    this.recognition.continuous = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onstart = () => (this.isListening = true);
    this.recognition.onerror = event => console.error('recognition.onerror', event);
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
    if (debug) console.log('female / total ratio', ratio.toFixed(3), male, female);
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
    this.conversation = initialTranscript();
    this.continueListening = true;
    if (this.isListening) return;
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
    this.continueListening = false;
  }

  recordSpeakers(speakers: Set<number>) {
    for (const speaker of speakers)
      this.speakerCounts.set(speaker, (this.speakerCounts.get(speaker) || 0) + 1);
  }
}
