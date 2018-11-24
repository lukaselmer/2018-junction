import fourierTransform from 'fourier-transform';
import mfcc from 'mfcc/src/mfcc';

const numberOfChannels = 1;
const humanVoiceFrequencyMin = 200;
const humanVoiceFrequencyMax = 8000;

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
    this.mediaStreamProcessor = context.createScriptProcessor(1024, numberOfChannels, numberOfChannels);

    source.connect(this.mediaStreamProcessor);
    this.mediaStreamProcessor.connect(context.destination);

    const detector = this;
    this.mediaStreamProcessor.onaudioprocess = function(e) {
      console.assert(
        e.inputBuffer.numberOfChannels == numberOfChannels,
        'Unexpected number of channels in the input buffer'
      );

      const channelData = e.inputBuffer.getChannelData(0);
      const spectrum: number[] = fourierTransform(channelData);

      const singleFrequencyStep = e.inputBuffer.sampleRate / channelData.length;
      const humanSpectrum = spectrum.slice(
        Math.floor(humanVoiceFrequencyMin / singleFrequencyStep),
        Math.ceil(humanVoiceFrequencyMax / singleFrequencyStep)
      );

      detector.debug_drawCharts(channelData, humanSpectrum.map(v => v * 3));

      const mel = mfcc.construct(
        spectrum.length, // Number of expected FFT magnitudes
        20, // Number of Mel filter banks
        humanVoiceFrequencyMin, // Low frequency cutoff
        humanVoiceFrequencyMax, // High frequency cutoff
        e.inputBuffer.sampleRate
      );

      // detector.debug_drawCharts(channelData, mel(spectrum).map(v => (v + 3) / 6));

      const speakers = new Set<number>();
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
