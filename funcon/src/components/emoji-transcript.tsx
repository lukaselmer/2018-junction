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
    .map(s => s.transcript)
    .reverse()
    .map(s => s.split(' '))
    .flat()
    .map(s => s.split('?'))
    .flat()
    .map(s => s.split('!'))
    .flat()
    .map(s => s.split(','))
    .flat()
    .map(s => s.split(';'))
    .flat()
    .map(s => s.split('.'))
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
      <div className='col-sm'>
        <h3>Recent Emojis</h3>
        <div style={{ fontSize: '2.5em' }}>{words.join('')}</div>
      </div>
      <div className='col-sm'>
        <h3>Favorite Emojis</h3>
        <div style={{ fontSize: '2.5em' }}>
          {counts.map(count => (
            <span key={count}>
              <b>{count}</b>{' '}
              {favorites
                .filter(fav => fav.count === count)
                .map(({ word }) => word)
                .join(' ')}
              {' | '}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
