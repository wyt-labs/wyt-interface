export const exchangeUnit = (num: number, fixNum = 3) => {
  if (num >= 100000000000) {
    return `${(num / 100000000000) % 1 === 0 ? num / 100000000000 : (num / 100000000000).toFixed(fixNum)} T`;
  } else if (num >= 100000000) {
    return `${(num / 100000000) % 1 === 0 ? num / 100000000 : (num / 100000000).toFixed(fixNum)} B`;
  } else if (num >= 1000000000) {
    return `${(num / 1000000) % 1 === 0 ? num / 1000000 : (num / 1000000).toFixed(fixNum)} M`;
  } else if (num >= 1000) {
    return `${(num / 1000) % 1 === 0 ? num / 1000 : (num / 1000).toFixed(fixNum)} K`;
  }

  return num;
};

export const chartBgColorArray = [
  'rgba(236, 253, 245)',
  'rgba(238, 242, 255)',
  'rgba(255, 247, 237)',
  'rgba(245, 243, 255)',
  'rgba(255, 251, 235)',
  'rgba(253, 242, 248)',
  'rgba(254, 242, 242)',
  'rgba(239, 246, 255)',
  'rgba(249, 250, 251)',
];

export const chartColorArray = [
  'rgba(16, 185, 129)',
  'rgba(99, 102, 241)',
  'rgba(249, 115, 22)',
  'rgba(139, 92, 246)',
  'rgba(245, 158, 11)',
  'rgba(236, 72, 153)',
  'rgba(239, 68, 68)',
  'rgba(59, 130, 246)',
];

export const profitDistributionColorList = [
  { name: '< -100%', color: '#9B2C2C' },
  { name: '-100% ~ -50%', color: '#E53E3E' },
  { name: '-50% ~ -25%', color: '#FC8181' },
  { name: '-25% ~ 0%', color: '#FED7D7' },
  { name: '0% ~ 25%', color: '#BEE3F8' },
  { name: '25% ~ 50%', color: '#63B3ED' },
  { name: '50% ~ 100%', color: '#B2F5EA' },
  { name: '100% ~ 200%', color: '#4FD1C5' },
  { name: '200% ~ 300%', color: '#319795' },
  { name: '300% ~ 400%', color: '#C6F6D5' },
  { name: '400% ~ 500%', color: '#68D391' },
  { name: '> 500%', color: '#38A169' },
];
