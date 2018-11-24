import fourierTransform from 'fourier-transform';
import mfcc from 'mfcc/src/mfcc';

const numberOfChannels = 1;
const humanVoiceFrequencyMin = 200;
const humanVoiceFrequencyMax = 2000;

const femaleVoiceThreshold = 25000;
const voiceThreshold = 15000;

export interface FrameEvent {
  timeStamp: number;
  speakerIndices: Set<number>;
}

export type FrameCallback = (event: FrameEvent) => void;

export class SpeakerDetector {
  async start(onFrame: FrameCallback) {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    const context = new AudioContext();
    const source = context.createMediaStreamSource(this.mediaStream);
    this.mediaStreamProcessor = context.createScriptProcessor(
      1024, // * 16,
      numberOfChannels,
      numberOfChannels
    );

    source.connect(this.mediaStreamProcessor);
    this.mediaStreamProcessor.connect(context.destination);

    this.mediaStreamProcessor.onaudioprocess = e => {
      console.assert(
        e.inputBuffer.numberOfChannels == numberOfChannels,
        'Unexpected number of channels in the input buffer'
      );

      const channelData = e.inputBuffer.getChannelData(0);
      const spectrum: number[] = fourierTransform(channelData);
      console.assert(
        spectrum.length == channelData.length >> 1,
        'Wrong FFT spectrum size: ' + spectrum.length
      );

      const singleFrequencyStep = 0.5 / e.inputBuffer.duration;
      const humanSpectrum = spectrum.slice(
        Math.floor(humanVoiceFrequencyMin / singleFrequencyStep),
        Math.ceil((humanVoiceFrequencyMax - humanVoiceFrequencyMin) / singleFrequencyStep)
      );
      console.log(humanSpectrum);

      this.debug_drawCharts(channelData, humanSpectrum.map(v => v * (humanSpectrum.length >> 5)));

      if (this.model) {
        const xs = tf.tensor2d([...humanSpectrum.keys()]);
        const ys = tf.tensor2d(humanSpectrum);
        this.model.fit(xs, ys);
      }

      const mel = mfcc.construct(
        spectrum.length, // Number of expected FFT magnitudes
        20, // Number of Mel filter banks
        humanVoiceFrequencyMin, // Low frequency cutoff
        humanVoiceFrequencyMax, // High frequency cutoff
        e.inputBuffer.sampleRate
      );

      const speakers = new Set<number>();

      const humanSpectrumMax = Math.max(...humanSpectrum);
      const weightedFrequency = humanSpectrum.reduce(
        (acc, value, index) => acc + (value / humanSpectrumMax) * index * index
      );

      if (weightedFrequency > femaleVoiceThreshold) {
        speakers.add(1);
      } else if (weightedFrequency > voiceThreshold) {
        speakers.add(0);
      }

      onFrame({
        timeStamp: e.timeStamp,
        speakerIndices: speakers
      });
    };
  }

  private mediaStream: MediaStream | undefined;
  private mediaStreamProcessor: ScriptProcessorNode | undefined;

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
      canvas.width = window.innerWidth >> 1;
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

    const fftBarWidth = fft.el.width / fftData.length,
      fftTickStep = Math.floor(50 / fftBarWidth);
    fftData.forEach((value, index) => {
      const y = fft.el.height * (1 - value);
      fft.ctx.lineTo(fftBarWidth * index, y);
      if (!(index % fftTickStep)) {
        fft.ctx.strokeText(index.toString(), fftBarWidth * (index + 0.5), 10);
      }
      fft.ctx.lineTo(fftBarWidth * (index + 1), y);
    });
    fft.ctx.stroke();
  }

  stop() {
    if (!this.mediaStream) {
      throw new Error('Audio processor not set. Trying to stop when already stopped?');
    }
    this.mediaStream.getAudioTracks().forEach(track => track.stop());
    this.mediaStream = undefined;

    if (this.mediaStreamProcessor) {
      this.mediaStreamProcessor.disconnect();
      this.mediaStreamProcessor = undefined;
    }
  }
}
