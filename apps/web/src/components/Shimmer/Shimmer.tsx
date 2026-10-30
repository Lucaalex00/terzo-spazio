/**
 * Text crossed by a beam of chakra light every few seconds.
 *
 * The text stays plain white; an overlay band — soft-edged by a static mask —
 * slides across it while its tinted copy of the text slides the opposite way,
 * so the copy stays aligned with the letters. Both are transform animations,
 * handled by the compositor: no repaint per frame.
 *
 * The tinted copy comes from `content: attr(data-text)` on a pseudo-element,
 * so the text is not duplicated in the DOM (screen readers and search engines
 * read it once).
 */
export function Shimmer({ text }: { text: string }) {
  return (
    <span className="shimmer">
      {text}
      <span aria-hidden className="shimmer-band" data-text={text} />
    </span>
  );
}
