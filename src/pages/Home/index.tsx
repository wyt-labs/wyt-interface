import { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { ReactComponent as Fire } from '@/assets/svg/fire.svg';
import { ReactComponent as Add } from '@/assets/svg/vs.svg';
import { ReactComponent as FilterClose } from '@/assets/svg/filter_close.svg';
import { ReactComponent as Remove } from '@/assets/svg/compare/remove.svg';
import { ReactComponent as ArrowDown } from '@/assets/svg/arrowdown.svg';
import { Input, Popover, TablePaginationConfig } from 'antd';
import { Dropdown } from 'antd';
import { Image, Table, Tooltip } from 'antd';
import type { viewProjectsParams } from '@/services/project';
import { viewProjects } from '@/services/project';
import type {
  homeTableData,
  investorOption,
  tracksOption,
} from '@/utils/interface';
import { listChains, listInvestors, listTracks } from '@/services/related';
import type { FilterValue } from 'antd/es/table/interface';
import { SorterResult } from 'antd/es/table/interface';
import CompareFloatButton from '@/components/CompareFloatButton';
import './index.less';
import type { CompareItem, UserModel } from '@/utils/model';
import type { UmiComponentProps } from '@/utils/common';
import { SET_COMPARES } from '@/utils/reducer';
import TableCard from '@/components/TableCard';
import { getHashIndex, showBriefAmount, toThousands } from '@/utils/tools';

interface filterArray {
  name: string;
  id: string;
  logo?: string;
  isSelected: boolean;
}

interface chainArray {
  name: string;
  id: string;
  isSelected: boolean;
  base_64_icon: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

interface HomeParams {
  isLogin: boolean;
  compares: CompareItem[];
}

const trackColorArray = [
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
  'bg-blue-100 text-blue-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-purple-100 text-purple-700',
  'bg-gray-100 text-gray-700',
];

const Home = (props: UmiComponentProps & HomeParams) => {
  const { dispatch, compares } = props;
  const [tableData, setTableData] = useState([]);
  const [chainList, setChainList] = useState<chainArray[]>([]);
  const [allChain, setAllChain] = useState(true);
  const [trackList, setTrackList] = useState<filterArray[]>([]);
  const [allTrack, setAllTrack] = useState(true);
  const [investorList, setInvestorList] = useState<filterArray[]>([]);
  const [moreTrack, setMoreTrack] = useState([]);
  const [moreInvestor, setMoreInvestor] = useState([]);
  const [allInvestor, setAllInvestor] = useState(true);
  const [capMax, setCapMax] = useState(-1);
  const [capMin, setCapMin] = useState(-1);
  const [capMaxErr, setCapMaxErr] = useState(false);
  const [capMinErr, setCapMinErr] = useState(false);
  const [capRange, setCapRange] = useState([-1, -1]);
  const [foundRange, setFoundRange] = useState<number[]>([1, -1]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  const capList: number[] = [5, 10, 50, 100];
  const foundRangeList: number[][] = [
    [1, 6],
    [1, 12],
    [1, 24],
    [1, 36],
    [36, -1],
  ];
  const foundMap = ['<6month', '<1year', '<2year', '<3year', '>3year'];

  const columns = [
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, data: homeTableData) => (
        <>
          <div>
            <>
              {compares.filter((compare) => {
                return compare.id === data.id;
              }).length === 0 && (
                <Tooltip
                  title={
                    compares.length >= 3
                      ? 'max support 3 project at once'
                      : 'add to compare list'
                  }
                >
                  <Add
                    onClick={() => {
                      if (compares.length >= 3) {
                        return;
                      }
                      dispatch({
                        type: SET_COMPARES,
                        payload: [
                          ...compares,
                          {
                            id: data.id,
                            name: data.name,
                            logo: data.logo_url,
                          },
                        ],
                      });
                    }}
                    style={{
                      stroke:
                        compares.length >= 3 ? 'rgba(209, 213, 219, 1)' : '',
                    }}
                    className={`${
                      compares.length >= 3
                        ? 'cursor-not-allowed'
                        : 'home-add cursor-pointer'
                    }`}
                  />
                </Tooltip>
              )}
              {compares.filter((compare) => {
                return compare.id === data.id;
              }).length > 0 && (
                <Remove
                  onClick={() => {
                    let index = 0;
                    for (let i = 0; i < compares.length; i++) {
                      if (compares[i].id === data.id) {
                        index = i;
                      }
                    }
                    dispatch({
                      type: SET_COMPARES,
                      payload: [
                        ...compares.slice(0, index),
                        ...compares.slice(index + 1),
                      ],
                    });
                  }}
                  className="home-add cursor-pointer"
                />
              )}
            </>
          </div>
        </>
      ),
    },
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'PRODUCTS',
      dataIndex: 'products',
      render: (_: any, data: homeTableData) => (
        <>
          <Popover
            style={{ width: 800 }}
            content={<TableCard id={data.id} />}
            // open={}
            title={null}
          >
            <div className="flex cursor-pointer">
              <Image
                onClick={() => {
                  history.push({
                    pathname: '/detail',
                    query: {
                      id: data.id,
                    },
                  });
                }}
                src={data.logo_url}
                className="cursor-pointer rounded-full"
                preview={false}
                width={36}
                height={36}
              />
              <div className="ml-2">
                <div
                  onClick={() => {
                    history.push({
                      pathname: '/detail',
                      query: {
                        id: data.id,
                      },
                    });
                  }}
                  className="text-gray-700 text-sm font-semibold cursor-pointer"
                >
                  {data.symbol}
                </div>
                <div
                  onClick={() => {
                    history.push({
                      pathname: '/detail',
                      query: {
                        id: data.id,
                      },
                    });
                  }}
                  className="mt-1.50 text-sm text-gray-400 font-normal cursor-pointer"
                >
                  {data.name}
                </div>
              </div>
            </div>
          </Popover>
        </>
      ),
    },
    {
      title: 'TRACK',
      dataIndex: 'track',
      render: (_: any, data: homeTableData) => (
        <>
          <div className="flex">
            {(data.tracks || []).length === 0 && <div>-</div>}
            {(data.tracks || []).length > 0 &&
              (data.tracks || []).slice(0, 2).map((track, index) => {
                return (
                  <div
                    className={`py-2 px-3 text-sm font-normal rounded-lg mr-2 ${
                      trackColorArray[
                        getHashIndex(track.name, trackColorArray.length)
                      ]
                    }`}
                    key={track.id}
                  >
                    {track.name}
                  </div>
                );
              })}
            {(data.tracks || []).length > 2 && (
              <div className="text-gray-400 mt-2">{`+${
                data.tracks.length - 2
              } tracks`}</div>
            )}
          </div>
        </>
      ),
    },
    {
      title: 'CHAINS',
      dataIndex: 'chains',
      render: (_: any, data: homeTableData) => (
        <>
          <div className="flex">
            {(data.chains || []).length === 0 && <div>-</div>}
            {(data.chains || []).length > 0 &&
              (data.chains || []).slice(0, 3).map((chain, index) => {
                return (
                  <Tooltip key={chain.id} title={chain.name}>
                    <img
                      className="bg-gray-100 rounded-full relative"
                      style={{
                        left: index > 0 ? -8 * index : 0,
                        zIndex: index + 10,
                      }}
                      src={`data:image/svg+xml;base64,${chain.base_64_icon}`}
                    />
                  </Tooltip>
                );
              })}
            {(data.chains || []).length > 3 && (
              <Tooltip
                title={data.chains
                  .slice(3)
                  .map((chain) => chain.name)
                  .join(',')}
              >
                <div className="text-gray-400 mt-2">{`+${
                  data.chains.length - 3
                } Chains`}</div>
              </Tooltip>
            )}
          </div>
        </>
      ),
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      render: (_: any, data: homeTableData) => (
        <>
          <div className="text-gray-700 text-sm font-semibold">
            {`$ ${toThousands(data.price)}`}
          </div>
        </>
      ),
    },
    {
      title: 'MARKET CAP',
      dataIndex: 'market_cap',
      render: (_: any, data: homeTableData) => (
        <>
          <div className="text-gray-700 text-sm font-semibold">
            {`$ ${toThousands(data.market_cap)}`}
          </div>
        </>
      ),
    },
    {
      title: 'TOTAL FUNDING',
      dataIndex: 'total_funding',
      render: (_: any, data: homeTableData) => (
        <>
          <div className="text-gray-700 text-sm font-semibold">
            {data.total_funding === 0
              ? '-'
              : `$ ${showBriefAmount(data.total_funding)}`}
          </div>
        </>
      ),
    },
    {
      title: 'LAST 7 DAYS',
      dataIndex: 'last_7_days',
      render: (_: any, data: homeTableData) => (
        <>
          <Image
            src={data.last_7_days_picture_url}
            width={102}
            preview={false}
          />
        </>
      ),
    },
  ];

  const queryProjects = async () => {
    const queryParams: viewProjectsParams = {
      page: tableParams.pagination?.current as number,
      size: tableParams.pagination?.pageSize as number,
      query: '',
      conditions: {
        chains: [],
        tracks: [],
        investors: [],
        market_cap_range: null,
        founded_date_range: null,
      },
      sort_field: 'marketcap',
      is_asc: false,
    };
    const viewProjectsResult = await viewProjects(queryParams);
    if (viewProjectsResult.code === 0) {
      setTableData(
        (viewProjectsResult.data.list || []).map(
          (data: homeTableData, index: number) => {
            return {
              ...data,
              key: data.id,
              index: index + 1,
            };
          },
        ),
      );
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: viewProjectsResult.data.total,
        },
      });
    }
  };

  const handleTableChange = async (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
  ) => {
    setTableParams({
      pagination,
      filters,
    });
    const queryParams: viewProjectsParams = {
      page: pagination.current as number,
      size: pagination.pageSize as number,
      query: '',
      conditions: {
        chains: allChain
          ? []
          : chainList
              .filter((chain) => chain.isSelected)
              .map((chain) => chain.id),
        tracks: allTrack
          ? []
          : trackList
              .filter((track) => track.isSelected)
              .map((track) => track.id),
        investors: allInvestor
          ? []
          : investorList
              .filter((investor) => investor.isSelected)
              .map((investor) => investor.id),
        market_cap_range: { min: 1, max: capMax === -1 ? 0 : capMax },
        founded_date_range: {
          min: foundRange[0],
          max: foundRange[1] === -1 ? 0 : foundRange[1],
        },
      },
      sort_field: 'marketcap',
      is_asc: false,
    };
    const viewProjectsResult = await viewProjects(queryParams);
    if (viewProjectsResult.code === 0) {
      console.log(viewProjectsResult);
      setTableData(
        (viewProjectsResult.data.list || []).map(
          (data: homeTableData, index: number) => {
            return {
              ...data,
              key: data.id,
              index:
                ((pagination?.current || 1) - 1) * (pagination.pageSize || 10) +
                index +
                1,
            };
          },
        ),
      );
    }
  };

  const queryTracks = async () => {
    const listTrackResult = await listTracks();
    if (listTrackResult.code === 0) {
      setTrackList(
        listTrackResult.data.list.map((track: tracksOption) => {
          return {
            name: track.name,
            id: track.id,
            isSelect: false,
          };
        }),
      );
      setMoreTrack(
        listTrackResult.data.list.slice(7).map((track: tracksOption) => {
          return {
            key: track.id,
            label: track.name,
          };
        }),
      );
    }
  };

  const queryInvestors = async () => {
    const listInvestorsResult = await listInvestors();
    if (listInvestorsResult.code === 0) {
      setInvestorList(
        listInvestorsResult.data.list.map((investor: investorOption) => {
          return {
            name: investor.name,
            id: investor.id,
            logo: investor.avatar_url,
            isSelect: false,
          };
        }),
      );
      setMoreInvestor(
        listInvestorsResult.data.list
          .slice(4)
          .map((investor: investorOption) => {
            return {
              key: investor.id,
              label: (
                <div className="flex">
                  <Image
                    preview={false}
                    src={investor.avatar_url}
                    width={16}
                    className="rounded-full mt-1"
                  />
                  <div className="ml-2">{investor.name}</div>
                </div>
              ),
              logo: investor.avatar_url,
            };
          }),
      );
    }
  };

  const queryChains = async () => {
    const listChainsResult = await listChains();
    if (listChainsResult.code === 0) {
      setChainList(
        listChainsResult.data.list.map((chain: any) => {
          return {
            ...chain,
            isSelected: false,
          };
        }),
      );
    }
  };

  const filterSearch = async () => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    const queryParams: viewProjectsParams = {
      page: 1,
      size: tableParams.pagination?.size || 20,
      query: '',
      conditions: {
        chains: allChain
          ? []
          : chainList
              .filter((chain) => chain.isSelected)
              .map((chain) => chain.id),
        tracks: allTrack
          ? []
          : trackList
              .filter((track) => track.isSelected)
              .map((track) => track.id),
        investors: allInvestor
          ? []
          : investorList
              .filter((investor) => investor.isSelected)
              .map((investor) => investor.id),
        market_cap_range: {
          min: capRange[0] === -1 ? 1 : capRange[0],
          max: capRange[1] === -1 ? 0 : capRange[1],
        },
        founded_date_range: {
          min: foundRange[0],
          max: foundRange[1] === -1 ? 0 : foundRange[1],
        },
      },
      sort_field: 'marketcap',
      is_asc: false,
    };
    const viewProjectsResult = await viewProjects(queryParams);
    if (viewProjectsResult.code === 0) {
      console.log(viewProjectsResult);
      setTableData(
        (viewProjectsResult.data.list || []).map(
          (data: homeTableData, index: number) => {
            return {
              ...data,
              key: data.id,
              index: index + 1,
            };
          },
        ),
      );
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: viewProjectsResult.data.total,
        },
      });
    }
  };

  useEffect(() => {
    queryTracks();
    queryInvestors();
    queryChains();
    queryProjects();
  }, []);

  useEffect(() => {
    if (isConfirm) {
      filterSearch();
    }
    if (
      chainList.filter((chain) => chain.isSelected === true).length === 0 &&
      trackList.filter((track) => track.isSelected === true).length === 0 &&
      investorList.filter((investor) => investor.isSelected === true).length ===
        0 &&
      capRange[0] === -1 &&
      capRange[1] === -1 &&
      foundRange[0] === 1 &&
      foundRange[1] === -1
    ) {
      setIsConfirm(false);
    }
  }, [chainList, trackList, investorList, capRange, foundRange]);

  useEffect(() => {
    if (
      trackList.filter((track) => {
        return track.isSelected === true;
      }).length === 0
    ) {
      setAllTrack(true);
    } else {
      setAllTrack(false);
    }
  }, [trackList]);

  useEffect(() => {
    if (
      investorList.filter((investor) => {
        return investor.isSelected === true;
      }).length === 0
    ) {
      setAllInvestor(true);
    } else {
      setAllInvestor(false);
    }
  }, [investorList]);

  useEffect(() => {
    if (
      chainList.filter((chain) => {
        return chain.isSelected === true;
      }).length === 0
    ) {
      setAllChain(true);
    } else {
      setAllChain(false);
    }
  }, [chainList]);

  return (
    <>
      <div
        className="px-14 py-6 mt-16"
        style={{
          background:
            'linear-gradient(180deg, #D1D5DB 0%, rgba(209, 213, 219, 0.61) 0.01%, #f9fafb 100%)',
        }}
      >
        {/* <div className="text-gray-900 text-xl font-bold">Trending</div>
        <div className="flex mt-4">
          <div
            className="pl-4 pr-11 py-4 rounded-lg"
            style={{
              background:
                'radial-gradient(66.79% 96.87% at 9.34% 3.13%, #FFEDD5 0%, rgba(255, 237, 213, 0) 100%), #FFFFFF',
            }}
          >
            <div className="h-0 w-0 overflow-visible">
              <Fire className="relative" style={{ left: -25, top: -27 }} />
            </div>
            <div className="text-xs font-normal text-gray-700">
              Shanghai Upgrade
            </div>
          </div>
          <div
            className="pl-4 pr-11 py-4 rounded-lg ml-2"
            style={{
              background:
                'radial-gradient(66.79% 96.87% at 9.34% 3.13%, #FFEDD5 0%, rgba(255, 237, 213, 0) 100%), #FFFFFF',
            }}
          >
            <div className="h-0 w-0 overflow-visible">
              <Fire className="relative" style={{ left: -25, top: -27 }} />
            </div>
            <div className="text-xs font-normal text-gray-700">
              Shanghai Upgrade
            </div>
          </div>
        </div> */}
      </div>
      <div className="px-14 pt-5 pb-14" style={{ background: '#f9fafb' }}>
        <div className="p-6 rounded-2xl bg-white">
          <div className="text-gray-900 font-bold text-xl">Advanced Search</div>
          <div className="text-gray-500 text-sm font-normal mt-2">
            The Hot parts of crypto market
          </div>
          <div className="flex mt-6 h-10 bg-gray-50 rounded-lg">
            <div
              onClick={() => {
                if (!allChain) {
                  setChainList(
                    chainList.map((chain) => {
                      return {
                        ...chain,
                        isSelected: allChain,
                      };
                    }),
                  );
                  setAllChain(!allChain);
                }
              }}
              className={`font-bold py-2.5 text-sm px-6 rounded-lg cursor-pointer ${
                allChain
                  ? 'text-purple-500 bg-purple-100 hover:bg-purple-200 border rounded-lg border-purple-300'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All chains
            </div>
            {chainList.map((chain, index) => {
              const iconString = Buffer.from(
                chain.base_64_icon,
                'base64',
              ).toString();
              const newIcon = iconString.replace(
                /fill="#787878"/g,
                'fill="rgba(109, 40, 217, 1)"',
              );
              return (
                <Tooltip key={chain.id} placement="top" title={chain.name}>
                  <div
                    onClick={() => {
                      setChainList([
                        ...chainList.slice(0, index),
                        { ...chain, isSelected: !chain.isSelected },
                        ...chainList.slice(index + 1),
                      ]);
                      if (isConfirm) {
                        setIsConfirm(false);
                      }
                    }}
                    className={`ml-4 cursor-pointer  w-10 h-10 rounded-lg ${
                      chain.isSelected
                        ? 'bg-purple-100 hover:bg-purple-300 border rounded-lg border-purple-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${
                        chain.isSelected
                          ? Buffer.from(newIcon).toString('base64')
                          : chain.base_64_icon
                      }`}
                    />
                  </div>
                </Tooltip>
              );
            })}
          </div>
          <div className="flex mt-4">
            <div className="text-gray-700 text-sm font-bold ml-5 mt-1.5 w-28">
              Tracks
            </div>
            <div
              onClick={() => {
                if (!allTrack) {
                  setTrackList(
                    trackList.map((track) => {
                      return {
                        ...track,
                        isSelected: allTrack,
                      };
                    }),
                  );
                  setAllTrack(!allTrack);
                }
              }}
              className={`px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                allTrack
                  ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              All
            </div>
            {trackList.length > 0 &&
              trackList.slice(0, 7).map((track, index) => {
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setTrackList([
                        ...trackList.slice(0, index),
                        { ...track, isSelected: !track.isSelected },
                        ...trackList.slice(index + 1),
                      ]);
                      if (isConfirm) {
                        setIsConfirm(false);
                      }
                    }}
                    className={`ml-4 px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                      track.isSelected
                        ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {track.name}
                  </div>
                );
              })}
            <Dropdown
              menu={{
                items: moreTrack,
                selectable: true,
                multiple: true,
                style: { height: 200, overflowY: 'auto' },
                selectedKeys: trackList
                  .filter((track) => track.isSelected === true)
                  .map((track) => track.id),
                onClick: (item) => {
                  const index = trackList.findIndex((track) => {
                    return track.id === item.key;
                  });
                  setTrackList([
                    ...trackList.slice(0, index),
                    {
                      ...trackList[index],
                      isSelected: !trackList[index].isSelected,
                    },
                    ...trackList.slice(index + 1),
                  ]);
                  if (isConfirm) {
                    setIsConfirm(false);
                  }
                },
              }}
            >
              <div
                className={
                  'ml-4 px-6 py-1.5 text-sm font-normal rounded cursor-pointer bg-gray-50 hover:bg-gray-100 flex'
                }
              >
                Show more
                <span className="ml-1 mt-0.5">
                  <ArrowDown />
                </span>
              </div>
            </Dropdown>
          </div>
          <div className="flex mt-4">
            <div className="text-gray-700 text-sm font-bold ml-5 mt-1.5 w-28">
              Investors
            </div>
            <div
              onClick={() => {
                if (!allInvestor) {
                  setInvestorList(
                    investorList.map((investor) => {
                      return {
                        ...investor,
                        isSelected: allInvestor,
                      };
                    }),
                  );
                }
                // setAllInvestor(!allInvestor);
              }}
              className={`px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                allInvestor
                  ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              All
            </div>
            {investorList.length > 0 &&
              investorList.slice(0, 4).map((investor, index) => {
                return (
                  <div
                    key={investor.id}
                    onClick={() => {
                      setInvestorList([
                        ...investorList.slice(0, index),
                        { ...investor, isSelected: !investor.isSelected },
                        ...investorList.slice(index + 1),
                      ]);
                      if (isConfirm) {
                        setIsConfirm(false);
                      }
                    }}
                    className={`flex ml-4 px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                      investor.isSelected
                        ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div>
                      <Image
                        preview={false}
                        src={investor.logo}
                        width={16}
                        className="rounded-full mt-0.5"
                      />
                    </div>
                    <div className="ml-2">{investor.name}</div>
                  </div>
                );
              })}
            <Dropdown
              menu={{
                items: moreInvestor,
                selectable: true,
                multiple: true,
                style: { height: 200, overflowY: 'auto' },
                selectedKeys: investorList
                  .filter((investor) => investor.isSelected === true)
                  .map((investor) => investor.id),
                onClick: (item) => {
                  const index = investorList.findIndex((investor) => {
                    return investor.id === item.key;
                  });
                  setInvestorList([
                    ...investorList.slice(0, index),
                    {
                      ...investorList[index],
                      isSelected: !investorList[index].isSelected,
                    },
                    ...investorList.slice(index + 1),
                  ]);
                  if (isConfirm) {
                    setIsConfirm(false);
                  }
                },
              }}
            >
              <div
                className={
                  'ml-4 px-6 py-1.5 text-sm font-normal rounded cursor-pointer bg-gray-50 hover:bg-gray-100 flex'
                }
              >
                Show more
                <span className="ml-1 mt-0.5">
                  <ArrowDown />
                </span>
              </div>
            </Dropdown>
          </div>
          <div className="flex mt-4">
            <div className="text-gray-700 text-sm font-bold ml-5 mt-1.5 w-28">
              Market Cap
            </div>
            <div
              onClick={() => {
                if (capRange[0] !== -1 || capRange[1] !== -1) {
                  setCapRange([-1, -1]);
                }
              }}
              className={`px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                capRange[0] === -1 && capRange[1] === -1
                  ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              All
            </div>
            {capList.map((cap) => {
              return (
                <div
                  key={`cap-${cap}`}
                  onClick={() => {
                    if (capRange[1] === cap) {
                      setCapRange([-1, -1]);
                    } else {
                      setCapRange([1, cap]);
                    }
                    console.log(capRange);
                    if (isConfirm) {
                      setIsConfirm(false);
                    }
                  }}
                  className={`ml-4 px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                    capRange[1] === cap
                      ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {`Top${cap}`}
                </div>
              );
            })}
            <Input
              value={capMin === -1 || capMin === 0 ? '' : capMin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value: inputValue } = e.target;
                const reg = /^\d*$/;
                setCapMinErr(false);
                if (reg.test(inputValue)) {
                  setCapMin(parseInt(inputValue || '0', 10));
                }
              }}
              className="w-20 ml-4"
              status={capMinErr ? 'error' : ''}
              maxLength={16}
            />
            <div className="h-px w-2 bg-gray-300 ml-2 mt-4" />
            <Input
              value={capMax === -1 || capMax === 0 ? '' : capMax}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value: inputValue } = e.target;
                const reg = /^\d*$/;
                setCapMaxErr(false);
                if (reg.test(inputValue)) {
                  setCapMax(parseInt(inputValue || '0', 10));
                }
              }}
              className="w-20 ml-4"
              status={capMaxErr ? 'error' : ''}
              maxLength={16}
            />
            <div
              onClick={() => {
                let hasErr = false;
                if (capMax === -1 || capMax === 0) {
                  setCapMaxErr(true);
                  hasErr = true;
                }
                if (capMin === -1 || capMin === 0) {
                  setCapMinErr(true);
                  hasErr = true;
                }
                if (capMax < capMin) {
                  setCapMaxErr(true);
                  setCapMinErr(true);
                  hasErr = true;
                }
                if (hasErr) {
                  return;
                }
                setCapMaxErr(false);
                setCapMinErr(false);
                setCapRange([capMin, capMax]);
                setCapMax(-1);
                setCapMin(-1);
              }}
              className="ml-4 px-4 pt-1.5 h-8 bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-300 active:bg-purple-700 text-white text-sm"
            >
              Confirm
            </div>
          </div>
          <div className="flex mt-4">
            <div className="text-gray-700 text-sm font-bold ml-5 mt-1.5 w-28">
              Founded Date
            </div>
            <div
              onClick={() => {
                if (foundRange[0] !== 1 || foundRange[1] !== -1) {
                  setFoundRange([1, -1]);
                }
              }}
              className={`px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                foundRange[0] === 1 && foundRange[1] === -1
                  ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              All
            </div>
            {foundRangeList.map((range, index) => {
              return (
                <div
                  key={`found-${range[0]}-${range[1]}`}
                  onClick={() => {
                    if (
                      foundRange[1] === range[1] &&
                      foundRange[0] === range[0]
                    ) {
                      setFoundRange([1, -1]);
                    } else {
                      setFoundRange(range);
                    }
                    if (isConfirm) {
                      setIsConfirm(false);
                    }
                  }}
                  className={`ml-4 px-6 py-1.5 text-sm font-normal rounded cursor-pointer ${
                    foundRange[1] === range[1] && foundRange[0] === range[0]
                      ? 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {foundMap[index]}
                </div>
              );
            })}
          </div>
        </div>
        {(chainList.filter((chain) => chain.isSelected === true).length > 0 ||
          trackList.filter((track) => track.isSelected === true).length > 0 ||
          investorList.filter((investor) => investor.isSelected === true)
            .length > 0 ||
          capRange[0] !== -1 ||
          capRange[1] !== -1 ||
          foundRange[0] !== 1 ||
          foundRange[1] !== -1) && (
          <div className="mt-5 bg-white rounded-2xl py-3 px-6 flex">
            <div className="flex-none text-gray-500 text-sm font-normal mt-2.5">
              Select filters:
            </div>
            <div className="flex flex-grow flex-wrap">
              {chainList.filter((chain) => chain.isSelected === true).length >
                0 &&
                chainList.map((chain, index) => {
                  if (!chain.isSelected) {
                    return;
                  } else {
                    return (
                      <div
                        key={chain.id}
                        className="flex py-2.5 px-4 ml-4 bg-purple-100 rounded mb-2"
                      >
                        <div className="text-purple-700 font-normal text-sm">
                          {chain.name}
                        </div>
                        <FilterClose
                          onClick={() => {
                            setChainList([
                              ...chainList.slice(0, index),
                              { ...chain, isSelected: false },
                              ...chainList.slice(index + 1),
                            ]);
                          }}
                          className="ml-2 mt-0.5 cursor-pointer"
                        />
                      </div>
                    );
                  }
                })}
              {trackList.filter((track) => track.isSelected === true).length >
                0 &&
                trackList.map((track, index) => {
                  if (!track.isSelected) {
                    return;
                  } else {
                    return (
                      <div
                        key={track.id}
                        className="flex py-2.5 px-4 ml-4 bg-purple-100 rounded mb-2"
                      >
                        <div className="text-purple-700 font-normal text-sm">
                          {track.name}
                        </div>
                        <FilterClose
                          onClick={() => {
                            setTrackList([
                              ...trackList.slice(0, index),
                              { ...track, isSelected: false },
                              ...trackList.slice(index + 1),
                            ]);
                          }}
                          className="ml-2 mt-0.5 cursor-pointer"
                        />
                      </div>
                    );
                  }
                })}
              {investorList.filter((investor) => investor.isSelected === true)
                .length > 0 &&
                investorList.map((investor, index) => {
                  if (!investor.isSelected) {
                    return;
                  } else {
                    return (
                      <div
                        key={investor.id}
                        className="flex py-2.5 px-4 ml-4 bg-purple-100 rounded mb-2"
                      >
                        <div className="h-0 overflow-visible">
                          <Image
                            preview={false}
                            src={investor.logo}
                            width={14}
                            className="rounded-full"
                            style={{ marginTop: -1 }}
                          />
                        </div>
                        <div className="text-purple-700 font-normal text-sm ml-1">
                          {investor.name}
                        </div>
                        <FilterClose
                          onClick={() => {
                            setInvestorList([
                              ...investorList.slice(0, index),
                              { ...investor, isSelected: false },
                              ...investorList.slice(index + 1),
                            ]);
                          }}
                          className="ml-2 mt-0.5 cursor-pointer"
                        />
                      </div>
                    );
                  }
                })}
              {(capRange[0] !== -1 || capRange[1] !== -1) && (
                <div className="flex py-2.5 px-4 ml-4 bg-purple-100 rounded mb-2">
                  <div className="text-purple-700 font-normal text-sm">
                    {`Top${
                      capRange[0] === 1
                        ? capRange[1]
                        : capRange[0] + '-' + capRange[1]
                    }`}
                  </div>
                  <FilterClose
                    onClick={() => {
                      setCapRange([-1, -1]);
                      setCapMax(-1);
                      setCapMin(-1);
                    }}
                    className="ml-2 mt-0.5 cursor-pointer"
                  />
                </div>
              )}
              {(foundRange[0] !== 1 || foundRange[1] !== -1) &&
                foundRangeList.map((range, index) => {
                  if (range[1] === foundRange[1]) {
                    return (
                      <div
                        key={`filter-range-${range[0]}-${range[1]}`}
                        className="flex py-2.5 px-4 ml-4 bg-purple-100 rounded mb-2"
                      >
                        <div className="text-purple-700 font-normal text-sm">
                          {foundMap[index]}
                        </div>
                        <FilterClose
                          onClick={() => {
                            setFoundRange([1, -1]);
                          }}
                          className="ml-2 mt-0.5 cursor-pointer"
                        />
                      </div>
                    );
                  }
                })}
            </div>
            {!isConfirm && (
              <div
                onClick={() => {
                  filterSearch();
                  setIsConfirm(true);
                }}
                className="ml-auto px-4 py-2 h-10 bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-300 active:bg-purple-700 text-white"
              >
                Confirm
              </div>
            )}
            {isConfirm && (
              <div
                onClick={() => {
                  if (!allChain) {
                    setChainList(
                      chainList.map((chain) => {
                        return {
                          ...chain,
                          isSelected: allChain,
                        };
                      }),
                    );
                    setAllChain(!allChain);
                  }
                  if (!allTrack) {
                    setTrackList(
                      trackList.map((track) => {
                        return {
                          ...track,
                          isSelected: allTrack,
                        };
                      }),
                    );
                    setAllTrack(!allTrack);
                  }
                  if (!allInvestor) {
                    setInvestorList(
                      investorList.map((investor) => {
                        return {
                          ...investor,
                          isSelected: allInvestor,
                        };
                      }),
                    );
                  }
                  if (capRange[0] !== -1 || capRange[1] !== -1) {
                    setCapRange([-1, -1]);
                  }
                  if (foundRange[0] !== 1 || foundRange[1] !== -1) {
                    setFoundRange([1, -1]);
                  }
                }}
                className="ml-auto px-4 py-2 h-10 bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-300 active:bg-purple-700 text-white"
              >
                Clear all filter
              </div>
            )}
          </div>
        )}
        <div className="mt-5 bg-white rounded-2xl p-6">
          <Table
            locale={{
              emptyText: () => {
                return (
                  <>
                    <div className="flex">
                      <svg
                        className="m-auto mt-10"
                        width="64"
                        height="41"
                        viewBox="0 0 64 41"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          transform="translate(0 1)"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <ellipse
                            fill="#f5f5f5"
                            cx="32"
                            cy="33"
                            rx="32"
                            ry="7"
                          />
                          <g fillRule="nonzero" stroke="#d9d9d9">
                            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
                            <path
                              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                              fill="#fafafa"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div className="mt-2 mb-10">No info</div>
                  </>
                );
              },
            }}
            onRow={(data) => {
              return {
                onMouseEnter: (event) => {},
              };
            }}
            rowClassName="cursor-pointer"
            dataSource={tableData}
            columns={columns}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </div>
      </div>
      <CompareFloatButton />
    </>
  );
};

export default connect((state: { user: UserModel }) => ({
  isLogin: state.user.isLogin,
  compares: state.user.compares,
}))(Home);
