import { Modal, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getSupportTokens, getTokens } from '@/services/chat';
import { ChainList } from '@/utils/chain';
import { LoadingOutlined } from '@ant-design/icons';
import './ChatDialog.less';

interface modalProps {
  visible: boolean;
  activeChain: string;
  activeToken: string;
  opChain: string;
  opToken: string;
  onCancel: () => void;
  onChange: (e) => void;
  setToken: (list) => void;
  setTokenLists: (list) => void;
}

const SelectChainModal = (props: modalProps) => {
  const {
    visible,
    activeChain,
    activeToken,
    opChain,
    opToken,
    onCancel,
    onChange,
    setTokenLists,
  } = props;
  const [activeC, setActiveChain] = useState('Ethereum');
  const [activeT, setActiveToken] = useState('Ethereum');
  const [tokenList, setTokenList] = useState([]);
  const [loading, setLoading] = useState(false);
  const chainItem = ChainList.filter((item) => item.chainName === activeC)[0];
  const [inputValue, setInputValue] = useState('');

  const handleTokens = async (
    chainId?: number,
    chainName: string,
    input?: string,
  ) => {
    try {
      setLoading(true);
      const allToken = await getTokens(chainId);
      let tokens = allToken;
      if (opToken && opChain !== chainName) {
        tokens = await getSupportTokens(chainId, allToken || []);
      }
      setTokenLists(allToken);
      const activeTokens =
        opChain && chainName === opChain && opToken
          ? tokens.filter((li) => li.tokenSymbol !== opToken)
          : tokens;
      if (input) {
        const newList = [...activeTokens].filter(
          (li) => li.tokenContractAddress.toLowerCase() === input.toLowerCase(),
        );
        setTokenList(newList);
      } else {
        setTokenList(activeTokens);
      }
    } catch (e) {
      setTokenLists([]);
      setTokenList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInitData = async () => {
    if (activeChain) {
      setActiveChain(activeChain);
      const chain = ChainList.filter(
        (item) => item.chainName === activeChain,
      )[0];
      await handleTokens(chain.chainId, chain.chainName);
    } else {
      await handleTokens(1, 'Ethereum');
    }

    if (activeToken) {
      setActiveToken(activeToken);
    }
  };

  useEffect(() => {
    if (visible) {
      handleInitData();
    }
  }, [visible]);

  const handleChangeToken = (item) => {
    onChange({
      token: item.tokenSymbol,
      chain: activeC,
      active_Item: { ...chainItem, ...item },
    });
    setInputValue('');
  };

  const handleChangeChain = async (item) => {
    await handleTokens(item.chainId, item.chainName, inputValue);
    setActiveChain(item.chainName);
  };

  const handleBlur = (e) => {
    if (e.target.value) {
      const newList = [...tokenList].filter(
        (li) =>
          li.tokenContractAddress.toLowerCase() ===
          e.target.value.toLowerCase(),
      );
      setTokenList(newList);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCancel = () => {
    setLoading(false);
    setInputValue('');
    onCancel();
  };

  return (
    <Modal
      open={visible}
      title="Select chain and token"
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      width={480}
      style={{ top: '70px' }}
      styles={{
        content: {
          borderRadius: 24,
          minHeight: 500,
          maxHeight: 664,
        },
      }}
    >
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ color: '#718096' }} spin />}
      >
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter token name or address"
          onBlur={handleBlur}
          onPressEnter={handleBlur}
          className="border-r-2 swap-input-box"
        />
        <div className="flex flex-wrap mt-4 gap-2 mb-4">
          {(ChainList || []).map((item) => (
            <div
              onClick={() => {
                handleChangeChain(item);
              }}
              className={`flex gap-1 ${item.chainName === activeC ? 'select-chain-item select-chain-item-active' : 'select-chain-item'}`}
            >
              {item.chainIcon ? <img src={item.chainIcon} alt="" /> : null}
              <div>{item.chainName}</div>
            </div>
          ))}
        </div>
        <div
          className="pt-4 token-list gap-1"
          style={{ maxHeight: 300, overflowY: 'scroll' }}
        >
          {tokenList?.length ? (
            tokenList.map((li) => (
              <div
                onClick={() => handleChangeToken(li)}
                className={`flex justify-between ${activeT === li.tokenSymbol ? 'token-list-item token-list-item-active' : 'token-list-item'}`}
                style={{ alignItems: 'center' }}
              >
                <div
                  className="flex justify-center gap-1"
                  style={{ alignItems: 'center' }}
                >
                  <div className="icon-list">
                    <img src={li.tokenLogoUrl} alt="" />
                    <img src={chainItem.chainIcon} alt="" />
                  </div>
                  <div>{li.tokenSymbol}</div>
                </div>
                <div>{li.tokenName}</div>
              </div>
            ))
          ) : (
            <div className="empty">No results found.</div>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default SelectChainModal;
