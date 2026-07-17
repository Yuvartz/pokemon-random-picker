/**
 * Lightens (amount > 0) or darkens (amount < 0) a #RRGGBB color.
 * amount is in the range -1..1.
 */
export function shadeColor(hex: string, amount: number): string {
  const match = hex.match(/^#([0-9a-f]{6})$/i);
  if (!match) return hex;
  const num = parseInt(match[1], 16);
  const shift = (channel: number) =>
    Math.max(
      0,
      Math.min(
        255,
        Math.round(
          amount >= 0
            ? channel + (255 - channel) * amount
            : channel * (1 + amount)
        )
      )
    );
  const r = shift((num >> 16) & 0xff);
  const g = shift((num >> 8) & 0xff);
  const b = shift(num & 0xff);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
