import decibels from 'decibels';
import fourierTransform from 'fourier-transform';

const numberOfChannels = 1;
const speakerDbRangeHalf = 5;
const voiceDbThreshold = -25;

export interface FrameEvent {
  timeStamp: number;
  speakerIndices: Set<number>;
}

export type FrameCallback = (event: FrameEvent) => void;

export class SpeakerDetector {
  async start(onFrame: FrameCallback) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.handleSuccess(stream, onFrame);
  }

  // TODO(dotdoom): sort for binary search.
  private speakerAverageDb: number[] = [];
  private processor: ScriptProcessorNode | null = null;

  private getOrAddSpeakerIndex(db: number) {
    const existingIndex = this.speakerAverageDb.findIndex(
      averageDb => db >= averageDb - speakerDbRangeHalf && db <= averageDb + speakerDbRangeHalf
    );

    if (existingIndex == -1) {
      // TODO(dotdoom): adjust db to avoid overlay with other speakers.
      return this.speakerAverageDb.push(db) - 1;
    }
    return existingIndex;
  }

  private debug_drawCharts(pcmData: Float32Array, fftData: number[]) {
    const getClearCanvasAndContext = (name: string) => {
      const canvas = document.getElementById(name) as HTMLCanvasElement | null;
      if (!canvas) {
        throw new Error('Cannot find an element for canvas ' + name);
      }
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Cannot get a context of canvas ' + name);
      }

      // Clear the canvas [sic!].
      canvas.width = window.innerWidth;
      context.moveTo(0, 0);

      return {
        el: canvas,
        ctx: context
      };
    };

    const pcm = getClearCanvasAndContext('pcm'),
      fft = getClearCanvasAndContext('fft');

    pcmData.forEach((value, index) =>
      pcm.ctx.lineTo((pcm.el.width / pcmData.length) * index, ((value + 1) / 2) * pcm.el.height)
    );
    pcm.ctx.stroke();

    const fftBarWidth = fft.el.width / fftData.length;
    fftData.forEach((value, index) => {
      const y = fft.el.height * (1 - value);
      fft.ctx.lineTo(fftBarWidth * index, y);
      fft.ctx.lineTo(fftBarWidth * (index + 1), y);
    });
    fft.ctx.stroke();
  }

  private handleSuccess(stream: MediaStream, onFrame: FrameCallback) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    this.processor = context.createScriptProcessor(1024, numberOfChannels, numberOfChannels);

    source.connect(this.processor);
    this.processor.connect(context.destination);

    const detector = this;
    this.processor.onaudioprocess = function(e) {
      console.assert(
        e.inputBuffer.numberOfChannels == numberOfChannels,
        'Unexpected number of channels in the input buffer'
      );

      const channelData = e.inputBuffer.getChannelData(0);
      const spectrum: number[] = fourierTransform(channelData);

      detector.debug_drawCharts(channelData, spectrum.slice(0, spectrum.length / 10).map(v => v * 3));

      const dbs = spectrum.map(value => decibels.fromGain(value));

      const speakers = new Set<number>();
      dbs.forEach(value => {
        if (value > voiceDbThreshold) {
          speakers.add(detector.getOrAddSpeakerIndex(value));
        }
      });
      onFrame({
        timeStamp: e.timeStamp,
        speakerIndices: speakers
      });
    };
  }

  stop() {
    if (!this.processor) {
      throw new Error('Audio processor not set. Trying to stop when already stopped?');
    }
    this.processor.disconnect();
  }
}
