import '@/global.less';
import ReactECharts from 'echarts-for-react';
import './index.less';
import { changePrice } from '@/utils/chain';

const ProfitChart = (props: { loading: boolean; list: any[] }) => {
  const { loading, list } = props;
  const option = {
    grid: {
      bottom: 40,
      top: 20,
      right: 20,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        // params是一个包含当前数据信息的数组或对象
        return `<div style="min-width: 126px;">
          <div class="text-xs font-bold text-black">${list[params[0].dataIndex].tooltipTime}</div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"><span>${params[0].marker} ${params[0].seriesName}:</span> <span class="text-black">${changePrice(params[0].value)}</span></div>
        </div>`;
      },
      backgroundColor: 'rgba(235, 235, 235, 0.9)',
      extraCssText: 'border: 0;border-radius: 8px',
    },
    xAxis: {
      type: 'category',
      data: [...list].map((li) => li.xAxisTime),
    },
    yAxis: {
      type: 'value',
      name: 'Profit (SOL)',
      nameGap: 50,
      nameLocation: 'middle',
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        data: [...list].map((li) => li.net_profit),
        name: 'Profit',
        type: 'line',
        smooth: 0.3,
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

export default ProfitChart;
