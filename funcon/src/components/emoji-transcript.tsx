import GraphemeSplitter from 'grapheme-splitter';
import { sortBy } from 'lodash';
import React from 'react';
import { findEmoji } from '../lib/emojis';
import { TranscriptMonitor } from '../transcript-monitor';
interface P {
  montior: TranscriptMonitor;
}

export function EmojiTranscript({ montior }: P) {
  const splitter = new GraphemeSplitter();

  const words = montior.conversation
    .map(s => s.transcript.split(' '))
    .reverse()
    .flat()
    .map(findEmoji)
    .filter(Boolean)
    .map(s => splitter.splitGraphemes(s))
    .flat();

  const wordCount = new Map<string, number>();
  words.forEach(word => wordCount.set(word, (wordCount.get(word) || 0) + 1));
  const favorites = [...wordCount.entries()].map(([word, count]) => ({ word, count }));
  const counts = sortBy([...new Set(favorites.map(({ count }) => count))]).reverse();

  return (
    <>
      <h2>Emoji Usage</h2>
      <div className='row'>
        <div className='col-sm'>
          <h2>Recent</h2>
          <div style={{ fontSize: '2em' }}>{words.join('')}</div>
        </div>
        <div className='col-sm'>
          <h2>Favorites</h2>
          <div style={{ fontSize: '4em' }}>
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
    </>
  );
}
