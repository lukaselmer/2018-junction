import fourierTransform from "fourier-transform";
import decibels from 'decibels';
import { question, answer } from './universe';

var frequency = 440;
var size = 1024;
var sampleRate = 44100;
var waveform = new Float32Array(size);
for (var i = 0; i < size; i++) {
    waveform[i] = Math.sin(frequency * Math.PI * 2 * (i / sampleRate));
}

//get normalized magnitudes for frequencies from 0 to 22050 with interval 44100/1024 ≈ 43Hz
var spectrum = fourierTransform(waveform);

//convert to decibels
var dbs = spectrum.map((value) => decibels.fromGain(value))
console.log(dbs);

console.log(question)
console.log(answer)
