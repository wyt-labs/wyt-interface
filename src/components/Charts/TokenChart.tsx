import '@/global.less';
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { exchangeUnit } from '@/utils/chart';
import { Segmented } from 'antd';
import './index.less';
import dayjs from '@/utils/dayjs';
import { changePrice } from '@/utils/chain';
import { getPumpToken } from '@/services/chat';

const TokenChart = (props: { initList: any[]; isActive: boolean }) => {
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
      const res = await getPumpToken(params);
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
    backgroundColor: 'rgba(0,0,0,0)',
    legend: {
      data: ['Daily new tokens', 'Daily P2R ratio'],
      left: 'left',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        // list[params[0].dataIndex].tooltipTime
        return `<div style="min-width: 186px;">
          <div class="text-xs font-bold text-black">${list[params[0].dataIndex].tooltipTime}</div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"><span>${params[0].marker} ${params[0].seriesName}:</span> <span class="text-black">${changePrice(params[0].value)}</span></div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"><span>${params[1].marker} ${params[1].seriesName}:</span> <span class="text-black">${params[1].value} %</span></div>
        </div>`;
      },
      backgroundColor: 'rgba(235, 235, 235, 0.9)',
      extraCssText: 'border: 0;border-radius: 8px',
    },
    grid: {
      bottom: 40,
      top: 40,
    },
    xAxis: [
      {
        type: 'category',
        data: list ? [...list].map((li) => li.xAxisTime) : [],
        axisPointer: {
          type: 'shadow',
        },
        // splitLine: {
        //   show: false,
        // },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Daily new tokens',
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
      {
        type: 'value',
        nameGap: 46,
        nameLocation: 'middle',
        name: 'Daily P2R ratio (%)',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: function (value) {
            // 修改这里就行
            return value + '%';
          },
        },
      },
    ],
    series: [
      {
        name: 'Daily new tokens',
        type: 'bar',
        data: list ? [...list].map((li) => li.total_count) : [],
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
      {
        name: 'Daily P2R ratio',
        type: 'line',
        yAxisIndex: 1,
        smooth: 0.6,
        data: list ? [...list].map((li) => li.p2r_ratio) : [],
        symbolSize: 8,
        lineStyle: {
          color: '#000',
          width: 4,
        },
        itemStyle: {
          normal: {
            color: '#000',
            borderWidth: 10,
          },
        },
      },
    ],
  };

  return (
    <div>
      <div
        className="px-3 py-5 mt-2.5 pb-0 w-full flex-1"
        style={{
          borderRadius: 8,
          background: '#F9FAFB',
          boxSizing: 'border-box',
        }}
      >
        {/*<div className='text-sm font-bold mb-3'>Daily new tokens on Pump.fun</div>*/}
        <div
          className="flex w-full justify-between mb-3 px-2"
          style={{ alignItems: 'center' }}
        >
          <div className="text-sm font-bold">
            Daily new tokens on Pump.fun ({z})
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
          style={{ height: 260, width: '100%', display: 'flex' }}
          // style={{ width: 'calc(100% - 50px)', boxSizing: 'border-box', height: 260 }}
          loadingOption={{
            color: '#718096',
            textColor: '#718096',
            maskColor: 'rgba(255,255,255, 0.50)',
          }}
          showLoading={loading}
          notMerge={false}
        />
      </div>
    </div>
  );
};

export default TokenChart;
