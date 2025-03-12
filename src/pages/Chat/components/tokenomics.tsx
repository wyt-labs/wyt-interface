import * as echarts from 'echarts';
import { useEffect, useState } from 'react';

interface tokenomicsProps {
  big_events_link: string;
  big_events_link_logo_url: string;
  circulating_supply: number;
  description: string;
  holders_link: string;
  holders_link_logo_url: string;
  initial_distribution: distributionProps[];
  initial_distribution_picture_url: string;
  initial_distribution_source_link: string;
  metrics_link: string;
  metrics_link_logo_url: string;
  reference: string;
  token_issuance: boolean;
  token_issuance_date: string;
  token_name: string;
  token_symbol: string;
}

interface distributionProps {
  slice: string;
  percentage: number;
}

const Tokenomics = (props: { info: tokenomicsProps }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const charts = echarts.init(container as HTMLDivElement);
      charts.setOption({
        legend: {
          top: '30%',
          right: '0%',
          orient: 'vertical',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'distribution',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['25%', '50%'],
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: (props.info.initial_distribution || []).map((distribution) => {
              return {
                value: distribution.percentage,
                name: distribution.slice,
              };
            }),
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
              borderType: 'solid',
              borderRadius: 10,
            },
          },
        ],
      });
    }
  }, [container]);

  return (
    <>
      <div className="text-gray-500 text-sm font-normal mt-5">
        {props.info.description}
      </div>
      <div className="rounded-2xl py-10 px-16 flex">
        <div
          id="distributionChart"
          className="w-full h-80"
          ref={setContainer}
        />
      </div>
    </>
  );
};

export default Tokenomics;
