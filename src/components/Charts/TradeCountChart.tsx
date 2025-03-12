import '@/global.less';
import ReactECharts from 'echarts-for-react';
import { exchangeUnit } from '@/utils/chart';
import './index.less';
import { changePrice } from '@/utils/chain';

const TradeCountChart = (props: { loading: boolean; list: any[] }) => {
  const { loading, list } = props;
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        // params是一个包含当前数据信息的数组或对象
        return `<div style="min-width: 186px;">
          <div class="text-xs font-bold text-black">${list[params[0].dataIndex].time_range}</div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"><span>Trade count:</span> <span class="text-black">${changePrice(params[0].value)}</span></div>
        </div>`;
      },
      backgroundColor: 'rgba(235, 235, 235, 0.9)',
      extraCssText: 'border: 0;border-radius: 8px',
    },
    grid: {
      // left: 20, // 左边距离
      right: 20, // 右边距离
      bottom: 40,
      top: 40,
    },
    xAxis: [
      {
        type: 'category',
        data: [...list].map((li) => li.timer),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Trade count',
        nameGap: 40,
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
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [...list].map((li) => li.tx_count),
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

export default TradeCountChart;
