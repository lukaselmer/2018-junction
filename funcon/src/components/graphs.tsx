import React from 'react';

import { start } from '../chart';
import {
  firstSpeakerLowConfidenceWords,
  percentageFirstSpeaker,
  percentageSecondSpeaker,
  secondSpeakerSwearWords
} from '../text-analysis';

export function Graphs() {
  start(
    percentageSecondSpeaker,
    percentageFirstSpeaker,
    secondSpeakerSwearWords,
    firstSpeakerLowConfidenceWords
  );

  return <h1 className='title'>Your Conversation Feedback</h1>;
}
