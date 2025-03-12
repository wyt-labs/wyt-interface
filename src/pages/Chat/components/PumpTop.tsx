import React, { useEffect, useState } from 'react';
import { Segmented, Input, Tooltip, List, Skeleton } from 'antd';
import Icon, { CheckOutlined } from '@ant-design/icons';
import './ChatDialog.less';
import { changePrice, exchangeTrader } from '@/utils/chain';
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyIcon, UpIcon, DownIcon } from '@/components/Icon';
import { getTopTraders } from '@/services/chat';
import Empty from '@/components/Empty';
const loadingList = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

const PumpTop = (props: {
  initList: any[];
  isActive: boolean;
  onClick: (data) => void;
}) => {
  const { initList, isActive, onClick } = props;
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [copyItem, setCopyItem] = useState<any>({});
  const [activeType, setActiveType] = useState('');
  const [activeAction, setActiveAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<any>('100');
  const [dur, setDur] = useState(7);
  const [list, setList] = useState([]);
  const [z, setZone] = useState('CST');

  const hanldeInitList = async (duration, rate) => {
    if (!isActive) return;
    try {
      setLoading(true);
      const zone = new Date().getTimezoneOffset() / 60;
      const zoneString = zone === -8 ? 'CST' : 'UTC';
      const res = await getTopTraders({
        duration, // int
        timezone: zoneString, // string: CST, UTC
        max_win_rate: rate / 100, // float
      });
      if (res) {
        setZone(zoneString);
        setList(res.rows);
      } else {
        setList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   hanldeInitList(1,1)
  // }, []);

  useEffect(() => {
    if (initList.length) {
      setList(initList);
    }
  }, [initList.length]);

  const handleUpClick = (type: string) => {
    if (activeType === type && activeAction === 'down') {
      // 从小到大排列
      setActiveAction(`up`);
      setActiveType(type);
      // if(activeAction ==== 'up')
      const newList = [...list].sort((a: any, b: any) => a[type] - b[type]);
      setList(newList);
    } else {
      setActiveAction(`down`);
      setActiveType(type);
      // 从大到小排列
      const newList = [...list].sort((a: any, b: any) => b[type] - a[type]);
      setList(newList);
    }
  };

  const getFilter = (type: string) => (
    <>
      <div style={{ height: 10, lineHeight: '10px', marginTop: 10 }}>
        <Icon
          component={UpIcon}
          className={
            activeType === type && activeAction === 'up' ? 'active-icon' : ''
          }
        />
      </div>
      <div style={{ height: 10, lineHeight: '10px' }}>
        <Icon
          component={DownIcon}
          className={
            activeType === type && activeAction === 'down' ? 'active-icon' : ''
          }
        />
      </div>
    </>
  );

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    if (value) {
      const reValue = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
      setInputValue(Number(reValue) > 100 ? 100 : reValue);
    } else {
      setInputValue('');
    }
  };

  const handleChange = (value) => {
    if (value === '7D') {
      setDur(7);
      hanldeInitList(7, inputValue);
    } else {
      setDur(30);
      hanldeInitList(30, inputValue);
    }
  };

  const handleEnter = (e: any) => {
    const { value } = e.target;
    hanldeInitList(dur, value);
  };

  return (
    <div className="swap-box" style={{ padding: 20 }}>
      <div className="text-sm font-bold">Top 10 Traders on Pump.fun ({z})</div>
      <div className="flex justify-between align-item-center my-5">
        <Segmented
          disabled={!isActive}
          className="chart-segment"
          options={['7D', '1M']}
          onChange={handleChange}
        />
        <div className="flex gap-4 align-item-center">
          <div style={{ width: 140, color: '#8D8D8D' }}>Max win rate (%)</div>
          <Input
            disabled={!isActive}
            rootClassName="chat-input"
            addonAfter={
              <div
                className="chat-addon"
                onClick={() => hanldeInitList(dur, inputValue)}
              >
                <CheckOutlined />
              </div>
            }
            value={inputValue}
            maxLength={5}
            style={{ width: 200 }}
            onChange={handleInputChange}
            onPressEnter={handleEnter}
          />
        </div>
      </div>
      <div className="flex table-header gap-4">
        <div style={{ width: 32, textAlign: 'center' }}>#</div>
        <div className="flex-1">Trader</div>
        <div className="flex-1 flex  gap-2">
          <div>Total profit</div>
          {/*<div*/}
          {/*  onClick={() => handleUpClick('total_net_profit')}*/}
          {/*  className="base-icon"*/}
          {/*>*/}
          {/*  {getFilter('total_net_profit')}*/}
          {/*</div>*/}
        </div>
        <div className="flex-1 flex gap-2">
          <div>Win rate</div>
          {/*<div*/}
          {/*  onClick={() => handleUpClick('net_profit_win_ratio')}*/}
          {/*  className="base-icon"*/}
          {/*>*/}
          {/*  {getFilter('net_profit_win_ratio')}*/}
          {/*</div>*/}
        </div>
        <div className="flex-1 flex gap-2">
          <div>Transactions</div>
          {/*<div*/}
          {/*  onClick={() => handleUpClick('total_tx_count')}*/}
          {/*  className="base-icon"*/}
          {/*>*/}
          {/*  {getFilter('total_tx_count')}*/}
          {/*</div>*/}
        </div>
      </div>
      <List
        dataSource={loading ? loadingList : list}
        locale={{ emptyText: <Empty /> }}
        renderItem={(item: any, index: number) => (
          <List.Item
            className={
              index < 3
                ? `list-item-${index + 1}`
                : (index + 1) % 2 === 1
                  ? 'list-item-s'
                  : 'list-item'
            }
            style={{
              padding: '8px 12px',
              marginBottom: 4,
              height: 48,
              boxSizing: 'border-box',
              gap: 12,
            }}
          >
            <div style={{ width: 32 }}>
              <div className="item-title">{index + 1}</div>
            </div>
            <div className="flex flex-1 align-item-center">
              {loading ? (
                <div>
                  <Skeleton.Input
                    size="small"
                    active
                    style={{ width: 120, height: 20 }}
                  />
                </div>
              ) : (
                <>
                  <div
                    className="item-trader"
                    onClick={() => onClick(item.trader)}
                  >
                    {exchangeTrader(item.trader)}
                  </div>
                  <Tooltip
                    title={
                      copyTooltip && copyItem?.key === item?.key
                        ? 'Copied'
                        : 'Copy'
                    }
                  >
                    <CopyToClipboard
                      onCopy={() => {
                        setCopyTooltip(true);
                        setCopyItem(item);
                        setTimeout(() => {
                          setCopyTooltip(false);
                        }, 1000);
                      }}
                      text={item.trader}
                    >
                      <Icon
                        className="base-icon"
                        style={{ width: 16, height: 16, marginLeft: 8 }}
                        component={CopyIcon}
                      />
                    </CopyToClipboard>
                  </Tooltip>
                </>
              )}
            </div>
            <div className="flex-1">
              {loading ? (
                <Skeleton.Input
                  size="small"
                  active
                  style={{ minWidth: 90, height: 20, width: 90 }}
                />
              ) : (
                <div className="text-sm item-total">
                  {changePrice(item.total_net_profit)} SOL
                </div>
              )}
            </div>
            <div className="flex-1">
              {loading ? (
                <Skeleton.Input
                  size="small"
                  active
                  style={{ minWidth: 65, height: 20, width: 65 }}
                />
              ) : (
                <div className="text-sm item-rate">
                  {changePrice(item.net_profit_win_ratio * 100)} %
                </div>
              )}
            </div>
            <div className="flex-1">
              {loading ? (
                <Skeleton.Input
                  size="small"
                  active
                  style={{ minWidth: 90, height: 20, width: 90 }}
                />
              ) : (
                <div className="text-sm item-total" style={{ fontWeight: 600 }}>
                  {changePrice(item.total_tx_count)}
                </div>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PumpTop;
