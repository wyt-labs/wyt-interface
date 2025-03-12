export function getHashIndex(key: string, size: number): number {
  let hashValue = 0;
  for (let i = 0; i < key.length; i++) {
    hashValue += key.charCodeAt(i);
  }
  return hashValue % size;
}

export function showBriefAmount(amount: number): string {
  if (amount / 1000000000 > 1) {
    return (amount / 1000000000).toFixed(2) + ' B';
  }
  if (amount / 1000000 > 0.1) {
    return (amount / 1000000).toFixed(2) + ' M';
  }
  if (amount / 1000 > 1) {
    return (amount / 1000).toFixed(2) + ' K';
  }
  return amount + '';
}

export function toThousands(num: number): string {
  if ((num || 0).toFixed(0) !== num.toString()) {
    return num.toString();
  }
  const numStr = (num || 0).toString().split('');
  let counter = 0;
  const result: string[] = [];
  for (let i = numStr.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(numStr[i]);
    if (!(counter % 3) && i != 0) {
      result.unshift(',');
    }
  }
  return result.join('');
}
