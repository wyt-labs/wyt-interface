import { Image } from 'antd';
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import DODO from '@/assets/DODO.png';
import TokenUnlock from '@/assets/token_unlocks.png';
import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import { tokenomicsParams } from '@/services/project';

const Tokennomics = (props: {
  info: tokenomicsParams | undefined;
  unlock_url: string | undefined;
}) => {
  const { info, unlock_url } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  console.log(info);

  useEffect(() => {
    if (container) {
      const charts = echarts.init(container as HTMLDivElement);
      charts.setOption({
        legend: {
          top: '30%',
          right: '65%',
          orient: 'vertical',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'token percent',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['10%', '50%'],
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
            data: (info?.initial_distribution || []).map(
              (distribution: any) => {
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
  }, [container, info]);

  return (
    <>
      <div className="px-4">
        <div className="flex py-6">
          <div>
            <div className="text-gray-500 text-sm">Token</div>
            <div className="mt-2 text-base">{info?.token_symbol}</div>
          </div>
          <div className="ml-20">
            <div className="text-gray-500 text-sm">Token Issuance Date</div>
            <div className="mt-2 text-base">
              {info?.token_issuance_date === ''
                ? '-'
                : info?.token_issuance_date}
            </div>
          </div>
          <div className="ml-20">
            <div className="text-gray-500 text-sm">Total Supply</div>
            <div className="mt-2 text-base">
              {info?.total_supply || '-'}
            </div>
          </div>
          {info?.metrics_link !== '' && (
            <div className="ml-auto bg-gray-50 rounded-lg py-2 px-4 cursor-pointer">
              <Image src={info?.metrics_link_logo_url} width={24} />
              <div className="flex mt-2">
                <div>More Token Metrics</div>
                <MoreIcon
                  onClick={() => {
                    window.open(info?.metrics_link);
                  }}
                  width={16}
                  className="mt-px ml-2"
                />
              </div>
            </div>
          )}
          {info?.holders_link !== '' && (
            <div
              className={`${
                info?.metrics_link !== '' ? 'ml-2' : 'ml-auto'
              } bg-gray-50 rounded-lg py-2 px-4 cursor-pointer`}
            >
              <Image src={info?.holders_link_logo_url} width={24} />
              <div className="flex mt-2">
                <div>Whale&KOL Hold</div>
                <MoreIcon
                  onClick={() => {
                    window.open(info?.holders_link);
                  }}
                  width={16}
                  className="mt-px ml-2"
                />
              </div>
            </div>
          )}
          {unlock_url !== undefined && (
            <div
              className={`${
                info?.holders_link !== '' || info?.metrics_link !== ''
                  ? 'ml-2'
                  : 'ml-auto'
              } bg-gray-50 rounded-lg py-2 px-4 cursor-pointer`}
            >
              <Image src={TokenUnlock} width={24} />
              <div className="flex mt-2">
                <div>Token unlocks</div>
                <MoreIcon
                  onClick={() => {
                    window.open(unlock_url);
                  }}
                  width={16}
                  className="mt-px ml-2"
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-5 text-xl font-bold">Initial Distribution</div>
        <div
          id="distributionChart"
          className="w-full h-80"
          ref={setContainer}
        />
        <div className="mt-5 text-xl font-bold">{`${info?.token_symbol} Tokenomics`}</div>
        <div className="mt-5 text-sm text-gray-500">{info?.description}</div>
      </div>
    </>
  );
};

export default Tokennomics;
