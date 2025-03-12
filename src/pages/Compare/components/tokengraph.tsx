import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { IRouteComponentProps } from 'umi';

interface distributionProps {
  slice: string;
  percentage: number;
}

const TokenGraph = (props: {
  length: number;
  distribution: distributionProps[];
}) => {
  const { distribution, length } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const charts = echarts.init(container as HTMLDivElement);
      charts.setOption({
        legend: {
          top: '30%',
          right: '5%',
          orient: 'vertical',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '数据',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['50%', '50%'],
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: (distribution || []).map((d: any) => {
              return {
                value: d.percentage,
                name: d.slice,
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
  }, [setContainer, container, distribution]);

  useEffect(() => {
    if (container) {
      const charts = echarts.getInstanceByDom(container as HTMLDivElement);
      charts?.dispose();
      const charts1 = echarts.init(container as HTMLDivElement);
      console.log(charts);
      charts1?.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: 'bottom',
          padding: [0,0,30,0],
          orient: 'horizontal',
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['45%', '60%'],
            avoidLabelOverlap: false,
            center: ['50%', '40%'],
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
            data: (distribution || []).map((d: any) => {
              return {
                value: d.percentage,
                name: d.slice,
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
  }, [length, container, distribution]);

  return (
    <>
      <div id="graph" style={{ height: 400 }} ref={setContainer} />
    </>
  );
};

export default TokenGraph;
