
/**
 * @template T
 * @param {T[]} arr
 * @param {number} chunkSize
 * @returns {T[][]}
 */
export function chuckArray(chunkSize, arr) {
  const chunked = []

  for (let i = 0, j=arr.length; i < j; i+=chunkSize) {
    chunked.push(arr.slice(i, i+chunkSize))
  }

  return chunked
}