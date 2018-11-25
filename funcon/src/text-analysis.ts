import { sum } from 'lodash';
import { Speech } from './transcript-monitor';

export function calculateSpeakerStatistics(speeches: Speech[]) {
  const speakersMapping = { 0: 'Artem', 1: 'Marion' };
  const conversation = speeches.map(speech => ({
    transcript: speech.transcript,
    speaker: { id: speech.speaker, name: speakersMapping[speech.speaker] }
  }));
  const speakers = conversation.map(speech => speech.speaker);
  const speakerIds = [...new Set(conversation.map(speech => speech.speaker.id))];

  const groupedSpeakerStatistics = new Map<number, SpeakerStatistics>();
  speakerIds.forEach(speakerId =>
    groupedSpeakerStatistics.set(
      speakerId,
      calcSpeakerStatistics(
        speakers.find(speaker => speaker.id === speakerId) as Speaker,
        conversation
          .filter(({ speaker }) => speaker.id === speakerId)
          .map(({ transcript }) => transcript)
      )
    )
  );

  const totalNumberOfWords = sum([...groupedSpeakerStatistics.values()].map(val => val.numberOfWords));
  speakerIds.forEach(speakerId => {
    const stats = groupedSpeakerStatistics.get(speakerId);
    if (!stats) throw new Error('');
    stats.percentage = calculatePercentage(stats.numberOfWords, totalNumberOfWords);
  });

  return [...groupedSpeakerStatistics.values()];
}

function calculatePercentage(wordCount: number, totalNumberOfWords: number): number {
  return Math.round((wordCount / totalNumberOfWords) * 100);
}

function calcSpeakerStatistics(speaker: Speaker, sentences: string[]): SpeakerStatistics {
  const lowConfidenceWords = ['i feel', 'probably', 'maybe', 'i think', "i don't know"];
  const rudeWords = generateRudeWords();
  const parasiteWords = ['example', 'like', 'so', 'hmm'];

  const words = sentences.map(sentence => sentence.split(' ')).flat();
  const combinedSentences = sentences.join(' ').toLocaleLowerCase();
  return {
    speaker,
    sentences,
    words,
    numberOfWords: words.length,
    percentage: 0,
    rudeWords: calculateWordsFrequency(combinedSentences, rudeWords),
    lowConfidenceWords: calculateWordsFrequency(combinedSentences, lowConfidenceWords),
    parasiteWords: calculateWordsFrequency(combinedSentences, parasiteWords)
  };
}

function generateRudeWords() {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i)).map(
    char => `${char}***`
  );
}

function calculateWordsFrequency(sentence: string, words: string[]) {
  const resultMap = new Map<string, number>();
  words.forEach(word => {
    const count = countOccurrencesInSentence(word, sentence);
    if (count > 0) resultMap.set(word, count);
  });
  return resultMap;
}

function countOccurrencesInSentence(wordOrExpression: string, sentence: string): number {
  if (wordOrExpression.indexOf(' ') !== -1) return countWordInSentence(wordOrExpression, sentence);
  return countSpacedExpressionsInSentence(wordOrExpression, sentence);
}

function countWordInSentence(word: string, sentence: string): number {
  return sentence.split(' ').filter(sentenceWord => sentenceWord === word).length;
}

function countSpacedExpressionsInSentence(expression: string, sentence: string): number {
  let searchFrom = 0;
  let count = 0;
  while (true) {
    const pos = sentence.indexOf(expression, searchFrom);
    if (pos === -1) break;

    count++;
    searchFrom = pos + expression.length;
  }
  return count;
}

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
