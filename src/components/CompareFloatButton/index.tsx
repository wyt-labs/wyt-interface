import { connect, history } from 'umi';
import type { IRouteComponentProps } from 'umi';
import { ReactComponent as CompareFloat } from '@/assets/svg/compare/compare_float.svg';
import { ReactComponent as Remove } from '@/assets/svg/compare/remove.svg';
import { ReactComponent as Add } from '@/assets/svg/add.svg';
import { ReactComponent as CloseIcon } from '@/assets/svg/compare/close.svg';
import { useEffect, useState } from 'react';
import './index.less';
import { Image, Input, Modal, Select } from 'antd';
import BianceSrc from '@/assets/chat/biance.png';
import { viewProjects } from '@/services/project';
import { CompareItem, UserModel } from '@/utils/model';
import { UmiComponentProps } from '@/utils/common';
import { SET_COMPARES } from '@/utils/reducer';

const { Option } = Select;

interface floatButtonProps {
  isLogin: boolean;
  compares: CompareItem[];
}

const CompareFloatButton = (props: UmiComponentProps & floatButtonProps) => {
  const { dispatch, isLogin, compares } = props;
  const [isHover, setIsHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addSelect, setAddSelect] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectContainer, setSelectContainer] = useState<HTMLElement | null>(null);

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

  useEffect(() => {
    if (compares.length > 0) {
      setIsModalOpen(true);
    }
  }, [compares]);

  return (
    <>
      <div className="absolute right-0 top-52">
        <div
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
          onClick={() => {
            setIsModalOpen(true);
          }}
          className={`rounded-l-lg p-3 relative w-36 left-20 bg-white shadow-lg cursor-pointer flex side-float`}
        >
          <div>
            <CompareFloat
              style={{ marginTop: 5, fill: isHover ? 'white' : '#8B5CF6' }}
            />
            {compares.length > 0 && (
              <div className="w-0 h-0">
                <div
                  className="relative rounded-full w-5 h-5 bg-red-500 flex"
                  style={{ top: -10, left: 13 }}
                >
                  <div
                    className="text-white m-auto text-base font-bold"
                    style={{ marginTop: -2 }}
                  >
                    {compares.length}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="ml-5 font-bold text-white">Compare</div>
        </div>
      </div>
      {isModalOpen && (
        <div className="absolute right-0" style={{ top: 260 }}>
          <div className="rounded-2xl shadow-lg p-8 bg-white">
            <div className="flex">
              <div className="text-2xl font-bold mb-5">{`Compare list (${compares.length}/3)`}</div>
              <CloseIcon
                className="ml-auto mr-1 mt-1 cursor-pointer"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              />
            </div>
            {compares.map((compare, index) => {
              return (
                <div
                  key={compare.id}
                  className="w-80 mt-2 rounded-xl bg-gray-100 h-12 flex"
                >
                  <Image
                    src={compare.logo}
                    className="rounded-full"
                    preview={false}
                    width={48}
                    height={48}
                  />
                  <div className="ml-2.5 text-sm font-bold mt-3.5">
                    {compare.name}
                  </div>
                  <Remove
                    onClick={() => {
                      dispatch({
                        type: SET_COMPARES,
                        payload: [
                          ...compares.slice(0, index),
                          ...compares.slice(index + 1),
                        ],
                      });
                    }}
                    className="ml-auto mt-3 mr-3 cursor-pointer"
                  />
                </div>
              );
            })}
            {/* {compares.length < 3 && (
              <div className="w-80 mt-2 rounded-xl bg-gray-100 h-12 flex">
                <Add
                  style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                  className="mt-3 ml-5"
                />
                <Select
                  value={searchValue}
                  options={searchData}
                  loading={searchLoading}
                  bordered={false}
                  className="w-full mt-2"
                  showSearch
                  suffixIcon={null}
                  filterOption={false}
                  onSelect={(value: string) => {
                    const filterValue: any = searchData.filter((sData: any) => {
                      return sData.value === value;
                    })[0];
                    dispatch({
                      type: SET_COMPARES,
                      payload: [
                        ...compares,
                        {
                          id: filterValue.value,
                          name: filterValue.label,
                          logo: filterValue.logo,
                        },
                      ],
                    });
                    setSearchValue('');
                  }}
                  onSearch={handleSearch}
                  notFoundContent={null}
                  onChange={(newValue: string) => {
                    setSearchValue(newValue);
                  }}
                />
              </div>
            )} */}
            {compares.length < 3 && !addSelect && (
              <div
                onClick={() => {
                  setAddSelect(true);
                }}
                className="w-80 mt-2 rounded-xl bg-gray-100 h-12 flex cursor-pointer border border-gray-300 hover:border-gray-600"
              >
                <Add
                  style={{ stroke: 'rgba(209, 213, 219, 1)' }}
                  className="mt-3 ml-5"
                />
                <div className="mt-3.5 ml-1 text-sm font-bold text-gray-500">
                  Add new
                </div>
              </div>
            )}
            {compares.length < 3 && addSelect && (
              <div className="w-80 mt-2 rounded-xl bg-gray-100 h-12 flex border-gray-300 border">
                <Select
                  value={
                    searchValue === '' ? 'Enter project name' : searchValue
                  }
                  loading={searchLoading}
                  bordered={false}
                  placeholder="Enter project name"
                  className="w-full mt-2 float-enter ml-1"
                  showSearch
                  suffixIcon={null}
                  filterOption={false}
                  onSelect={(value: string) => {
                    const filterValue: any = searchData.filter((sData: any) => {
                      return sData.value === value;
                    })[0];
                    if (
                      compares.filter(
                        (compare: any) => compare.id === filterValue.value,
                      ).length === 0
                    ) {
                      dispatch({
                        type: SET_COMPARES,
                        payload: [
                          ...compares,
                          {
                            id: filterValue.value,
                            name: filterValue.label,
                            logo: filterValue.logo,
                          },
                        ],
                      });
                    }
                    setSearchValue('');
                  }}
                  onSearch={handleSearch}
                  notFoundContent={null}
                  onChange={(newValue: string) => {
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
            <div className="flex mt-5">
              <div
                onClick={() => {
                  dispatch({
                    type: SET_COMPARES,
                    payload: [],
                  });
                }}
                style={{ width: 150 }}
                className="rounded-lg border border-solid border-purple-500 py-3 px-14 text-purple-500 font-medium cursor-pointer hover:bg-purple-50 hover:text-purple-300 active:bg-purple-50 active:text-purple-700"
              >
                Clear
              </div>
              <div
                onClick={() => {
                  if (compares.length === 0) {
                    return;
                  }
                  history.push({
                    pathname: '/compare',
                    query: {
                      ids: compares.map((c) => c.id).join(','),
                    },
                  });
                }}
                style={{ width: 150 }}
                className={`ml-auto rounded-lg bg-purple-500 py-3 pl-10 text-white font-medium ${
                  compares.length === 0
                    ? 'cursor-not-allowed bg-purple-100'
                    : 'cursor-pointer hover:bg-purple-300 active:bg-purple-700'
                }`}
              >
                Compare
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default connect((state: { user: UserModel }) => ({
  isLogin: state.user.isLogin,
  compares: state.user.compares,
}))(CompareFloatButton);
