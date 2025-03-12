import React, { useEffect, useState } from 'react';
import { AvatarImage } from '@/components/Avatar/Avatar';
import { changePrice, exchangeTrader } from '@/utils/chain';
import Icon from '@ant-design/icons';
import { CopyIcon, SearchIcon, RefreshIcon } from '@/components/Icon';
import { Tooltip, Popover, Input } from 'antd';
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  chartBgColorArray,
  chartColorArray,
  profitDistributionColorList,
} from '@/utils/chart';
import './ChatDialog.less';
import Statistic from '@/components/Statistic';
import ProfitChart from '@/components/Charts/ProfitChart';
import ProfitDistributionChart from '@/components/Charts/ProfitDistributionChart';
import TradeCountChart from '@/components/Charts/TradeCountChart';
import {
  getTraderInfo,
  getTraderOverview,
  getTraderProfit,
  getTraderProfitDistribution,
  getTraderList,
} from '@/services/chat';
import dayjs from '@/utils/dayjs';

interface OverviewProps {
  avg_fee_per_token: number | string;
  avg_sol_cost_per_token: number | string;
  avg_tip_per_token: number | string;
  net_profit_win_ratio: number | string;
  profit_ratio: number | string;
  token_create_count: number | string;
  total_cost: number | string;
  total_net_profit: number | string;
  traded_token_count: number | string;
}
const PumpTopDetail = (props: { initObj: any; isActive: boolean }) => {
  const { initObj, isActive } = props;
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overView, setOverView] = useState<any | OverviewProps>({});
  const [info, setInfo] = useState<any>(null);
  const [tags, setTags] = useState([]);
  const [activeTags, setActiveTag] = useState([]);
  const [profitList, setProfitList] = useState([]);
  const [profitDistributionList, setProfiDistributiontList] = useState([]);
  const [traderList, setTraderList] = useState([]);
  const [sInfo, setSearchInfo] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [z, setZone] = useState('CST');
  const zone = new Date().getTimezoneOffset() / 60;
  const zoneString = zone === -8 ? 'CST' : 'UTC';
  // const [searchValue, setSearchValue] = useState('');

  const initOverview = async (addr: string) => {
    const res = await getTraderOverview({ address: addr });
    if (res?.info) {
      setOverView(res.info);
      return res.info;
    }
    setOverView({});
    return {};
  };

  const initTraderProfit = async (addr: string) => {
    const res = await getTraderProfit({
      address: addr,
      duration: 7, // int
      timezone: zoneString, // string: CST, UTC
    });
    if (res?.rows) {
      setZone(zoneString);
      const mapData = (res.rows || []).map((item) => ({
        ...item,
        xAxisTime: dayjs(new Date(item.date).getTime()).format('ll'),
        tooltipTime: dayjs(new Date(item.date).getTime()).format('lll'),
      }));
      setProfitList(mapData);
    } else {
      setProfitList([]);
    }
  };

  const initTraderProfitDistribution = async (allData: any, addr: string) => {
    const res = await getTraderProfitDistribution({
      address: addr,
      duration: 7, // int
      timezone: zoneString, // string: CST, UTC
    });
    if (res?.rows) {
      // profitDistributionColorList
      const total = (res.rows || []).reduce(
        (accumulator, currentValue) => accumulator + currentValue.token_count,
        0,
      );
      const mapList = (res?.rows || []).map((li) => {
        const filterList = profitDistributionColorList.filter(
          (item) => item.name === li.profit_margin_bucket,
        );
        return {
          name: li.profit_margin_bucket,
          value: li.token_count,
          percentage: changePrice(li.token_count / (total || 1)),
          color: filterList[0]?.color || '#fff',
        };
      });
      setProfiDistributiontList(mapList);
    } else {
      setProfiDistributiontList([]);
    }
  };

  // getTraderList

  const initTraderList = async (addr: string) => {
    const res = await getTraderList({
      address: addr,
      duration: 7, // int
      timezone: zoneString, // string: CST, UTC
    });
    if (res?.rows) {
      const mapData = (res?.rows || []).map((item) => {
        const timer = item.time_range.substring(7, item.time_range.length - 1);
        return {
          ...item,
          timer,
        };
      });
      setTraderList(mapData);
    } else {
      setTraderList([]);
    }
  };

  const initInfo = async (addr: string) => {
    try {
      setLoading(true);
      const res = await getTraderInfo({ address: addr });
      if (res) {
        setInfo(res.info);
        if (res.info.tag) {
          setTags(res.info.tag);
          setActiveTag(
            res.info.tag.length > 3
              ? [...res.info.tag].splice(0, 3)
              : res.info.tag,
          );
        } else {
          setTags([]);
          setActiveTag([]);
        }
        const allData = await initOverview(addr);
        await initTraderProfit(addr);
        await initTraderProfitDistribution(allData, addr);
        await initTraderList(addr);
      } else {
        setInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchInfo = async (value) => {
    if (value) {
      try {
        setSearchLoading(true);
        const res = await getTraderInfo({ address: value });
        setSearchOpen(true);
        if (res) {
          setSearchInfo(res.info);
        } else {
          setSearchInfo(null);
        }
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleInit = () => {
    setInfo(initObj.trader);
    setOverView(initObj.overview || {});
    const mapData = (initObj.profit || []).map((item) => ({
      ...item,
      xAxisTime: dayjs(new Date(item.date).getTime()).format('ll'),
      tooltipTime: dayjs(new Date(item.date).getTime()).format('lll'),
    }));
    setProfitList(mapData);

    const distributiontList = (initObj.profit_distribution || []).map((li) => {
      const filterList = profitDistributionColorList.filter(
        (item) => item.name === li.profit_margin_bucket,
      );
      const total = (initObj.profit_distribution || []).reduce(
        (accumulator, currentValue) => accumulator + currentValue.token_count,
        0,
      );
      return {
        name: li.profit_margin_bucket,
        value: li.token_count,
        percentage: changePrice(li.token_count / (total || 1)),
        color: filterList[0]?.color || '#fff',
      };
    });
    setProfiDistributiontList(distributiontList);

    const trades = (initObj.trades || []).map((item) => {
      const timer = item.time_range.substring(7, item.time_range.length - 1);
      return {
        ...item,
        timer,
      };
    });
    setTraderList(trades);
  };
  //
  useEffect(() => {
    if (initObj.overview) {
      handleInit();
    } else {
      setInfo(null);
    }
  }, [initObj?.trader?.address]);

  const handleClick = () => {
    setSearchOpen(false);
    // input-tip-box
  };

  const handleSearchClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchOpen(false);
    await initInfo(sInfo.address);
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleRefresh = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // if (!isActive) return;
    setSearchOpen(false);
    try {
      setIsRefresh(true);
      await initInfo(info.address);
    } finally {
      setIsRefresh(false);
    }
  };

  const handleEmptyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!info && !loading) {
    return (
      <div className="mt-4" style={{ color: '#6B7280' }}>
        Sorry, trader not found. Please check if you have entered the correct
        Solana address.
      </div>
    );
  }

  return (
    <div className="swap-box" style={{ padding: 20 }}>
      <div
        className={
          tags.length
            ? 'flex justify-between'
            : 'flex justify-between align-item-center'
        }
      >
        <div className="flex gap-2 align-item-center">
          <AvatarImage
            borderRadius="12px"
            walletAddress={info.address || ''}
            size={56}
            className={'h-14 w-14'}
          />
          <div>
            <div className="flex gap-2 align-item-center">
              <div className="text-xl font-bold" style={{ color: '#292D32' }}>
                {exchangeTrader(info.address || '')}
              </div>
              <Tooltip title={copyTooltip ? 'Copied' : 'Copy'}>
                <CopyToClipboard
                  onCopy={() => {
                    setCopyTooltip(true);
                    setTimeout(() => {
                      setCopyTooltip(false);
                    }, 1000);
                  }}
                  text={info.address || ''}
                >
                  <Icon
                    className="base-icon"
                    style={{ width: 16, height: 16 }}
                    component={CopyIcon}
                  />
                </CopyToClipboard>
              </Tooltip>
            </div>
            {tags?.length ? (
              <div className="flex gap-1">
                {(activeTags || []).map((tag, index) => (
                  <div
                    className="px-2 py-1"
                    style={{
                      backgroundColor: chartBgColorArray[index],
                      color: chartColorArray[index],
                      borderRadius: 4,
                    }}
                  >
                    {tag}
                  </div>
                ))}
                {tags.length > 3 ? (
                  <Popover
                    content={tags.join(',')}
                    title="Tags"
                    overlayClassName="chart-popover"
                  >
                    <div
                      className="px-2 py-1"
                      style={{
                        backgroundColor: '#F9FAFB',
                        color: '#6B7280',
                        borderRadius: 4,
                      }}
                    >
                      View all
                    </div>
                  </Popover>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="input-box">
          <Input
            disabled={!isActive}
            rootClassName="trader-input"
            addonAfter={
              <div className="chat-addon">
                {searchLoading ? (
                  <Icon className="rotate" component={RefreshIcon} />
                ) : (
                  <Icon component={SearchIcon} />
                )}
              </div>
            }
            placeholder="search trader"
            style={{ width: 200, height: 32 }}
            onChange={(e) => searchInfo(e.target.value)}
          />
          <div
            className={
              searchOpen
                ? 'input-tip-box search-show'
                : 'input-tip-box search-hide'
            }
          >
            {sInfo && sInfo.address ? (
              <div
                className="flex gap-2 p-4 align-item-center h-14 cursor-pointer input-tip-box-inner"
                onClick={handleSearchClick}
              >
                <AvatarImage
                  borderRadius="12px"
                  walletAddress={sInfo.address}
                  size={26}
                  className={'h-6.5 w-6.5 rounded-sm'}
                />
                <div>{exchangeTrader(sInfo.address)}</div>
              </div>
            ) : (
              <div
                className="font-bold p-4 flex justify-center"
                style={{ textAlign: 'center', color: '#718096' }}
                onClick={handleEmptyClick}
              >
                trader not found
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between align-item-center my-4 ">
        <div className="font-bold">
          Trading overview in the past 7 days ({z})
        </div>
        <div
          className="refresh-box flex align-item-center gap-1.5 text-xs"
          onClick={handleRefresh}
        >
          <Icon className={isRefresh ? 'rotate' : ''} component={RefreshIcon} />
          <Tooltip
            overlayInnerStyle={{ width: 220 }}
            title="Update data for the last 7 days"
            placement="top"
          >
            <div>Update</div>
          </Tooltip>
        </div>
      </div>
      <div
        className="p-5"
        style={{ backgroundColor: '#F9FAFB', borderRadius: 8 }}
      >
        <div className="flex justify-around">
          <Statistic
            label="Total Profit"
            loading={loading}
            // @ts-ignore
            value={`${!overView?.total_net_profit ? 0 : overView?.total_net_profit > 0 ? '+' + changePrice(overView.total_net_profit || 0) : '-' + changePrice(overView.total_net_profit * -1 || 0)} SOL`}
          />

          <Statistic
            label="Profit Rate"
            loading={loading}
            value={`${changePrice(overView?.profit_ratio * 100 || 0)} %`}
          />
          <Statistic
            label="Win Rate"
            loading={loading}
            value={`${changePrice(overView?.net_profit_win_ratio * 100 || 0)} %`}
          />
          <Statistic
            label="Total  Cost"
            loading={loading}
            value={`${changePrice(overView?.total_cost || 0)} SOL`}
          />
        </div>

        <div className="flex mt-4 justify-around">
          <Statistic
            loading={loading}
            label="Ave. Tip"
            value={`${changePrice(overView?.avg_tip_per_token || 0)} SOL`}
          />

          <Statistic
            loading={loading}
            label="Ave. Gas"
            value={`${changePrice(overView?.avg_fee_per_token || 0)} SOL`}
          />
          <Statistic
            loading={loading}
            label="Token traded"
            value={changePrice(overView?.traded_token_count || 0)}
          />
          <Statistic
            loading={loading}
            label="Coin created"
            value={changePrice(overView?.token_create_count || 0)}
          />
        </div>
      </div>
      <div className="my-4 font-bold">Profit</div>
      <ProfitChart loading={loading} list={profitList} />
      <div className="my-4 font-bold">Profit distribution</div>
      <ProfitDistributionChart
        loading={loading}
        list={profitDistributionList}
      />
      <div className="my-4 font-bold">Trade time distribution</div>
      <TradeCountChart loading={loading} list={traderList} />
      <div className="mt-4 text-xs" style={{ color: '#171717' }}>
        The above data is compiled from the trading data of the Pump.fun over
        the past 7 days.
      </div>
    </div>
  );
};

export default PumpTopDetail;
