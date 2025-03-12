import '@/global.less';
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { exchangeUnit } from '@/utils/chart';
import { Segmented } from 'antd';
import './index.less';
import { getPumpTransactions } from '@/services/chat';
import { changePrice } from '@/utils/chain';
import dayjs from '@/utils/dayjs';

const TransactionsChart = (props: { initList: any[]; isActive: boolean }) => {
  const { initList, isActive } = props;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [z, setZone] = useState('CST');

  const initData = async (duration) => {
    try {
      setLoading(true);
      const zone = new Date().getTimezoneOffset() / 60;
      const zoneString = zone === -8 ? 'CST' : 'UTC';
      const params = {
        duration, // int
        timezone: zoneString, // string: CST, UTC
      };
      const res = await getPumpTransactions(params);
      if (res) {
        setZone(zoneString);
        const mapData = res.rows.map((item) => ({
          ...item,
          xAxisTime: dayjs(new Date(item.date).getTime()).format('ll'),
          tooltipTime: dayjs(new Date(item.date).getTime()).format('lll'),
        }));

        setList(mapData);
      } else {
        setList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInitList = (data: any[]) => {
    const mapData = data.map((item) => ({
      ...item,
      xAxisTime: dayjs(new Date(item.date).getTime()).format('ll'),
      tooltipTime: dayjs(new Date(item.date).getTime()).format('lll'),
    }));

    setList(mapData);
  };

  useEffect(() => {
    if (initList.length) {
      handleInitList(initList);
    }
  }, [initList.length]);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        // params是一个包含当前数据信息的数组或对象
        return `<div style="min-width: 208px;">
          <div class="text-xs font-bold text-black">${list[params[0].dataIndex].tooltipTime}</div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"><span>${params[0].marker} ${params[0].seriesName}:</span> <span class="text-black">${changePrice(params[0].value)}</span></div>
        </div>`;
      },
      backgroundColor: 'rgba(235, 235, 235, 0.9)',
      extraCssText: 'border: 0;border-radius: 8px',
    },
    grid: {
      // left: 20, // 左边距离
      right: 20, // 右边距离
      bottom: 40,
      top: 10,
    },
    xAxis: [
      {
        type: 'category',
        // time_range
        data: [...list].map((li) => li.xAxisTime),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Daily  transactions',
        nameGap: 60,
        nameLocation: 'middle',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: function (value) {
            return exchangeUnit(value, 0);
          },
        },
      },
    ],
    series: [
      {
        name: 'Daily  transactions',
        type: 'bar',
        barWidth: '60%',
        data: [...list].map((li) => li.trade_count),
        itemStyle: {
          normal: {
            color: '#38B2AC',
            borderRadius: 5,
          },
        },
        emphasis: {
          itemStyle: {
            color: '#38B2AC', //hover时改变柱子颜色
          },
        },
      },
    ],
  };
  return (
    <div
      className="px-3 py-5 mt-2.5 pb-0"
      style={{ borderRadius: 8, background: '#F9FAFB' }}
    >
      <div
        className="flex justify-between mb-3 px-2"
        style={{ alignItems: 'center' }}
      >
        <div className="text-sm font-bold">
          Daily transactions on Pump.fun ({z})
        </div>
        <Segmented
          disabled={!isActive}
          className="chart-segment"
          options={['7D', '1M']}
          onChange={(value) => {
            if (value === '7D') {
              initData(7);
            } else {
              initData(30);
            }
          }}
        />
      </div>
      <ReactECharts
        option={option}
        lazyUpdate
        style={{ height: 260, width: '100%' }}
        loadingOption={{
          color: '#718096',
          textColor: '#718096',
          maskColor: 'rgba(255,255,255, 0.50)',
        }}
        showLoading={loading}
        notMerge={false}
      />
    </div>
  );
};

export default TransactionsChart;
