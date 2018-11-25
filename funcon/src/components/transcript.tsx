import emoji from 'node-emoji';
import React from 'react';
import { TranscriptMonitor } from '../transcript-monitor';

interface P {
  montior: TranscriptMonitor;
}

export function Transcript({ montior }: P) {
  return (
    <div className='transcript-text'>
      {[...montior.conversation].reverse().map((sentence, index) => (
        <div key={index}>
          [{sentence.speaker}]: {emojifyText(sentence.transcript)}
        </div>
      ))}
    </div>
  );
}

function emojifyText(text: string) {
  return text
    .split(' ')
    .map(s => {
      return emoji.hasEmoji(s.toLocaleLowerCase())
        ? `${emoji.find(s.toLocaleLowerCase()).emoji} (${s})`
        : s;
    })
    .join(' ');
}
