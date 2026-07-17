/**
 * Splits long speech text into short sentence-based chunks.
 *
 * Mobile/desktop browsers (notably Chrome) silently cut off
 * SpeechSynthesis utterances that run longer than ~15 seconds.
 * Speaking short chunks back-to-back avoids the bug entirely.
 */
export function splitSpeechText(text: string, maxLen = 160): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    if (current && current.length + sentence.length + 1 > maxLen) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current);

  return chunks.length > 0 ? chunks : [text];
}
