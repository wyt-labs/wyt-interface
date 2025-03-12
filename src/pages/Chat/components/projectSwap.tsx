import { Input, Spin, Tooltip, message, Switch, Alert } from 'antd';
import downIcon from '@/assets/down.png';
import { abi } from '@/utils/contract';
import React, { useEffect, useState } from 'react';
import SelectChainModal from './selectChainModal';
import InputAddressModal from './InputAddressModal';
import { AlertIcon } from '@/components/Icon';
import './ChatDialog.less';
import {
  ChainList,
  parseUnits,
  formatUnits,
  changePrice,
  exchangeAddress,
  // throttle
} from '@/utils/chain';
import {
  getTokens,
  getCrossChain,
  getQuote,
  getSwap,
  getCurrentPrice,
} from '@/services/chat';
import { ReactComponent as Arrow } from '@/assets/svg/chat/step_arrow.svg';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useAddresses, useWallet, useSession } from 'web3-connect-react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import bs58 from 'bs58';
import ResultModal from '@/pages/Chat/components/ResultModal';

// const ProjectSwap = (props: { info: projectCompareProps }) => {
let t: any;
const ProjectSwap = (props) => {
  const { info, isActive } = props;
  const [fromChain, setFromChain] = useState('');
  const [activeFromToken, setActiveFromToken] = useState('');
  const [activeToChain, setActiveToChain] = useState('');
  const [activeToToken, setActiveToToken] = useState('');
  const [fromVisible, setFromVisible] = useState(false);
  const [toVisible, setToVisible] = useState(false);
  const [fromItem, setFromItem] = useState({});
  const [toItem, setToItem] = useState({});
  const [fromInput, setFromInput] = useState(undefined);
  const [txItem, setTxItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [fromTokenList, setFromTokenList] = useState([]);
  const [toTokenList, setToTokenList] = useState([]);
  const { sdk, isSignedIn } = useWallet();
  // const { addresses } = useAddresses('ethereum');
  const { walletAddresses, walletAddress } = useSession();
  const solanaAddresses = (walletAddresses || [])
    .filter((p) => p.chain === 'solana')
    .map((li) => li.walletAddress);
  const addresses = (walletAddresses || [])
    .filter((p) => p.chain === 'ethereum')
    .map((li) => li.walletAddress);
  const { addresses: Addr } = useAddresses('ethereum');
  const [filterAddress, setFilterAddress] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [msg, setMsg] = useState('');
  const [balance, setBalance] = useState<number | string>('0');
  const [resultStatus, setResultStatus] = useState(0);
  const [resultOpen, setResultOpen] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapItem, setSwapItem] = useState({});
  const [timer, setTimer] = useState(0);
  const [hash, setHash] = useState('');
  const [fee, setFee] = useState(0);
  const [currentUnit, setCurrentUnit] = useState(1);
  const provider = window.solana;
  const connection = new Connection(
    'https://rapidities-ignobleness-lzasmdnalw-dedicated.helius-rpc.com?api-key=d57e523a-d5f1-4b2d-839d-e537f676db7a',
  );

  const handleUnit = async (data: string) => {
    const res = await getCurrentPrice(data);
    setCurrentUnit(res?.price);
  };

  const handleInputData = (val: string) => {
    setFilterAddress(val);
    setShowInput(false);
  };
  const handleTxChange = async (params, decimals) => {
    try {
      setTxItem({});
      const res = await getQuote(params);
      setMsg('');
      setTxItem(res[0] || {});
    } catch (e) {
      if (e.message) {
        const digitsRegex = /\d+/g;
        const letters = e.message.match(digitsRegex) || [];
        if (letters.length) {
          const parseValue = parseUnits(letters[0], 0);
          const formatValue = formatUnits(parseValue, decimals);
          const replacedStr = e.message.replace(letters[0], formatValue);
          setMsg(replacedStr);
          // message.info(replacedStr);
        } else {
          setMsg(e.message);
        }
      }
    }
  };

  // getCrossChain

  const handleCrossChain = async (params, decimals) => {
    try {
      setTxItem({});
      const res = await getCrossChain(params);
      setMsg('');
      setTxItem(res[0] || {});
    } catch (e) {
      if (e.message) {
        const digitsRegex = /\d+/g;
        const letters = e.message.match(digitsRegex) || [];
        if (letters.length) {
          const parseValue = parseUnits(letters[0], 0);
          const formatValue = formatUnits(parseValue, decimals);
          const replacedStr = e.message.replace(letters[0], formatValue);
          setMsg(replacedStr);
          // message.info(replacedStr);
        } else {
          setMsg(e.message);
        }
      }
    }
  };

  const handleTx = async (value, from, to) => {
    try {
      setTxLoading(true);
      if (from.chainId === to.chainId) {
        const params = {
          chainId: from.chainId,
          fromTokenAddress: from.tokenContractAddress,
          toTokenAddress: to.tokenContractAddress,
          amount: value,
          slippage: 0.05,
        };
        await handleTxChange(params, from.decimals);
        await handleUnit(from.chainSymbol);
      } else {
        const params = {
          fromChainId: from.chainId,
          toChainId: to.chainId,
          fromTokenAddress: from.tokenContractAddress,
          toTokenAddress: to.tokenContractAddress,
          amount: value,
          slippage: 0.05,
        };
        await handleCrossChain(params, from.decimals);
        await handleUnit(from.chainSymbol);
      }
    } finally {
      setTxLoading(false);
    }
  };

  const getPrice = async (token) => {
    const activeItem = token?.active_Item || token || [];
    try {
      if (activeItem.tName === 'solana') {
        if (solanaAddresses?.length) {
          const ownerAddress = new PublicKey(solanaAddresses[0]); // 代币拥有者地址
          if (activeItem.tokenSymbol === 'SOL') {
            // AqwtzPZxUmM6KoDCm5ceC7kje4DB2bLPRjKVJ8njCjKx
            // const balanceRes = await sdk.getBalance(activeItem.tName);
            // setBalance(formatUnits(balanceRes[0], activeItem.decimals));

            const publicKey = new PublicKey(solanaAddresses[0]);
            const balanceInLamports = await connection.getBalance(publicKey);
            setBalance((balanceInLamports || 0) / LAMPORTS_PER_SOL);
          } else {
            const mintAddress = new PublicKey(activeItem.tokenContractAddress); // 代币的铸造地址
            const publicKey = getAssociatedTokenAddressSync(
              mintAddress,
              ownerAddress,
            );

            const result = await sdk.request({
              method: 'getTokenAccountBalance',
              params: [publicKey.toBase58()],
              chain: 'solana',
            });
            setBalance(result.value.uiAmount);
          }
        }
      } else {
        const balanceRes = await sdk.callContractMethod({
          contractAddress: activeItem.tokenContractAddress,
          abi,
          method: 'balanceOf',
          params: addresses,
          chain: activeItem.tName,
        });
        setBalance(balanceRes);
      }
    } catch (e) {
      console.log('balanceE', e);
    }
  };

  const handleInfo = async () => {
    const {
      source_chain,
      swap_in_token,
      dest_chain,
      swap_out_token,
      amount_in,
    } = info;
    if (amount_in) {
      setFromInput(amount_in.toString());
    }
    setLoading(true);
    try {
      let fromData: any;
      let toData: any;
      const filterSourceChain = ChainList.filter(
        (li) => li.chainName.toLowerCase() === source_chain?.toLowerCase(),
      );
      if (filterSourceChain.length) {
        setFromChain(filterSourceChain[0].chainName);

        const tokens = await getTokens(filterSourceChain[0].chainId);
        const filerToken = (tokens || []).filter(
          (li) => li.tokenSymbol.toLowerCase() === swap_in_token?.toLowerCase(),
        );
        setFromTokenList(tokens);
        if (filerToken.length) {
          setActiveFromToken(filerToken[0].tokenSymbol);
          fromData = { ...filterSourceChain[0], ...filerToken[0] };
          setFromItem({ ...filterSourceChain[0], ...filerToken[0] });
        }
        await getPrice(fromData);
      }

      const filterToChain = (ChainList || []).filter(
        (li) => li.chainName.toLowerCase() === dest_chain?.toLowerCase(),
      );

      if (filterToChain.length) {
        setActiveToChain(filterToChain[0].chainName);
        setFilterAddress('');
        setIsCheck(false);
        setShowInput(false);

        const tokens = await getTokens(filterToChain[0].chainId);
        const filerToToken = (tokens || []).filter(
          (li) => li.tokenSymbol.toLowerCase() === swap_out_token.toLowerCase(),
        );
        setToTokenList(tokens);
        if (filerToToken.length) {
          setActiveToToken(filerToToken[0].tokenSymbol);
          toData = { ...filterToChain[0], ...filerToToken[0] };
          setToItem({ ...filterToChain[0], ...filerToToken[0] });
        }
      }

      if (
        source_chain &&
        swap_in_token &&
        dest_chain &&
        swap_out_token &&
        amount_in &&
        fromData &&
        toData
      ) {
        await handleTx(amount_in.toString(), fromData, toData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDefaultInfo = async () => {
    const { source_chain, dest_chain, amount_in } = info;
    if (amount_in) {
      setFromInput(amount_in.toString());
    }
    const filterSourceChain = ChainList.filter(
      (li) => li.chainName.toLowerCase() === source_chain?.toLowerCase(),
    );
    if (filterSourceChain.length) {
      setFromChain(filterSourceChain[0].chainName);
      setFromItem({ ...filterSourceChain[0] });
    }

    const filterToChain = ChainList.filter(
      (li) => li.chainName.toLowerCase() === dest_chain?.toLowerCase(),
    );

    if (filterToChain.length) {
      setActiveToChain(filterToChain[0].chainName);
      setFilterAddress('');
      setIsCheck(false);
      setShowInput(false);
      setToItem({ ...filterToChain[0] });
    }
  };

  useEffect(() => {
    if (isActive) {
      handleInfo();
    } else {
      handleDefaultInfo();
    }
  }, [isActive, addresses?.length, solanaAddresses?.length]);

  const handleFromChange = (item) => {
    if (item.chain === fromChain && item.token === activeFromToken) {
      setFromVisible(false);
      return;
    }
    setFromChain(item.chain);
    setActiveFromToken(item.token);
    setFromItem(item.active_Item);
    getPrice(item);
    if (toItem.chainId && fromInput) {
      handleTx(fromInput, item.active_Item, toItem);
    }
    setFromVisible(false);
  };

  const handleToChange = (item) => {
    if (item.chain === activeToChain && item.token === activeToToken) {
      setToVisible(false);
      return;
    }
    setActiveToChain(item.chain);
    setActiveToToken(item.token);
    setToItem(item.active_Item);
    setFilterAddress('');
    setIsCheck(false);
    setShowInput(false);
    if (fromItem.chainId && fromInput) {
      handleTx(fromInput, fromItem, item.active_Item);
    }
    setToVisible(false);
  };

  const handleFrom = () => {
    if (isActive) {
      setFromVisible(true);
    }
  };

  const handleTo = () => {
    if (isActive) {
      setToVisible(true);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (/^[0-9,.]*$/.test(value)) {
      if (value && Number(value)) {
        setFromInput(e.target.value);
        handleTx(value, fromItem, toItem);
      } else {
        setTxItem({});
        setFromInput(undefined);
      }
    }
  };
  const getChainList = (from, to, tx) => {
    if (from.chainId === to.chainId) {
      return (
        <div className="flex" style={{ alignItems: 'center' }}>
          <div>
            <div className="flex" style={{ alignItems: 'center' }}>
              <div className="icon-list">
                <img width={32} height={32} src={from?.tokenLogoUrl} alt="" />
                <img src={from.chainIcon} alt="" />
              </div>
              <Arrow className="ml-2 mr-2" />
              <div className="icon-list">
                <img width={32} height={32} src={to?.tokenLogoUrl} alt="" />
                <img src={to.chainIcon} alt="" />
              </div>
            </div>
            <div
              className="text-xs"
              style={{ fontWeight: 500, textAlign: 'center' }}
            >
              <span>Orca Whirlpools - 100%</span>
            </div>
          </div>
        </div>
      );
    }

    const route = tx?.routerList?.length ? tx?.routerList[0] : {};
    let fromDex: any;
    let toDex: any;
    let fromIcon: any;
    let toIcon: any;
    if (route.fromDexRouterList?.length) {
      const routerList =
        route.fromDexRouterList[route.fromDexRouterList.length - 1]
          .subRouterList;
      fromDex = routerList[routerList.length - 1];

      const filterData = [...fromTokenList, ...toTokenList].filter(
        (li) =>
          li.tokenSymbol.toLowerCase() ===
          fromDex.toToken.tokenSymbol.toLowerCase(),
      );
      fromIcon = filterData[0]?.tokenLogoUrl || '';
    }

    if (route.toDexRouterList?.length) {
      const routerList =
        route.toDexRouterList[route.toDexRouterList.length - 1].subRouterList;
      toDex = routerList[routerList.length - 1];
      const filterData = [...fromTokenList, ...toTokenList].filter(
        (li) =>
          li.tokenSymbol.toLowerCase() ===
          toDex.fromToken.tokenSymbol.toLowerCase(),
      );
      toIcon = filterData[0]?.tokenLogoUrl || '';
    }

    return (
      <div>
        <div className="flex" style={{ alignItems: 'center' }}>
          <div>
            <div
              className="flex"
              style={{
                alignItems: 'center',
                width: fromDex && toDex ? 140 : '',
              }}
            >
              <div className="icon-list">
                <img width={32} height={32} src={from?.tokenLogoUrl} alt="" />
                <img src={from.chainIcon} alt="" />
              </div>
              {fromDex ? (
                <>
                  <Arrow className="ml-2 mr-2" />
                  <div className="icon-list">
                    <img width={32} height={32} src={fromIcon} alt="" />
                    <img src={from.chainIcon} alt="" />
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div
            className="text-xs flex justify-center"
            style={{ margin: '0 auto', width: fromDex && toDex ? 100 : '' }}
          >
            <Arrow />
          </div>
          <div>
            <div
              className="flex"
              style={{
                alignItems: 'center',
                width: fromDex && toDex ? 140 : '',
              }}
            >
              {toDex ? (
                <>
                  <div className="icon-list">
                    <img width={32} height={32} src={toIcon} alt="" />
                    <img src={to.chainIcon} alt="" />
                  </div>
                  <Arrow className="ml-2 mr-2" />
                </>
              ) : null}
              <div className="icon-list">
                <img width={32} height={32} src={to?.tokenLogoUrl} alt="" />
                <img src={to.chainIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex" style={{ fontWeight: 500, textAlign: 'center' }}>
          {fromDex ? (
            <div
              className="text-xs toop-box pl-1 pr-1"
              style={{ width: fromDex && toDex ? 140 : '' }}
            >
              <Tooltip
                title={
                  fromDex.dexProtocol[fromDex.dexProtocol.length - 1].dexName
                    ?.length > 12
                    ? fromDex.dexProtocol[fromDex.dexProtocol.length - 1]
                        .dexName + ' - 100% '
                    : ''
                }
              >
                <span>
                  {fromDex.dexProtocol[fromDex.dexProtocol.length - 1].dexName}
                </span>
                <span> - 100%</span>
              </Tooltip>
            </div>
          ) : null}
          <div className="text-xs toop-box pl-1 pr-1" style={{ width: 100 }}>
            <Tooltip
              placement="top"
              title={
                route?.router?.bridgeName?.length > 8
                  ? route.router.bridgeName + ' - 100% '
                  : ''
              }
            >
              <span>{route?.router?.bridgeName}</span>
              <span> - 100%</span>
            </Tooltip>
          </div>
          {toDex ? (
            <div
              className="text-xs toop-box pl-1 pr-1"
              style={{ width: fromDex && toDex ? 140 : '' }}
            >
              <Tooltip
                title={
                  toDex.dexProtocol[toDex.dexProtocol.length - 1].dexName
                    ?.length > 12
                    ? toDex.dexProtocol[toDex.dexProtocol.length - 1].dexName +
                      ' - 100% '
                    : ''
                }
              >
                <span>
                  {toDex.dexProtocol[toDex.dexProtocol.length - 1].dexName}
                </span>
                <span> - 100%</span>
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const getTotal = (type: string, objArray: any[]) => {
    let sum = 0n;
    (objArray || []).forEach((cur) => {
      sum += BigInt(cur[type]);
    });
    return formatUnits(sum, 0);
  };

  const getBridge = (objArray: any[]) => {
    return objArray
      .reduce((acc, cur) => acc + Number(cur.router.crossChainFee), 0)
      .toString();
  };

  const getGasUsd = (tx) => {
    if (tx) {
      const fromFee = getTotal('fromChainNetworkFee', tx.routerList);
      const toFee = getTotal('toChainNetworkFee', tx.routerList);
      const filterFromList = ChainList.filter(
        (li) => li.chainId === Number(tx.fromChainId),
      );
      const filterToList = ChainList.filter(
        (li) => li.chainId === Number(tx.toChainId),
      );
      const total =
        formatUnits(parseUnits(fromFee, 0), filterFromList[0].chainDecimal) *
          tx.fromTokenUnitPrice +
        formatUnits(parseUnits(toFee, 0), filterToList[0].chainDecimal) *
          (tx.toTokenUnitPrice || 1);
      return total;
    }
    return 0;
  };

  const getGas = (tx) => {
    const data = getGasUsd(tx);
    return data / currentUnit;
  };

  const getSameChainFee = (item: any) => {
    if (item?.estimateGasFee) {
      return (
        item.estimateGasFeeUI / 1 + item?.quoteCompareList[0]?.tradeFee / 1
      );
    }

    return 0;
  };

  // 美元计价
  const getFeeTotalUsd = (txItem: any) => {
    const chainFee = getGas(txItem);
    const bridgeFee = getBridge(txItem.routerList);
    return chainFee + bridgeFee / 1;
  };

  // 原始代币
  const getFeeTotal = (txItem: any) => {
    const data = getFeeTotalUsd(txItem);
    // console.log()
    return data / currentUnit;
  };

  const setTimeGetResult = (txId) => {
    t = setTimeout(async () => {
      const data = await connection.getParsedTransaction(txId, {
        maxSupportedTransactionVersion: 0,
      });
      console.log('res620', data);
      if (data && data?.blockTime) {
        setTimer(data?.blockTime * 1000);
        setFee(data?.meta?.fee);
        setHash(txId);
        setResultStatus(1);
        clearTimeout(timer);
        setSwapLoading(false);
        t = null;
      } else {
        setTimeGetResult(txId);
      }
    }, 3000);
  };

  const signTransaction = async (callData) => {
    if (!window.okxwallet.starknet.isConnected) {
      await window.okxwallet.starknet.enable();
    }
    if (!provider) {
      console.error(
        'No Solana provider found. Please install OKX Wallet or a Solana-compatible wallet.',
      );
    } else {
      const transaction = bs58.decode(callData);

      let tx: any;
      try {
        tx = Transaction.from(transaction);
      } catch (error) {
        tx = VersionedTransaction.deserialize(transaction);
      }
      const recentBlockHash = await connection.getLatestBlockhash();

      if (tx instanceof VersionedTransaction) {
        tx.message.recentBlockhash = recentBlockHash.blockhash;
      } else {
        tx.recentBlockhash = recentBlockHash.blockhash;
      }

      try {
        const signedTransaction = await provider.signTransaction(tx);
        const txId = await connection.sendRawTransaction(
          signedTransaction.serialize(),
        );
        setResultOpen(true);
        setResultStatus(0);
        // await connection.confirmTransaction(txId);
        const data = await connection.getParsedTransaction(txId, {
          maxSupportedTransactionVersion: 0,
        });
        console.log('transactionDetails', data);
        if (data && data?.blockTime) {
          setTimer(data?.blockTime * 1000);
          setFee(data?.meta?.fee);
          setHash(txId);
          setResultStatus(1);
          setSwapLoading(false);
        } else {
          await setTimeGetResult(txId);
        }
      } catch (e) {
        console.log('e', e);
        setResultStatus(2);
        setSwapLoading(false);
      }
    }
  };

  const handleClickSwap = async () => {
    if (!isSignedIn) return;
    if (!sdk) return;
    if (!sdk.provider) return;
    if (!solanaAddresses?.length) return;
    if (swapLoading) return;
    if (!Number(balance) || Number(balance) < Number(fromInput) || msg) return;
    if (Addr?.length && walletAddress?.toLowerCase() !== Addr[0]) return;
    try {
      setSwapLoading(true);
      const res = await getSwap({
        chainId: fromItem.chainId,
        amount: fromInput,
        fromTokenAddress: fromItem.tokenContractAddress,
        toTokenAddress: toItem.tokenContractAddress,
        slippage: 0.05,
        userWalletAddress: solanaAddresses[0],
        // swapReceiverAddress: filterAddress || solanaAddresses[0],
      });
      if (res[0]?.tx?.data) {
        setSwapItem(res[0]);
        await signTransaction(res[0]?.tx?.data);
      }
    } catch (e) {
      setSwapLoading(false);
    }
  };

  const handleSwitchChange = (e: any) => {
    setShowInput(e);
    setIsCheck(e);
    if (!e) {
      setFilterAddress('');
    }
  };

  const getFromPrice = (tx) => {
    const unit = tx?.fromTokenUnitPrice || tx?.fromToken?.tokenUnitPrice || 0;
    return changePrice(tx?.fromTokenUIAmount * unit);
  };

  const getToPriceUsd = (tx) => {
    const unit = tx?.toTokenUnitPrice || tx?.toToken?.tokenUnitPrice || 0;
    // const traderFee = tx?.quoteCompareList?.length ? tx?.quoteCompareList[0]?.tradeFee : 0;
    // return traderFee ? changePrice((tx?.toTokenUIAmount  - tx?.estimateGasFeeUI) * unit - traderFee) : changePrice(tx?.toTokenUIAmount * unit);

    return changePrice(tx?.toTokenUIAmount * unit);
  };

  return (
    <Spin
      spinning={loading || txLoading}
      indicator={<LoadingOutlined style={{ color: '#718096' }} spin />}
    >
      <div className="swap-box">
        <div className="flex text-xs light-c justify-between align-item-center">
          <div className="flex gap-2 align-item-center">
            <div>From</div>
            <div className="flex address-box gap-2">
              {fromItem.tokenLogoUrl ? (
                fromChain === 'Solana' ? (
                  solanaAddresses?.length ? (
                    <>
                      <img
                        width={16}
                        height={16}
                        src={fromItem.chainIcon}
                        alt=""
                      />
                      {exchangeAddress(solanaAddresses[0])}
                    </>
                  ) : (
                    'not supported'
                  )
                ) : (
                  <>
                    <img
                      width={16}
                      height={16}
                      src={fromItem.chainIcon}
                      alt=""
                    />
                    {addresses?.length ? exchangeAddress(addresses[0]) : null}
                  </>
                )
              ) : (
                'not selected'
              )}
            </div>
          </div>
          <div>Balance: {changePrice(balance)}</div>
        </div>
        <div className="flex justify-between chain-box align-item-center">
          {isActive ? (
            <div>
              <Input
                className="from-input"
                disabled={!fromChain || !activeToChain}
                placeholder="0.0"
                value={fromInput}
                onChange={handleInputChange}
              />
              {fromInput ? (
                <div className="text-xs light-c">${getFromPrice(txItem)}</div>
              ) : null}
            </div>
          ) : fromChain ? (
            <div>
              <div className={`font-bold light-w-c`}>{fromInput}</div>
              <div className="text-xs light-c">
                {txItem?.fromTokenUIAmount ? '' : '$' + getFromPrice(txItem)}
              </div>
            </div>
          ) : (
            <div className="light-w-c" style={{ fontWeight: 700 }}>
              0.0
            </div>
          )}
          <div
            className={`flex justify-between gap-3 chain-detail-box ${isActive ? '' : 'chain-detail-box-disabled'}`}
            style={{
              alignItems: 'center',
              cursor: isActive ? 'pointer' : 'default',
            }}
            onClick={handleFrom}
          >
            <div>
              {fromChain ? (
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <div className="icon-list">
                    <img
                      width={32}
                      height={32}
                      src={fromItem.tokenLogoUrl}
                      alt=""
                    />
                    <img src={fromItem?.chainIcon} alt="" />
                  </div>
                  <div>
                    <div className={isActive ? '' : 'light-w-c'}>
                      {fromItem.tokenSymbol}
                    </div>
                    <div className="light-c text-xs">{fromItem.chainName}</div>
                  </div>
                </div>
              ) : (
                <div
                  className="text-gray-700 light-w-c"
                  style={{ fontWeight: 500 }}
                >
                  Select a token
                </div>
              )}
            </div>
            {isActive ? <img width="12" src={downIcon} alt="" /> : null}
          </div>
        </div>

        <div
          className="flex text-xs gap-2 light-c mt-5"
          style={{ alignItems: 'center' }}
        >
          <div>To</div>
          {filterAddress ? null : (
            <div className="flex address-box gap-2">
              {toItem?.tokenLogoUrl ? (
                activeToChain === 'Solana' ? (
                  solanaAddresses?.length ? (
                    <>
                      <img
                        width={16}
                        height={16}
                        src={toItem.chainIcon}
                        alt=""
                      />
                      {exchangeAddress(solanaAddresses[0])}
                    </>
                  ) : (
                    'not supported'
                  )
                ) : (
                  <>
                    <img width={16} height={16} src={toItem.chainIcon} alt="" />
                    {addresses?.length ? exchangeAddress(addresses[0]) : ''}
                  </>
                )
              ) : (
                'not selected'
              )}
            </div>
          )}
        </div>
        <div
          className="flex justify-between chain-box"
          style={{ alignItems: 'center' }}
        >
          {fromChain && activeToChain && fromInput ? (
            <div>
              <div className={`font-bold light-w-c`}>
                {changePrice(txItem?.toTokenUIAmount)}
              </div>
              <div className="text-xs light-c">${getToPriceUsd(txItem)}</div>
            </div>
          ) : (
            <div className="light-w-c" style={{ fontWeight: 700 }}>
              0.0
            </div>
          )}
          <div
            className={`flex justify-between gap-3 chain-detail-box ${isActive ? '' : 'chain-detail-box-disabled'}`}
            style={{
              alignItems: 'center',
              cursor: isActive ? 'pointer' : 'default',
            }}
            onClick={handleTo}
          >
            <div>
              {activeToChain ? (
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <div className="icon-list">
                    <img
                      width={32}
                      height={32}
                      src={toItem.tokenLogoUrl}
                      alt=""
                    />
                    <img src={toItem?.chainIcon} alt="" />
                  </div>
                  <div>
                    <div className={isActive ? '' : 'light-w-c'}>
                      {toItem.tokenSymbol}
                    </div>
                    <div className="light-c text-xs">{toItem.chainName}</div>
                  </div>
                </div>
              ) : (
                <div
                  className="text-gray-700 light-w-c"
                  style={{ fontWeight: 500 }}
                >
                  Select a token
                </div>
              )}
            </div>
            {isActive ? <img width="12" src={downIcon} alt="" /> : null}
          </div>
        </div>

        {isActive && fromItem?.chainId !== toItem?.chainId ? (
          <div
            className="flex align-item-center gap-3 text-sm mt-2.5"
            style={{ color: '#4B5563' }}
          >
            <Switch
              onChange={handleSwitchChange}
              checked={isCheck}
              size="small"
            />
            {!filterAddress ? (
              <span>Transfer to another address</span>
            ) : (
              <span>
                Transfer to{' '}
                <span className="a-link" onClick={handleSwitchChange}>
                  {filterAddress}
                </span>
              </span>
            )}
          </div>
        ) : null}

        {fromItem.chainId &&
        toItem.chainId &&
        fromInput &&
        JSON.stringify(txItem) !== '{}' ? (
          <div>
            <div className="text-xs gap-2 light-c mt-5">
              <div>Path</div>
            </div>

            <div
              className="flex justify-center chain-box"
              style={{ alignItems: 'center', padding: '25px 0' }}
            >
              <div>{getChainList(fromItem, toItem, txItem)}</div>
            </div>
            <div className="text-xs gap-2 light-c mt-5">
              <div>Estimated Fee</div>
            </div>

            <div className="text-xs chain-box" style={{ alignItems: 'center' }}>
              <div className="flex text-xs justify-between">
                <div
                  className="flex align-item-center gap-1"
                  style={{ color: '#4b5563' }}
                >
                  <span>Esitimated Fee</span>
                  <Tooltip
                    overlayClassName="swap-tooltip"
                    title={
                      <div className="text-xs">
                        <div>The fee for this transaction is made up of:</div>
                        <div>
                           · {fromItem?.chainName} network fee:
                          {fromItem.chainId === toItem.chainId
                            ? `$${changePrice(getSameChainFee(txItem))}`
                            : `$${changePrice(getGasUsd(txItem))}`}{' '}
                          (
                          {fromItem.chainId === toItem.chainId
                            ? changePrice(getSameChainFee(txItem) / currentUnit)
                            : changePrice(getGas(txItem))}
                          {fromItem.chainSymbol})
                        </div>
                        {fromItem.chainId !== toItem.chainId ? (
                          <div>
                             · Bridgers network fee:{' '}
                            {txItem?.routerList?.length
                              ? `$${changePrice(getBridge(txItem.routerList))}`
                              : `$ 0`}{' '}
                            (
                            {changePrice(
                              getBridge(txItem.routerList) / currentUnit,
                            )}{' '}
                            {fromItem.chainSymbol})
                          </div>
                        ) : null}
                      </div>
                    }
                  >
                    <Icon component={AlertIcon} />
                  </Tooltip>
                </div>
                <div className="light-c">
                  <span>
                    {fromItem.chainId === toItem.chainId
                      ? `$${changePrice(getSameChainFee(txItem))}`
                      : `$${changePrice(getFeeTotalUsd(txItem))}`}
                  </span>
                  (
                  {fromItem.chainId === toItem.chainId
                    ? changePrice(getSameChainFee(txItem) / currentUnit)
                    : changePrice(getFeeTotal(txItem))}
                  {fromItem.chainSymbol})
                </div>
              </div>
              <div className="flex mt-2 text-xs justify-between">
                <div style={{ color: '#4b5563' }}>Slippage</div>
                <div className="light-c">
                  <span className="slippage">auto</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isActive && fromItem?.chainId && toItem?.chainId ? (
          <div className="mt-5">
            {Addr?.length && walletAddress?.toLowerCase() !== Addr[0] ? (
              <Alert
                className="alert-msg"
                message="Please switch to this account in your OKX wallet"
                type="warning"
                showIcon
              />
            ) : !solanaAddresses?.length ? (
              <Alert
                className="alert-msg"
                message="The wallet you are connected to does not support the network."
                type="warning"
                showIcon
              />
            ) : msg ? (
              <Alert
                className="alert-msg"
                message={msg}
                type="warning"
                showIcon
              />
            ) : !Number(balance) || Number(balance) < Number(fromInput) ? (
              <Alert
                className="alert-msg"
                message={`Insufficient balance of ${fromItem?.tokenSymbol}.`}
                type="warning"
                showIcon
              />
            ) : null}
          </div>
        ) : null}
        {fromItem?.chainName === 'Solana' && toItem?.chainName === 'Solana' ? (
          <div
            onClick={handleClickSwap}
            className={`text-center ${!Number(balance) || Number(balance) < Number(fromInput) || msg || (Addr?.length && walletAddress?.toLowerCase() !== Addr[0]) ? 'swap-button-disabled bg-gray-400' : 'swap-button bg-gray-600'} mt-5 text-white font-normal text-sm rounded-2xl`}
            style={{
              cursor:
                !Number(balance) ||
                Number(balance) < Number(fromInput) ||
                msg ||
                (Addr?.length && walletAddress?.toLowerCase() !== Addr[0])
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            <span>Swap</span>
            {swapLoading ? (
              <LoadingOutlined style={{ marginLeft: 12 }} spin />
            ) : null}
          </div>
        ) : (
          <div
            className={`h-11 text-center bg-gray-400 mt-5 text-white pt-3 font-normal text-sm rounded-2xl cursor-not-allowed`}
          >
            {!fromItem.chainId || !toItem?.chainId
              ? 'Swap'
              : 'Network not supported now'}
          </div>
        )}

        {/*<div className="flex">*/}
        {/*</div>*/}

        <InputAddressModal
          address={filterAddress}
          activeChain={activeToChain}
          visible={showInput}
          onCancel={() => {
            setShowInput(false);
            setIsCheck(false);
          }}
          onOk={handleInputData}
        />
        <SelectChainModal
          visible={fromVisible}
          activeChain={fromChain}
          activeToken={activeFromToken}
          onCancel={() => setFromVisible(false)}
          onChange={handleFromChange}
          opChain={activeToChain}
          opToken={activeToToken}
          setTokenLists={setFromTokenList}
        />
        <SelectChainModal
          visible={toVisible}
          activeChain={activeToChain}
          activeToken={activeToToken}
          onCancel={() => setToVisible(false)}
          onChange={handleToChange}
          opChain={fromChain}
          opToken={activeFromToken}
          setTokenLists={setToTokenList}
        />
        <ResultModal
          visible={resultOpen}
          status={resultStatus}
          from={fromItem}
          to={toItem}
          fee={fee}
          hash={hash}
          timer={timer}
          txResult={swapItem}
          unit={currentUnit}
          onCancel={() => setResultOpen(false)}
        />
      </div>
    </Spin>
  );
};

export default ProjectSwap;
