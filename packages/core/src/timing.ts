export const timeRanges: [string, number, number][] = [
  // default
  ['', 0, 100],
  // commons
  [' ', 0, 40],
  ['adefijklosu', 0, 50],
  ['bcghmnpqrtvwxyz', 5, 70],
  // uppercase
  ['adefijklosu'.toUpperCase(), 0, 50],
  ['bcghmnpqrtvwxyz'.toUpperCase(), 5, 70],
  // a bit far
  ['[];\',./-=', 10, 120],
  // need shift
  ['<>?:"{}|\\_+()*', 20, 140],
  // a bit far and shift
  ['!~`#$%^&', 20, 180],
]

export function randRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function getTimeout(char: string, multiplier = 1): number {
  const [, min, max] = timeRanges.find(range => range[0].includes(char)) || timeRanges[0]
  return randRange(min, max) * multiplier
}
