export const getSignMessage = (walletAddress: string, nonce: string) =>
  `Sign in to the WYT Network.\nWalletAddress: ${walletAddress}\nNonce: ${nonce}`;
