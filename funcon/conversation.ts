import { cloneDeep } from 'lodash';
import { Speech } from './src/transcript-monitor';

const conversation = [
  {
    transcript:
      'I’m thinking about maybe going to the Junction hackathon on the weekend. Would you maybe like to come with me?',
    speaker: 0
  },
  {
    transcript:
      'What? Are you crazy? That idea sounds like s***! Complete b******* Why would I spend my weekend with a bunch of nerds that code in the dark for two days? This is ridiculous!',
    speaker: 1
  },
  { transcript: 'Oh, I think I could learn a lot from others.', speaker: 0 },
  {
    transcript:
      'What the f***! If you want to learn, read a book, do a codelab or do a course. Do you really think you learn something there? You do whatever you want but I will for sure not spend my weekend time to code for free!',
    speaker: 1
  },
  {
    transcript: 'Well, I think some people not only do things for money.',
    speaker: 0
  },
  {
    transcript:
      'Speak for yourself! If you want to spend your time for nothing and then end up f****** exhausted … . People go f****** crazy at these events. They fall asleep on desks.',
    speaker: 1
  },
  {
    transcript:
      'Did your monkey eat all your bananas and pears today, and ship them to us by train or airplane?',
    speaker: 0
  },
  {
    transcript:
      'They did! And all the stars are falling from the sky, until there is no star left. Not okey!',
    speaker: 1
  },
  {
    transcript: 'And oh...! There are a lot fireworks and sparkles, and the cow went home to Finland.',
    speaker: 1
  },
  {
    transcript: 'Now your just blubbering garbage... Anything else you want to say?',
    speaker: 0
  },
  {
    transcript: 'Yes! Finland, Finland, Finland, Finland, Finland, laughings',
    speaker: 0
  }
];

export function defaultTranscript(): Speech[] {
  return cloneDeep(conversation);
}

export function initialTranscript(): Speech[] {
  return defaultTranscript();
}
