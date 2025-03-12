import { metricCompare } from '@/services/project';
import type { IRouteComponentProps } from 'umi';
import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import { showBriefAmount } from '@/utils/tools';

const chartsColor = [
  ['rgba(196, 181, 253, 0.2)', 'rgba(196, 181, 253, 0)', '#6D28D9'],
  ['rgba(110, 231, 183, 0.2)', 'rgba(110, 231, 183, 0)', '#10B981'],
  ['rgba(253, 186, 116, 0.2)', 'rgba(253, 186, 116, 0)', '#C2410C'],
];

const typeMap = {
  'Circulating-Market-Cap': 'circulating_market_cap',
  'Fully-Diluted-Value': 'fully_diluted_value',
  'Active-Addresses': 'active_addresses',
};

const Charts = (props: { ids: string; names: string[] }) => {
  const { ids, names } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [first, setFirst] = useState(true);
  const [cmpType, setCmpType] = useState('Circulating-Market-Cap');
  const [graphInterval, setGraphInterval] = useState('1d');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateDiff, setDateDiff] = useState(7);
  const [metricsDate, setMetricsDate] = useState([]);
  const [metricsData, setMetricsData] = useState<any>([]);

  useEffect(() => {
    const queryMetrics = async () => {
      if (ids) {
        let startDate = new Date();
        if (dateDiff !== -1) {
          startDate.setDate(startDate.getDate() - dateDiff - 1);
        } else {
          startDate = new Date('2009/01/03 12:00:00');
        }
        const metricsResult = await metricCompare({
          ids: ids,
          type: cmpType,
          start: parseInt((startDate.getTime() / 1000).toFixed(0), 10),
          end: parseInt((currentDate.getTime() / 1000).toFixed(0), 10),
          interval: graphInterval,
        });
        console.log(metricsResult);
        if (metricsResult.code === 0) {
          const idArrays = ids.split(',');
          setMetricsDate(
            metricsResult.data.metrics[idArrays[0]].map((mData: any) => {
              const mdate = new Date(mData.timestamp * 1000);
              return [
                mdate.getFullYear(),
                mdate.getMonth() + 1,
                mdate.getDate(),
              ].join('-');
            }),
          );
          setMetricsData(
            idArrays.map((id: string) => {
              return metricsResult.data.metrics[id].map((mData: any) => {
                return mData[typeMap[cmpType] as string];
              });
            }),
          );
        }
      }
    };
    queryMetrics();
  }, [dateDiff, graphInterval, cmpType, ids, currentDate]);

  useEffect(() => {
    if (container) {
      console.log(names)
      console.log(metricsData)
      const oldcharts = echarts.getInstanceByDom(container as HTMLDivElement);
      oldcharts?.dispose();
      const charts = echarts.init(container as HTMLDivElement);
      charts.setOption({
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          },
        },
        legend: {
          bottom: 60,
          orient: 'horizontal',
          data: names,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: metricsDate,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '25%'],
          axisLabel: {
            formatter: function (value, index) {
              return showBriefAmount(value);
            },
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: 120,
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        series: names.map((name, index) => {
          return {
            name,
            type: 'line',
            symbol: 'none',
            itemStyle: {
              color: chartsColor[index][2],
            },
            lineStyle: {
              width: 2,
              color: chartsColor[index][2],
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: chartsColor[index][0],
                },
                {
                  offset: 1,
                  color: chartsColor[index][1],
                },
              ]),
            },
            data: metricsData[index],
            smooth: true,
            sampling: 'lttb',
          };
        }),
      });
    }
  }, [container, metricsData, metricsDate, names]);

  const setDiff = (diff: number) => {
    if (dateDiff !== diff) {
      setDateDiff(diff);
    }
  };

  const setType = (type: string) => {
    if (cmpType !== type) {
      setCmpType(type);
    }
  };

  return (
    <>
      {metricsData.length > 0 && (
        <div className="mt-5 rounded-2xl bg-white px-8 py-5">
          <div className="flex">
            <div className="flex w-1/2 flex-wrap">
              <div
                onClick={() => {
                  setType('Circulating-Market-Cap');
                }}
                className={`rounded px-6 pt-3 text-sm cursor-pointer ${
                  cmpType === 'Circulating-Market-Cap'
                    ? 'text-purple-700 bg-purple-100'
                    : 'text-gray-500 bg-gray-50 hover:bg-gray-200'
                }`}
              >
                Circulating Market Cap
              </div>
              <div
                onClick={() => {
                  setType('Fully-Diluted-Value');
                }}
                className={`ml-1 rounded px-6 pt-3 text-sm cursor-pointer ${
                  cmpType === 'Fully-Diluted-Value'
                    ? 'text-purple-700 bg-purple-100'
                    : 'text-gray-500 bg-gray-50 hover:bg-gray-200'
                }`}
              >
                Fully Diluted Value
              </div>
              <div
                onClick={() => {
                  setType('Active-Addresses');
                }}
                className={`ml-1 rounded px-6 pt-3 text-sm cursor-pointer ${
                  cmpType === 'Active-Addresses'
                    ? 'text-purple-700 bg-purple-100'
                    : 'text-gray-500 bg-gray-50 hover:bg-gray-200'
                }`}
              >
                Active Addresses
              </div>
            </div>
            <div className="ml-auto rounded-3xl bg-gray-50 px-2 py-1.5 flex">
              <div
                onClick={() => {
                  if (graphInterval !== '1d') {
                    setGraphInterval('1d');
                  }
                }}
                className={`rounded-full w-8 h-8 cursor-pointer ${
                  graphInterval === '1d' ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 text-center text-sm`}
              >
                D
              </div>
              <div
                onClick={() => {
                  if (graphInterval !== '1w') {
                    setGraphInterval('1w');
                  }
                }}
                className={`ml-1 rounded-full w-8 h-8 cursor-pointer ${
                  graphInterval === '1w' ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 text-center text-sm`}
              >
                W
              </div>
              <div
                onClick={() => {
                  if (graphInterval !== '1M') {
                    setGraphInterval('1M');
                  }
                }}
                className={`ml-1 rounded-full w-8 h-8 cursor-pointer ${
                  graphInterval === '1M' ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 text-center text-sm`}
              >
                M
              </div>
            </div>
            <div className="ml-4 rounded-3xl bg-gray-50 px-2 py-1.5 flex">
              <div
                onClick={() => {
                  setDiff(7);
                }}
                className={`rounded-full h-8 cursor-pointer ${
                  dateDiff === 7 ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 px-2.5 text-center text-sm`}
              >
                7D
              </div>
              <div
                onClick={() => {
                  setDiff(30);
                }}
                className={`ml-1 rounded-full h-8 cursor-pointer ${
                  dateDiff === 30 ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 px-2.5 text-center text-sm`}
              >
                30D
              </div>
              <div
                onClick={() => {
                  setDiff(90);
                }}
                className={`ml-1 rounded-full h-8 cursor-pointer ${
                  dateDiff === 90 ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 px-2.5 text-center text-sm`}
              >
                90D
              </div>
              <div
                onClick={() => {
                  setDiff(180);
                }}
                className={`ml-1 rounded-full h-8 cursor-pointer ${
                  dateDiff === 180 ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 px-2.5 text-center text-sm`}
              >
                180D
              </div>
              <div
                onClick={() => {
                  setDiff(365);
                }}
                className={`ml-1 rounded-full h-8 cursor-pointer ${
                  dateDiff === 365 ? 'bg-gray-300' : 'hover:bg-gray-300'
                } pt-1.5 px-2.5 text-center text-sm`}
              >
                365D
              </div>
              <div
                // onClick={() => {
                //   setDiff(-1);
                // }}
                className={`ml-1 rounded-full h-8 cursor-not-allowed ${
                  dateDiff === -1 ? 'bg-gray-300' : ''
                } pt-1.5 px-2.5 text-center text-sm`}
              >
                MAX
              </div>
            </div>
          </div>
          <div id="linesCharts" className="w-full h-96" ref={setContainer} />
        </div>
      )}
    </>
  );
};

export default Charts;
