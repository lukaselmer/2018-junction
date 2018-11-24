import { text } from "./conversation";

const firstSpeakerSentences: string[] = [];
const secondSpeakerSentences: string[] = [];

text.forEach((t, i) =>
  (i % 2 == 0 ? firstSpeakerSentences : secondSpeakerSentences).push(t)
);

const wordCountFirstSpeaker = countWordsOfSpeaker(firstSpeakerSentences);
const wordCountSecondSpeaker = countWordsOfSpeaker(secondSpeakerSentences);

const totalNumberOfWords = wordCountFirstSpeaker + wordCountSecondSpeaker;

const percentageFirstSpeaker = calculatePercentage(
  wordCountFirstSpeaker,
  totalNumberOfWords
);
const percentageSecondSpeaker = calculatePercentage(
  wordCountSecondSpeaker,
  totalNumberOfWords
);

function countWordsOfSpeaker(sentences: string[]) {
  return sentences.reduce((sum, sentence) => sum + wordCount(sentence), 0);
}

function wordCount(str: string) {
  return str.split(" ").length;
}

function calculatePercentage(
  wordCount: number,
  totalNumberOfWords: number
): number {
  return Math.round((wordCount / totalNumberOfWords) * 100);
}
