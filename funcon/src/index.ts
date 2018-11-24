import { Transcript } from './transcript';

export function start() {
  document.addEventListener('DOMContentLoaded', () => {
    const transcript = new Transcript();
    transcript.start(speech => console.log(speech));
    appendStopButton(() => transcript.stop());
  });
}

function appendStopButton(onStop: () => void) {
  const stopButton = document.createElement('button');
  stopButton.innerText = 'Stop';
  stopButton.onclick = onStop;
  document.body.appendChild(stopButton);
}

start();
