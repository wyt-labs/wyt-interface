import { useEffect, useState } from 'react';
import * as echarts from 'echarts';

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

const TokenomicsCmp = (props: { info: tokenomicsProps }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const charts = echarts.init(container as HTMLDivElement);
      charts.setOption({
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'distribution',
            type: 'pie',
            radius: ['45%', '55%'],
            avoidLabelOverlap: false,
            center: ['50%', '50%'],
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
            width: '100%',
            labelLine: {
              show: false,
            },
            data: (props.info.initial_distribution || []).map(
              (distribution) => {
                return {
                  value: distribution.percentage,
                  name: distribution.slice,
                };
              },
            ),
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
      <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full flex-grow">
        <div className="rounded-2xl flex w-full">
          <div
            id="distributionChart"
            className="w-full h-80"
            ref={setContainer}
          />
        </div>
        <div className="text-gray-500 text-sm font-normal">
          {props.info.description}
        </div>
      </div>
    </>
  );
};

export default TokenomicsCmp;
