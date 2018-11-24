import React from 'react';
import { TranscriptMonitor } from '../transcript-monitor';

interface P {
  montior: TranscriptMonitor;
}

export function Transcript({ montior }: P) {
  return (
    <div>
      {[...montior.conversation].reverse().map((sentence, index) => (
        <div key={index}>{sentence}</div>
      ))}
    </div>
  );
}
