import { start } from './chart';
import { percentageFirstSpeaker, percentageSecondSpeaker } from './text-analysis';

document.addEventListener('DOMContentLoaded', () => {
  console.log('start stuff...');
  start(percentageFirstSpeaker, percentageSecondSpeaker);
});
