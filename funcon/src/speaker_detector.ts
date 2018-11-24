import decibels from 'decibels';
import fourierTransform from 'fourier-transform';

const numberOfChannels = 1;
const speakerDbRange = 20;
const voiceDbThreshold = -30;

export type FrameCallback = (speakerIndices: Set<number>) => void;

export class SpeakerDetector {
  async start(onFrame: FrameCallback) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.handleSuccess(stream, onFrame);
  }

  // TODO(dotdoom): sort for binary search.
  private speakerAverageDb: number[] = [];

  private getOrAddSpeakerIndex(db: number) {
    const existingIndex = this.speakerAverageDb.findIndex(
      value => db >= value - speakerDbRange / 2 || db <= value + speakerDbRange / 2
    );

    if (existingIndex == -1) {
      // TODO(dotdoom): adjust db to avoid overlay with other speakers.
      return this.speakerAverageDb.push(db) - 1;
    }
    return existingIndex;
  }

  private handleSuccess(stream: MediaStream, onFrame: FrameCallback) {
    // TODO(dotdoom): cross-browser compatibility.
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, numberOfChannels, numberOfChannels);

    source.connect(processor);
    processor.connect(context.destination);

    const detector = this;
    processor.onaudioprocess = function(e) {
      console.assert(
        e.inputBuffer.numberOfChannels == numberOfChannels,
        'Unexpected number of channels in the input buffer'
      );

      const channelData = e.inputBuffer.getChannelData(0);
      const spectrum = fourierTransform(channelData);
      const dbs = spectrum.map(value => decibels.fromGain(value));

      const speakers = new Set<number>();
      dbs.forEach(value => {
        if (value > voiceDbThreshold) {
          speakers.add(detector.getOrAddSpeakerIndex(value));
        }
      });
      onFrame(speakers);
    };
  }
}
