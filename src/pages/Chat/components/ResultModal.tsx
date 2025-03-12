import { Modal, Tooltip } from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { CopyIcon, FailIcon, goOutIcon, SuccessIcon } from '@/components/Icon';
import './InputAddressModal.less';
import { changePrice, exchangeAddress, formatUnits } from '@/utils/chain';
import React, { useState } from 'react';
import dayjs from '@/utils/dayjs';
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';

const ResultModal: React.FC = (props: any) => {
  const {
    visible,
    onCancel,
    status = 0,
    from = {},
    to = {},
    txResult = {},
    hash = '',
    timer = 0,
    fee = '',
    unit = 1,
  } = props;
  const [copyTooltip, setCopyTooltip] = useState(false);
  const resultStatusList = [
    {
      background: '#F7FAFC',
      text: 'Progressing',
      icon: <LoadingOutlined style={{ fontSize: 64, color: '#718096' }} />,
      borderColor: '#E2E8F0',
    },
    {
      background: '#F7FAFC',
      text: 'Transaction success',
      icon: (
        <Icon component={SuccessIcon} style={{ fontSize: 64, width: 64 }} />
      ),
      borderColor: '#E2E8F0',
    },
    {
      background: 'rgba(252, 129, 129, 0.09)',
      text: 'Transaction failed',
      icon: <Icon component={FailIcon} style={{ fontSize: 64, width: 64 }} />,
      borderColor: 'rgba(252, 129, 129, 0.50)',
    },
  ];

  const getSameChainFee = () => {
    if (fee) {
      return (formatUnits(BigInt(fee), from.chainDecimal) * unit);
    }

    return 0;
  };

  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      destroyOnClose
      visible={visible}
      footer={null}
      styles={{ header: { marginBottom: 16 } }}
      width="450px"
      className="select-modal"
      onCancel={() => onCancel()}
      title="Transaction result"
      closable={status !== 0}
    >
      <div
        className="result-modal"
        style={{
          borderColor: resultStatusList[status].borderColor,
          background: resultStatusList[status].background,
          paddingTop: status === 1 ? 40 : 56,
        }}
      >
        <div className="text-center">{resultStatusList[status].icon}</div>
        <div
          className="text-center mt-5 pb-5 text-lg font-bold"
          style={{ paddingBottom: status === 1 ? 20 : 46 }}
        >
          {resultStatusList[status].text}
        </div>
        {status === 1 ? (
          <div className="pt-2" style={{ borderTop: '1px solid #E2E8F0' }}>
            <div className="flex gap-2 align-item-center">
              <div>From</div>
              <img width={16} height={16} src={from.tokenLogoUrl} alt="" />
              <span>{exchangeAddress(txResult?.tx?.from)}</span>
              <Tooltip title={copyTooltip ? 'Copied' : 'Copy'}>
                <CopyToClipboard
                  onCopy={() => {
                    setCopyTooltip(true);
                    setTimeout(() => {
                      setCopyTooltip(false);
                    }, 1000);
                  }}
                  text={txResult?.tx?.from || ''}
                >
                  <Icon
                    className="base-icon"
                    style={{ width: 16, height: 16 }}
                    component={CopyIcon}
                  />
                </CopyToClipboard>
              </Tooltip>
            </div>
            <div className="flex gap-2 chain-list align-item-center">
              <img width={24} height={24} src={from?.chainIcon} alt="" />
              <span className="bold-text">
                - {txResult?.routerResult?.fromTokenUIAmount}
              </span>
              <span>{txResult?.routerResult?.fromToken?.tokenSymbol}</span>
            </div>
            <div className="flex gap-2 align-item-center">
              <div>To</div>
              <img width={16} height={16} src={to?.chainIcon} alt="" />
              <span>{exchangeAddress(txResult?.tx?.from)}</span>
              <Tooltip title={copyTooltip ? 'Copied' : 'Copy'}>
                <CopyToClipboard
                  onCopy={() => {
                    setCopyTooltip(true);
                    setTimeout(() => {
                      setCopyTooltip(false);
                    }, 1000);
                  }}
                  text={txResult?.tx?.from || ''}
                >
                  <Icon
                    className="base-icon"
                    style={{ width: 16, height: 16 }}
                    component={CopyIcon}
                  />
                </CopyToClipboard>
              </Tooltip>
            </div>
            <div
              className="flex gap-2 chain-list align-item-center"
              style={{ marginBottom: 0 }}
            >
              <img width={24} height={24} src={to.tokenLogoUrl} alt="" />
              <span className="bold-text" style={{ color: '#38A169' }}>
                + {txResult?.routerResult?.toTokenUIAmount}
              </span>
              <span>{txResult?.routerResult?.toToken?.tokenSymbol}</span>
            </div>
          </div>
        ) : null}
      </div>

      {status === 1 ? (
        <div>
          <div
            className="text-xs result-chain-box"
            style={{ alignItems: 'center' }}
          >
            <div className="flex text-xs justify-between">
              <div style={{ color: '#4b5563' }}>Transaction Fee</div>
              <div className="light-c">
                ${changePrice(getSameChainFee())}
              </div>
            </div>
            <div className="flex mt-2 text-xs justify-between">
              <div style={{ color: '#4b5563' }}>Date</div>
              <div className="light-c">{dayjs(timer).format('llll')}</div>
            </div>
            <div className="flex mt-2 text-xs justify-between">
              <div style={{ color: '#4b5563' }}>Transaction Hash</div>
              <a
                className="a-link flex align-item-center gap-1"
                target="_blank"
                href={`https://solscan.io/tx/${hash}`}
              >
                <span>{exchangeAddress(hash)}</span>
                <Icon component={goOutIcon} />
              </a>
            </div>
          </div>
        </div>
      ) : null}
      {status ? (
        <div
          className="text-center confirm-button bg-gray-600 text-white font-normal rounded-2xl cursor-pointer"
          onClick={onCancel}
          style={{
            marginTop: 16,
            height: 48,
            color: '#fff',
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          I get it
        </div>
      ) : null}
    </Modal>
  );
};

export default ResultModal;
