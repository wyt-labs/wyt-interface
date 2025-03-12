export const ChainList = [
  {
    chainId: 1,
    chainName: 'Ethereum',
    chainSymbol: 'ETH',
    tName: 'ethereum',
    chainDecimal: 18,
    dexTokenApproveAddress: '0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f',
    chainIcon: 'https://static.coinall.ltd/cdn/wallet/logo/ETH-20220328.png',
  },
  {
    chainId: 137,
    chainName: 'Polygon',
    tName: 'polygon',
    chainSymbol: 'MATIC',
    chainDecimal: 18,
    dexTokenApproveAddress: '0x3B86917369B83a6892f553609F3c2F439C184e31',
    chainIcon: 'https://static.coinall.ltd/cdn/wallet/logo/MATIC-20220415.png',
  },
  {
    chainId: 56,
    chainName: 'BNB Chain',
    chainSymbol: 'BNB',
    tName: 'bnb',
    chainDecimal: 18,
    dexTokenApproveAddress: '0x2c34A2Fb1d0b4f55de51E1d0bDEfaDDce6b7cDD6',
    chainIcon: 'https://static.coinall.ltd/cdn/wallet/logo/BNB-20220308.png',
  },
  {
    chainId: 42161,
    chainName: 'Arbitrum One',
    chainSymbol: 'ARB',
    tName: 'arbitrum',
    chainDecimal: 18,
    dexTokenApproveAddress: '0x70cBb871E8f30Fc8Ce23609E9E0Ea87B6b222F58',
    chainIcon: 'https://static.coinall.ltd/cdn/wallet/logo/arb_9000.png',
  },
  {
    chainId: 10,
    chainName: 'Optimism',
    chainSymbol: 'OP',
    tName: 'optimism',
    chainDecimal: 18,
    dexTokenApproveAddress: '0x68D6B739D2020067D1e2F713b999dA97E4d54812',
    chainIcon: 'https://static.coinall.ltd/cdn/wallet/logo/op_10000.png',
  },
  {
    chainId: 501,
    chainName: 'Solana',
    tName: 'solana',
    chainSymbol: 'SOL',
    chainDecimal: 9,
    dexTokenApproveAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    chainIcon: 'https://static.okx.com/cdn/wallet/logo/solana.png',
  },
  {
    chainId: 43114,
    chainName: 'Avalanche C',
    tName: 'avalanche-c',
    chainSymbol: 'AVAX',
    chainDecimal: 18,
    dexTokenApproveAddress: '0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f',
    chainIcon: 'https://static.coinall.ltd/cdn/wallet/logo/AVAX.png',
  },
];

export const exchangeAddress = (text: string) => {
  return text ? `${text.slice(0, 6)}...${text.slice(-4)}` : '';
}

export const exchangeTrader = (text: string) =>
  text ? `${text.slice(0, 4)}...${text.slice(-4)}` : '';

export const getContractAddress = (type = '') => {
  if (type === 'tron')
    return exchangeAddress('TKJxzMnw1BDAqWtCGqYHieH695K6uZhP4a');
  if (type === 'bitcoin')
    return exchangeAddress(
      'bc1p8sfugkswhe0fmg0v7k4e7h7663rnwzl25c5lns99mxfk7kj9vjsse92g5v',
    );
  if (type === 'solana')
    return exchangeAddress('8QpnEUhuVPbcEXX1Ee35DvrUPHW5LnGSisw4dLF1KkQM');
  return exchangeAddress('0xbc509a0a87e34f74a992a11ad167c2e25394e36e');
};

export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString();

  const negative = display.startsWith('-');
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, '0');

  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, '');
  return `${negative ? '-' : ''}${integer || '0'}${
    fraction ? `.${fraction}` : ''
  }`;
}

export function parseUnits(value: string, decimals: number) {
  let [integer, fraction = '0'] = value.split('.');

  const negative = integer.startsWith('-');
  if (negative) integer = integer.slice(1);

  // trim trailing zeros.
  fraction = fraction.replace(/(0+)$/, '');

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1)
      integer = `${BigInt(integer) + 1n}`;
    fraction = '';
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals),
    ];

    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9)
      fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0');
    else fraction = `${left}${rounded}`;

    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }

    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, '0');
  }

  return BigInt(`${negative ? '-' : ''}${integer}${fraction}`);
}

export const formatNumberWithCommas = (number) => {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const changePrice = (num: string | number) => {
  const str = num ? String(num) : '0';
  const strList = str.split('.');
  if (Number(num) === 0 || Number.isNaN(Number(num))) return '0';
  if (Number(num) >= 1 || Number(num) <= -1) {
    if (strList.length > 1) {
      if (strList[1].length > 2) {
        return `${formatNumberWithCommas(strList[0])}.${strList[1].substring(0, 2)}`;
      }
      return `${formatNumberWithCommas(strList[0])}.${strList[1]}`;
    }
    return formatNumberWithCommas(str);
  }

  if (Number(num) < 0 && Number(num) > -1) {
    if (strList[1]?.length > 6) return `-0.${strList[1].substring(0, 6)}`;
    return `-0.${strList[1]}`;
  }

  if (strList[1]?.length > 6) return `0.${strList[1].substring(0, 6)}`;
  return `0.${strList[1]}`;
};

export const throttle = (fn, threshold = 20000) => {
  let last;
  let timer;

  // threshold || (threshold = 2000); // 默认设置为2秒

  return function (...args) {
    let context = this;
    const now = new Date();

    if (last && now - last < threshold) {
      // 如果距离上次执行的时间小于设定的阈值，则清除定时器并重设
      clearTimeout(timer);
      timer = setTimeout(
        function () {
          last = now;
          fn.apply(context, args);
        },
        threshold - (now - last),
      );
    } else {
      // 如果距离上次执行的时间大于等于设定的阈值，或者是第一次执行，直接执行函数
      last = now;
      fn.apply(context, args);
    }
  };
};
