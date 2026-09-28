/** Integer paper counts on a zero-based axis with roughly four intervals. */
export function publicationYearScale(max: number) {
  const targetStep = Math.max(1, max / 4);
  const magnitude = 10 ** Math.floor(Math.log10(targetStep));
  const multiplier = [1, 2, 5, 10].find((value) => value * magnitude >= targetStep)!;
  const step = multiplier * magnitude;
  const ceiling = Math.max(step, Math.ceil(max / step) * step);

  return {
    ceiling,
    ticks: Array.from({ length: ceiling / step + 1 }, (_, index) => index * step),
  };
}
