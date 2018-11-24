import { groupBy, sortBy } from 'lodash';
import emoji from 'node-emoji';
import React from 'react';
import { TranscriptMonitor } from '../transcript-monitor';

interface P {
  montior: TranscriptMonitor;
}

export function EmojiTranscript({ montior }: P) {
  const words = montior.conversation
    .map(s => s.split(' '))
    .reverse()
    .flat()
    .map(s => s.toLocaleLowerCase())
    .filter(emoji.hasEmoji)
    .map<any>(emoji.find)
    .map(pair => pair.emoji);

  const wordCount = new Map<string, number>();
  words.forEach(word => wordCount.set(word, (wordCount.get(word) || 0) + 1));
  const favorites = [...wordCount.entries()].map(([word, count]) => ({ word, count }));
  const counts = sortBy([...new Set(favorites.map(({ count }) => count))]).reverse();

  return (
    <div>
      <div>
        <h2>Recent Emojis</h2>
        <div>{words.join('')}</div>
      </div>
      <div>
        <h2>Favorite Emojis</h2>
        <div>
          {counts.map(count => (
            <div key={count}>
              <b>{count}</b>{' '}
              {favorites
                .filter(fav => fav.count === count)
                .map(({ word }) => word)
                .join('')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // {words.map((sentence, index) => (
  //   <div key={index}>{sentence}</div>
  // ))}
}
