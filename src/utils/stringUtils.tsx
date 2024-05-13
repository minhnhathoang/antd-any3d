
export function truncated(bytes: any, length: number) {
  if (bytes.length <= length) {
    return bytes;
  }
  return bytes.substring(0, length) + '...';
}
