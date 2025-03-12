import { Image, Select } from 'antd';
import type { IRouteComponentProps } from 'umi';
import { connect, history } from 'umi';
import { ReactComponent as Remove } from '@/assets/svg/compare/remove.svg';
import { ReactComponent as Add } from '@/assets/svg/add.svg';
import BianceSrc from '@/assets/chat/biance.png';
import Overview from './components/overview';
import Charts from './components/charts';
import Tokenomics from './components/tokenomics';
import { useEffect, useState } from 'react';
import Team from './components/team';
import Funding from './components/funding';
import Exchanges from './components/exchanges';
import Ecosystem from './components/ecosystem';
import type { CompareItem, UserModel } from '@/utils/model';
import type { UmiComponentProps } from '@/utils/common';
import type { restoreProjectParams } from '@/services/project';
import {
  cmpProjectsInfo,
  getProjectDetail,
  viewProjects,
} from '@/services/project';
import { SET_COMPARES } from '@/utils/reducer';

const { Option } = Select;

interface compareProps {
  isLogin: boolean;
  compares: CompareItem[];
}

const ComparePage = (
  props: IRouteComponentProps & UmiComponentProps & compareProps,
) => {
  const { dispatch, isLogin, compares, location } = props;
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const [infos, setInfos] = useState<restoreProjectParams[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addSelect, setAddSelect] = useState(false);

  const handleSearch = async (newValue: string) => {
    setSearchLoading(true);
    const queryParmas = {
      page: 1,
      size: 10,
      query: newValue,
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
    const searchResult = await viewProjects(queryParmas);
    console.log(searchResult);
    setSearchLoading(false);
    if (searchResult.code === 0) {
      setSearchData(
        searchResult.data.list.map((data: any) => ({
          value: data.id,
          label: data.name,
          logo: data.logo_url,
        })),
      );
    }
  };

  // @ts-ignore
  useEffect(async () => {
    if (first) {
      const queryParmas = {
        page: 1,
        size: 10,
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
      const searchResult = await viewProjects(queryParmas);
      console.log(searchResult);
      setSearchLoading(false);
      if (searchResult.code === 0) {
        setSearchData(
          searchResult.data.list.map((data: any) => ({
            value: data.id,
            label: data.name,
            logo: data.logo_url,
          })),
        );
      }
      setFirst(false);
    }
  }, [first]);

  // useEffect(() => {
  //   const getIdInfo = async (id: string) => {
  //     if (compares.filter((c) => c.id === id).length > 0) {
  //       return;
  //     }
  //     const idResult = await getProjectDetail(id);
  //     console.log(idResult);
  //     if (idResult.code === 0) {
  //       dispatch({
  //         type: SET_COMPARES,
  //         payload: [
  //           ...compares,
  //           {
  //             id: idResult.data.id,
  //             name: idResult.data.basic.name,
  //             logo: idResult.data.basic.logo_url,
  //           },
  //         ],
  //       });
  //     }
  //   };
  //   if ((location.query.ids as string).split(',').length === 0) {
  //     history.push('/home');
  //   } else {
  //     if (first) {
  //       const idsArrays = (location.query.ids as string).split(',');
  //       setIds((location.query.ids as string).split(','));
  //       for (let i = 0; i < idsArrays.length; i += 1) {
  //         getIdInfo(idsArrays[i]);
  //       }
  //       setFirst(false);
  //     }
  //   }
  // }, [compares, first, location]);

  useEffect(() => {
    const cmpProjects = async () => {
      if (infos.length === (location.query.ids as string).split(',').length) {
        return;
      }
      const cmpResult = await cmpProjectsInfo(location.query.ids as string);
      console.log(cmpResult);
      if (cmpResult.code === 0) {
        console.log(location);
        setInfos(cmpResult.data.infos);
        dispatch({
          type: SET_COMPARES,
          payload: cmpResult.data.infos.map((info: any) => {
            return {
              id: info.id,
              name: info.basic.name,
              logo: info.basic.logo_url,
            };
          }),
        });
      }
      // if (compares.length !== location.query.infos) {}
    };
    console.log(location);
    cmpProjects();
  }, [location, dispatch, compares]);

  return (
    <>
      <div
        className="px-14 py-6 mt-16"
        style={{
          background:
            'linear-gradient(180deg, #D1D5DB 0%, rgba(209, 213, 219, 0.61) 0.01%,  #F9FAFB 10%, #F9FAFB 100%)',
        }}
      >
        <div className="mt-12 text-4xl font-bold text-center">
          Projects Comparison
        </div>
        <div className="mt-5 text-center text-sm">
          Help choosing,{' '}
          <span
            onClick={() => {
              history.push('/home');
            }}
            className="text-blue-500 cursor-pointer"
          >
            View all Projects
          </span>
          .
        </div>
        <div className="mt-20 flex">
          {infos.length > 0 && (
            <div
              className={`px-5 py-4 flex bg-white rounded-xl ${
                infos.length < 3 ? 'w-1/2' : 'w-1/3'
              }`}
            >
              <Image
                src={infos[0]?.basic.logo_url}
                className="rounded-lg"
                width={48}
                preview={false}
              />
              <div className="ml-2.5 font-bold mt-2.5">
                {infos[0]?.basic.name}
              </div>
              <Remove
                onClick={() => {
                  if (compares.length === 1) {
                    return;
                  }
                  const cIndex = compares.findIndex(
                    (c) => c.id === infos[0]?.id,
                  );
                  dispatch({
                    type: SET_COMPARES,
                    payload: [
                      ...compares.slice(0, cIndex),
                      ...compares.slice(cIndex + 1),
                    ],
                  });
                  history.push({
                    pathname: '/compare',
                    query: {
                      ids: [
                        ...compares.slice(0, cIndex),
                        ...compares.slice(cIndex + 1),
                      ]
                        .map((c) => c.id)
                        .join(','),
                    },
                  });
                }}
                style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                className={`ml-auto mt-2.5 ${
                  compares.length === 1
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              />
            </div>
          )}
          {infos.length === 1 && !addSelect && (
            <div
              onClick={() => {
                setAddSelect(true);
              }}
              className={`ml-5 rounded-xl px-5 py-4 w-1/2 border border-gray-300 flex cursor-pointer `}
            >
              <Add
                style={{ stroke: '#D1D5DB' }}
                className="mt-3 cursor-pointer"
              />
              <div className="mt-3.5 ml-1 text-sm font-bold text-gray-500">
                Add new
              </div>
            </div>
          )}
          {infos.length === 1 && addSelect && (
            <div
              className={`ml-5 rounded-xl px-5 py-4 w-1/2 border border-gray-300 flex`}
            >
              <Select
                value={searchValue === '' ? 'Enter project name' : searchValue}
                placeholder="Enter project name"
                bordered={false}
                className="w-full mt-2 cmp-half-add"
                showSearch
                suffixIcon={null}
                filterOption={false}
                onSelect={(value: string) => {
                  setSearchValue('');
                  const filterValue: any = searchData.filter((sData: any) => {
                    return sData.value === value;
                  })[0];
                  if (
                    compares.filter(
                      (compare) => compare.id === filterValue.value,
                    ).length === 0
                  ) {
                    history.push({
                      pathname: '/compare',
                      query: {
                        ids: [...compares, { id: filterValue.value }]
                          .map((c) => c.id)
                          .join(','),
                      },
                    });
                  }
                  setSearchValue('');
                }}
                onSearch={handleSearch}
                onChange={(newValue: string) => {
                  console.log(newValue);
                  setSearchValue(newValue);
                }}
                onBlur={() => {
                  setAddSelect(false);
                }}
                autoFocus
              >
                {searchData.map((data: any) => {
                  return (
                    <Option
                      key={data.value}
                      value={data.value}
                      label={data.label}
                    >
                      <div className="flex">
                        <Image
                          preview={false}
                          src={data.logo}
                          className="rounded-full"
                          width={16}
                        />
                        <div className="ml-2" style={{ marginTop: -4 }}>
                          {data.label}
                        </div>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </div>
          )}
          {infos.length === 2 && (
            <div className="ml-5 flex rounded-xl w-1/2">
              <div className="px-5 py-4 flex bg-white rounded-xl w-3/4">
                <Image
                  className="rounded-lg"
                  src={infos[1]?.basic.logo_url}
                  width={48}
                  preview={false}
                />
                <div className="ml-2.5 font-bold mt-2.5">
                  {infos[1]?.basic.name}
                </div>
                <Remove
                  onClick={() => {
                    const cIndex = compares.findIndex(
                      (c) => c.id === infos[1]?.id,
                    );
                    dispatch({
                      type: SET_COMPARES,
                      payload: [
                        ...compares.slice(0, cIndex),
                        ...compares.slice(cIndex + 1),
                      ],
                    });
                    history.push({
                      pathname: '/compare',
                      query: {
                        ids: [
                          ...compares.slice(0, cIndex),
                          ...compares.slice(cIndex + 1),
                        ]
                          .map((c) => c.id)
                          .join(','),
                      },
                    });
                  }}
                  style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                  className="ml-auto mt-2.5 cursor-pointer"
                />
              </div>
              {!addSelect && (
                <div
                  onClick={() => {
                    setAddSelect(true);
                  }}
                  className="ml-5 px-5 py-4 flex border border-gray-300 rounded-xl w-1/4 cursor-pointer"
                >
                  <Add
                    style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                    className="mt-3 cursor-pointer"
                  />
                  <div className="mt-3.5 ml-1 text-sm font-bold text-gray-500">
                    Add new
                  </div>
                </div>
              )}
              {addSelect && (
                <div className="ml-5 py-4 flex border border-gray-300 rounded-xl w-1/4 cursor-pointer">
                  <Select
                    value={
                      searchValue === '' ? 'Enter project name' : searchValue
                    }
                    placeholder="Enter project name"
                    bordered={false}
                    className="w-full mt-2 cmp-half-add"
                    showSearch
                    suffixIcon={null}
                    filterOption={false}
                    onSelect={(value: string) => {
                      const filterValue: any = searchData.filter(
                        (sData: any) => {
                          return sData.value === value;
                        },
                      )[0];
                      if (
                        compares.filter(
                          (compare) => compare.id === filterValue.value,
                        ).length === 0
                      ) {
                        history.push({
                          pathname: '/compare',
                          query: {
                            ids: [...compares, { id: filterValue.value }]
                              .map((c) => c.id)
                              .join(','),
                          },
                        });
                      }
                      setSearchValue('');
                    }}
                    onSearch={handleSearch}
                    onChange={(newValue: string) => {
                      console.log(newValue);
                      setSearchValue(newValue);
                    }}
                    dropdownMatchSelectWidth={150}
                    onBlur={() => {
                      setAddSelect(false);
                    }}
                    autoFocus
                  >
                    {searchData.map((data: any) => {
                      return (
                        <Option
                          key={data.value}
                          value={data.value}
                          label={data.label}
                        >
                          <div className="flex">
                            <Image
                              preview={false}
                              src={data.logo}
                              className="rounded-full"
                              width={16}
                            />
                            <div
                              className="ml-2 text-sm font-normal"
                              style={{ marginTop: -4 }}
                            >
                              {data.label}
                            </div>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              )}
            </div>
          )}
          {infos.length === 3 && (
            <>
              <div className="ml-5 flex rounded-xl w-1/3">
                <div className="px-5 py-4 flex bg-white rounded-xl w-full">
                  <Image
                    className="rounded-lg"
                    src={infos[1]?.basic.logo_url}
                    width={48}
                    preview={false}
                  />
                  <div className="ml-2.5 font-bold mt-2.5">
                    {infos[1]?.basic.name}
                  </div>
                  <Remove
                    onClick={() => {
                      const cIndex = compares.findIndex(
                        (c) => c.id === infos[1]?.id,
                      );
                      history.push({
                        pathname: '/compare',
                        query: {
                          ids: [
                            ...compares.slice(0, cIndex),
                            ...compares.slice(cIndex + 1),
                          ]
                            .map((c) => c.id)
                            .join(','),
                        },
                      });
                    }}
                    style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                    className="ml-auto mt-2.5 cursor-pointer"
                  />
                </div>
              </div>
              <div className="ml-5 flex rounded-xl w-1/3">
                <div className="px-5 py-4 flex bg-white rounded-xl w-full">
                  <Image
                    className="rounded-lg"
                    src={infos[2]?.basic.logo_url}
                    width={48}
                    preview={false}
                  />
                  <div className="ml-2.5 font-bold mt-2.5">
                    {infos[2]?.basic.name}
                  </div>
                  <Remove
                    onClick={() => {
                      console.log(compares);
                      console.log(infos[2]?.id);
                      const cIndex = compares.findIndex(
                        (c) => c.id === infos[2]?.id,
                      );
                      // dispatch({
                      //   type: SET_COMPARES,
                      //   payload: [
                      //     ...compares.slice(0, cIndex),
                      //     ...compares.slice(cIndex + 1),
                      //   ],
                      // });
                      history.push({
                        pathname: '/compare',
                        query: {
                          ids: [
                            ...compares.slice(0, cIndex),
                            ...compares.slice(cIndex + 1),
                          ]
                            .map((c) => c.id)
                            .join(','),
                        },
                      });
                    }}
                    style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                    className="ml-auto mt-2.5 cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <Overview infos={infos.map((info) => info.basic)} />
        <Charts
          ids={location?.query.ids as string}
          names={infos.map((info) => info.basic.name)}
        />
        <Tokenomics infos={infos.map((info) => info.tokenomics)} />
        <Team
          infos={infos.map((info) => info.team)}
          ids={infos.map((info) => info.id)}
        />
        <Funding
          ids={infos.map((info) => info.id)}
          infos={infos.map((info) => info.funding)}
        />
        <Exchanges infos={infos.map((info) => info.exchanges)} />
        <Ecosystem infos={infos.map((info) => info.ecosystem)} />
      </div>
    </>
  );
};

export default connect((state: { user: UserModel }) => ({
  isLogin: state.user.isLogin,
  compares: state.user.compares,
}))(ComparePage);
