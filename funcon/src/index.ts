import { start } from './chart';
import {
  firstSpeakerLowConfidenceWords,
  firstSpeakerSwearWords,
  percentageFirstSpeaker,
  percentageSecondSpeaker,
  secondSpeakerLowConfidenceWords,
  secondSpeakerSwearWords
} from './text-analysis';

document.addEventListener('DOMContentLoaded', () => {
  console.log('start stuff...');
  start(
    percentageFirstSpeaker,
    percentageSecondSpeaker,
    secondSpeakerSwearWords,
    firstSpeakerLowConfidenceWords
  );
});
