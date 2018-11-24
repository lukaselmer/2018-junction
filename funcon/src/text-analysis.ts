import { sum } from 'lodash';
import { conversation } from '../conversation';

export interface Speaker {
  id: number;
  name: string;
}

export interface SpeakerStatistics {
  speaker: Speaker;
  sentences: string[];
  words: string[];
  numberOfWords: number;
  percentage: number;
  rudeWords: Map<string, number>;
  lowConfidenceWords: Map<string, number>;
  parasiteWords: Map<string, number>;
}

const lowConfidenceWords = ['i feel', 'probably', 'maybe', 'i think'];
const rudeWords = ['shit', 'fuck', 'ass'];
const parasiteWords = ['example', ' like ', ' so '];

function calcSpeakerStatistics(speaker: Speaker, sentences: string[]): SpeakerStatistics {
  const words = sentences.map(sentence => sentence.split(' ')).flat();
  return {
    speaker,
    sentences,
    words,
    numberOfWords: words.length,
    percentage: 0,
    rudeWords: calculateWordsFrequence(sentences, rudeWords),
    lowConfidenceWords: calculateWordsFrequence(sentences, lowConfidenceWords),
    parasiteWords: calculateWordsFrequence(sentences, parasiteWords)
  };
}

export const speakers = conversation.map(speech => speech.speaker);
export const speakerIds = [...new Set(conversation.map(speech => speech.speaker.id))];

export const groupedSpeakerStatistics = new Map<number, SpeakerStatistics>();
speakerIds.forEach(speakerId =>
  groupedSpeakerStatistics.set(
    speakerId,
    calcSpeakerStatistics(
      speakers.find(speaker => speaker.id === speakerId) as Speaker,
      conversation.filter(({ speaker }) => speaker.id === speakerId).map(({ text }) => text)
    )
  )
);

const totalNumberOfWords = sum([...groupedSpeakerStatistics.values()].map(val => val.numberOfWords));
speakerIds.forEach(speakerId => {
  const stats = groupedSpeakerStatistics.get(speakerId);
  if (!stats) throw new Error('');
  stats.percentage = calculatePercentage(stats.numberOfWords, totalNumberOfWords);
});

export const speakerStatistics = [...groupedSpeakerStatistics.values()];

function calculatePercentage(wordCount: number, totalNumberOfWords: number): number {
  return Math.round((wordCount / totalNumberOfWords) * 100);
}

function howManyWordAppeared(word: string, sentence: string): number {
  let count = 0;
  while (sentence.toLowerCase().indexOf(word) != -1) {
    count++;
    const pos = sentence.indexOf(word);
    sentence = sentence.substring(pos + word.length);
  }
  return count;
}

function calculateWordsFrequence(sentences: string[], words: string[]) {
  const resultMap = new Map<string, number>();
  words.forEach(word => {
    let count = 0;
    sentences.forEach(sencence => {
      count = count + howManyWordAppeared(word, sencence);
    });
    if (count > 0) {
      resultMap.set(word, count);
    }
  });
  return resultMap;
}
