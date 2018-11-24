import { text } from '.././conversation';

const firstSpeakerSentences: string[] = [];
const secondSpeakerSentences: string[] = [];

const unconfidentWords = ['i feel', 'probably', 'maybe', 'i think'];
const rudeWords = [' shit', 'fuck', 'ass'];
const parasiteWords = ['example', ' like ', ' so '];

text.forEach((t, i) => (i % 2 == 0 ? firstSpeakerSentences : secondSpeakerSentences).push(t));

const wordCountFirstSpeaker = countWordsOfSpeaker(firstSpeakerSentences);
const wordCountSecondSpeaker = countWordsOfSpeaker(secondSpeakerSentences);

const totalNumberOfWords = wordCountFirstSpeaker + wordCountSecondSpeaker;

export const percentageFirstSpeaker = calculatePercentage(wordCountFirstSpeaker, totalNumberOfWords);
export const percentageSecondSpeaker = calculatePercentage(wordCountSecondSpeaker, totalNumberOfWords);

export const firstSpeakerSwearWords = calculateWordsFrequence(firstSpeakerSentences, rudeWords);
export const secondSpeakerSwearWords = calculateWordsFrequence(secondSpeakerSentences, rudeWords);

export const firstSpeakerLowConfidenceWords = calculateWordsFrequence(
  firstSpeakerSentences,
  unconfidentWords
);
export const secondSpeakerLowConfidenceWords = calculateWordsFrequence(
  secondSpeakerSentences,
  unconfidentWords
);

function countWordsOfSpeaker(sentences: string[]) {
  return sentences.reduce((sum, sentence) => sum + wordCount(sentence), 0);
}

function wordCount(str: string) {
  return str.split(' ').length;
}

function calculatePercentage(wordCount: number, totalNumberOfWords: number): number {
  return Math.round((wordCount / totalNumberOfWords) * 100);
}

// Returns how many times word appeared
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
  const resultMap = new Map();
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
