import decibels from 'decibels';
import fourierTransform from 'fourier-transform';
import { answer, printQuestion, question } from './universe';

const frequency = 440;
const size = 1024;
const sampleRate = 44100;
const waveform = new Float32Array(size);
for (let i = 0; i < size; i++) {
  waveform[i] = Math.sin(frequency * Math.PI * 2 * (i / sampleRate));
}

// get normalized magnitudes for frequencies from 0 to 22050 with interval 44100/1024 ≈ 43Hz
const spectrum = fourierTransform(waveform);

// convert to decibels
const dbs = spectrum.map(value => decibels.fromGain(value));
console.log(dbs);

console.log(question);
console.log(answer);

printQuestion();
