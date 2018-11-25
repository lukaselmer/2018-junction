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

      const mel = mfcc.construct(
        spectrum.length, // Number of expected FFT magnitudes
        20, // Number of Mel filter banks
        humanVoiceFrequencyMin, // Low frequency cutoff
        humanVoiceFrequencyMax, // High frequency cutoff
        e.inputBuffer.sampleRate
      );

      const analysisSpeaker = this.speakerFromFFT(humanSpectrum);
      this.debug_drawCharts(
        channelData,
        humanSpectrum.map(v => v * (humanSpectrum.length >> 4)),
        analysisSpeaker
      );

      const speakers = new Set<number>();
      if (analysisSpeaker >= 0) {
        speakers.add(analysisSpeaker);
      }

      onFrame({
        timeStamp: e.timeStamp,
        speakerIndices: speakers
      });
    };
  }

  private mediaStream: MediaStream | undefined;
  private mediaStreamProcessor: ScriptProcessorNode | undefined;

  private imprintIndex = 0;
  private imprintDirection = 1;
  private imprintPixel: ImageData | undefined;

  private speakerFromFFT(fftData: number[]) {
    const fffft = fourierTransform(
      fftData
        .slice(0, Math.pow(2, Math.floor(Math.log2(fftData.length))))
        .map(v => v * (fftData.length >> 4))
    ) as number[];

    const sorted4ft = fffft.map((v, index) => [v, index]).sort((v1, v2) => v2[0] - v1[0]);
    let speaker = -1;
    for (let i = 0; i < sorted4ft.length / 8; ++i) {
      if (sorted4ft[i][0] > 0.04) {
        speaker = 0;
        if (sorted4ft[i][1] > sorted4ft.length / 4) {
          speaker = 1;
          break;
        }
      }
    }
    return speaker;
  }

  private debug_drawCharts(pcmData: Float32Array, fftData: number[], speaker: number) {
    const getCanvasAndContext = (name: string, shouldClear: boolean) => {
      const canvas = document.getElementById(name) as HTMLCanvasElement | null;
      if (!canvas) {
        throw new Error('Cannot find an element for canvas ' + name);
      }
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Cannot get a context of canvas ' + name);
      }

      const expectedWidth = canvas.clientWidth;
      if (shouldClear || canvas.width != expectedWidth) {
        // Clear the canvas [sic!].
        canvas.width = expectedWidth;
        context.moveTo(0, 0);
      }

      return {
        el: canvas,
        ctx: context
      };
    };

    const setPixel = (canvas: CanvasRenderingContext2D, x, y, intencity: number) => {
      const pixel = (this.imprintPixel = this.imprintPixel || canvas.createImageData(1, 1));
      const pixelData = pixel.data;

      let totalIntencity = (intencity + 0.5) * 255 * 3;
      pixelData[0] = Math.max(Math.ceil((totalIntencity -= 255)), 0);
      pixelData[1] = Math.max(Math.ceil((totalIntencity -= 255)), 0);
      pixelData[2] = Math.max(Math.ceil((totalIntencity -= 255)), 0);
      pixelData[3] = 255;
      canvas.putImageData(pixel, x, y);
    };

    const pcm = getCanvasAndContext('pcm', true),
      fft = getCanvasAndContext('fft', true),
      imprint = getCanvasAndContext('imprint', false);

    pcm.ctx.beginPath();
    pcmData.forEach((value, index) =>
      pcm.ctx.lineTo((pcm.el.width / pcmData.length) * index, ((value + 1) / 2) * pcm.el.height)
    );
    pcm.ctx.stroke();

    if (this.imprintIndex <= 0) {
      this.imprintDirection = 1;
    } else if (this.imprintIndex >= imprint.el.width) {
      this.imprintDirection = -1;
    }
    this.imprintIndex += this.imprintDirection;
    if (imprint.el.height != fftData.length) {
      imprint.el.height = fftData.length;
    }

    const fftBarWidth = fft.el.width / fftData.length,
      fftTickStep = Math.floor(50 / fftBarWidth);

    fft.ctx.beginPath();
    fftData.forEach((value, index) => {
      const y = fft.el.height * (1 - value);
      fft.ctx.lineTo(fftBarWidth * index, y);
      if (!(index % fftTickStep)) {
        fft.ctx.strokeText(index.toString(), fftBarWidth * (index + 0.5), 10);
      }
      fft.ctx.lineTo(fftBarWidth * (index + 1), y);
      setPixel(imprint.ctx, this.imprintIndex, index, fftData[index] * 4);
    });
    fft.ctx.stroke();

    imprint.ctx.lineWidth = 2;
    imprint.ctx.beginPath();
    imprint.ctx.moveTo(this.imprintIndex + this.imprintDirection * (imprint.ctx.lineWidth + 1), 0);
    imprint.ctx.lineTo(
      this.imprintIndex + this.imprintDirection * (imprint.ctx.lineWidth + 1),
      imprint.el.height
    );
    imprint.ctx.stroke();

    for (let i = imprint.el.height * 0.95; i < imprint.el.height; ++i) {
      setPixel(imprint.ctx, this.imprintIndex, i, (speaker + 1) / 4);
    }
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
