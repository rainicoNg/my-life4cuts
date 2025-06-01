const getGCD = (a: number, b: number): number =>
  b === 0 ? a : getGCD(b, a % b);

export const getAspectRatio = (width: number, height: number) => {
  const gcd = getGCD(width, height);
  return `${width / gcd}/${height / gcd}`;
};
