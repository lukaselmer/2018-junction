import nodeEmoji from 'node-emoji';
import emojis from './emoji.json';

const allEmojis = emojis.flatMap(emoji => [
  { emoji: emoji.emoji, keyword: emoji.description.toLocaleLowerCase() },
  ...emoji.aliases.map(alias => ({
    emoji: emoji.emoji,
    keyword: alias
      .toLocaleLowerCase()
      .split('_')
      .join(' ')
  }))
]);

const emojiLookup = new Map(allEmojis.map(({ keyword, emoji }) => [keyword, emoji] as [string, string]));

export function findEmoji(text: string): string {
  const convertedText = text.toLocaleLowerCase();

  if (nodeEmoji.hasEmoji(convertedText))
    return nodeEmoji.find(convertedText.toLocaleLowerCase()).emoji as string;

  const emoji = emojiLookup.get(convertedText);
  if (emoji) return emoji;

  if (text.endsWith('s')) {
    const multiEmoji = findEmoji(text.slice(0, text.length - 1));
    if (multiEmoji) return `${multiEmoji}${multiEmoji}${multiEmoji}${multiEmoji}${multiEmoji}`;
  }

  return '';
}
