import { SpeakerDetector } from './speaker_detector';
import { Transcript } from './transcript';

export function start() {
  document.addEventListener('DOMContentLoaded', () => {
    const transcript = new Transcript();
    transcript.start(speech => console.log(speech));
    const speakerDetector = new SpeakerDetector();
    speakerDetector.start(() => {});

    appendStopButton(() => {
      transcript.stop();
      speakerDetector.stop();
    });
  });
}

function appendStopButton(onStop: () => void) {
  const stopButton = document.createElement('button');
  stopButton.innerText = 'Stop';
  stopButton.onclick = onStop;
  document.body.appendChild(stopButton);
}

start();
