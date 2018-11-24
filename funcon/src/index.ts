import { start } from './chart';
import {
  firstSpeakerSwearWords,
  percentageFirstSpeaker,
  percentageSecondSpeaker,
  secondSpeakerSwearWords
} from './text-analysis';

document.addEventListener('DOMContentLoaded', () => {
  console.log('start stuff...');
  start(percentageFirstSpeaker, percentageSecondSpeaker, secondSpeakerSwearWords);
});
