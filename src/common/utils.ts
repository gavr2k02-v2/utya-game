export const loadFont = async (name: string, url: string) => {
  const newFont = new FontFace(name, `url(${url})`);

  try {
    const loaded = await newFont.load();
    document.fonts.add(loaded);
  } catch (e) {
    return e;
  }
};

export const formatTime = (seconds: number) => {
  const withLeadingZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  if (!min) {
    return `${withLeadingZero(sec)}`;
  }

  return `${withLeadingZero(min)}:${withLeadingZero(sec)}`;
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
