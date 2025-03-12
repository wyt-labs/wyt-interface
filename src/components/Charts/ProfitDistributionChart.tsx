import '@/global.less';
import ReactECharts from 'echarts-for-react';
import './index.less';
import { changePrice } from '@/utils/chain';

const ProfitDistributionChart = (props: { loading: boolean; list: any[] }) => {
  const { loading, list } = props;
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        // params是一个包含当前数据信息的数组或对象
        return `<div style="min-width: 200px;">
          <div class="text-xs font-bold text-black">${params.marker} ${params.name}</div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"> <span>Token count:</span> <span class="text-black">${changePrice(params.value)}</span></div>
          <div class="text-xs mt-1.5 flex justify-between" style="color: rgba(13, 13, 13, 0.64)"> <span>Token percentage:</span> <span class="text-black">${changePrice(params.data.percentage * 100)} %</span></div>
        </div>`;
      },
      backgroundColor: 'rgba(235, 235, 235, 0.9)',
      extraCssText: 'border: 0;border-radius: 8px',
    },
    grid: {
      top: 20,
      left: 0,
    },
    legend: {
      right: 'right',
      // left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 20,
          normal: {
            color: function (colors) {
              const colorList = list.map((li) => li.color);
              return colorList[colors.dataIndex];
            },
          },
        },
        label: {
          show: false,
          position: 'left',
        },
        labelLine: {
          show: false,
        },
        data: list,
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
        style={{ height: 300, width: '100%' }}
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

export default ProfitDistributionChart;
