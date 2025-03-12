import '@/global.less';
import { connect, history, IRouteComponentProps, useIntl } from 'umi';
import { ReactComponent as Search } from '@/assets/svg/search.svg';
import { ReactComponent as Setting } from '@/assets/svg/setting.svg';
import React, { useEffect, useState } from 'react';
import { LoginWithSignature, QueryNonce, RefreshToken } from '@/services/login';
import LogoSrc from '@/assets/logo.png';
import { reqConfig } from '@/services/request';
import { UmiComponentProps } from '@/utils/common';
import { UserModel } from '@/utils/model';
import { SET_ACCOUNT, SET_ISLOGIN } from '@/utils/reducer';
import { Image, Select } from 'antd';
import { viewProjects } from '@/services/project';
import { Providers } from '@/context/providers';
import { NativeModal } from '@/components/Modal/NativeModal';
import ConnectWalletModal from '@/components/Modal/ConnectWalletModal';

const { Option } = Select;

interface layoutProps {
  isLogin: boolean;
}

const Layout = (
  props: IRouteComponentProps & UmiComponentProps & layoutProps,
) => {
  const { dispatch, isLogin, location } = props;
  const { formatMessage } = useIntl();
  // const [isLogin, setIsLogin] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  // New state to control the visibility of the wallet connection modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the wallet connection modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the wallet connection modal
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const pageContainer = document.getElementById('user-container');
    if (pageContainer) {
      pageContainer.addEventListener('scroll', () => {
        const elements = document.getElementsByClassName(
          'before-sticky-shadow',
        );
        for (let i = 0; i < elements.length; i += 1) {
          const rect = elements[i].getBoundingClientRect();
          const isSticky = rect.top <= 180;
          if (isSticky) {
            elements[i].classList.add('sticky-shadow');
          } else {
            elements[i].classList.remove('sticky-shadow');
          }
        }
      });
    }
  });

  useEffect(() => {
    const pageContainer = document.getElementById('user-container');
    if (pageContainer) {
      pageContainer?.scroll(0, -pageContainer.scrollHeight);
    }
  }, [location]);

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
        (searchResult.data.list || []).map((data: any) => ({
          value: data.id,
          label: data.name,
          logo: data.logo_url,
        })),
      );
    }
  };

  const search = (e: React.KeyboardEvent | undefined) => {
    if (e && e.key === 'Enter') {
      console.log('Enter');
    }
  };

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    setSearchText(e?.target.value || '');
  };

  const login = async () => {
    const eth = window.ethereum;
    console.log(eth);
    eth
      .request({ method: 'eth_requestAccounts' })
      .then(async (account: string[]) => {
        const res = await QueryNonce(account[0]);
        if (res.code === 0) {
          const nonce = res.data.nonce;
          console.log(nonce);
          const message = `Hello, welcome to wyt-network.\nPlease sign this message to verify your wallet.\nThis action will not cost you any transaction fee.\nNonce: ${nonce}`;
          const ethResult = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, account[0], ''],
          });
          const loginResult = await LoginWithSignature(ethResult, account[0]);
          if (loginResult.code === 0) {
            reqConfig.token = loginResult.data.token;
            localStorage.setItem('token', reqConfig.token);
            localStorage.setItem('address', account[0]);
            localStorage.setItem('expired_date', loginResult.data.expired_date);
            dispatch({
              type: SET_ISLOGIN,
              payload: true,
            });
            dispatch({
              type: SET_ACCOUNT,
              payload: account[0],
            });
            setInterval(
              async () => {
                const refreshResult = await RefreshToken();
                if (refreshResult.code === 0) {
                  reqConfig.token = refreshResult.data.token;
                  localStorage.setItem('token', refreshResult.data.token);
                  localStorage.setItem(
                    'expired_date',
                    refreshResult.data.expired_date,
                  );
                }
              },
              1000 * 60 * 20,
            );
          }
        }
      });
  };

  return (
    <Providers>
      <div>
        {isLogin && (
          <div className="w-full h-11 bg-purple-300 text-center py-3 text-white text-sm font-normal">
            Access Pro Version on{' '}
            <a
              onClick={() => {
                history.push('/chat');
              }}
              className="cursor-pointer"
            >
              wyt.network/pro
            </a>
          </div>
        )}
        <div className="flex h-full overflow-hidden">
          <div id="user-container" className="w-full h-screen overflow-y-auto">
            <div
              className="shadow h-16 pl-4 flex flex-col w-full fixed bg-white"
              style={{ zIndex: 1000 }}
            >
              <div className="pt-4 flex">
                <div className="flex items-center justify-start mx-4">
                  <img
                    style={{ width: 128 }}
                    src={LogoSrc}
                    alt="logo"
                    className="cursor-pointer"
                    onClick={() => {
                      history.push('/home');
                    }}
                  />
                </div>
                <Search
                  className="mt-2 hover:cursor-pointer ml-auto"
                  width={20}
                  height={20}
                />
                <Select
                  value={searchValue === '' ? undefined : searchValue}
                  loading={searchLoading}
                  bordered={false}
                  placeholder="Search"
                  className="ml-2 focus:outline-none w-48 mt-0.5"
                  showSearch
                  suffixIcon={null}
                  filterOption={false}
                  onSelect={(value: string) => {
                    console.log(value);
                    history.push({
                      pathname: '/detail',
                      query: {
                        id: value,
                      },
                    });
                    setSearchValue('');
                  }}
                  onSearch={handleSearch}
                  notFoundContent={null}
                  onChange={(newValue: string) => {
                    // setSearchValue(newValue);
                  }}
                >
                  {searchData.map((data: any) => {
                    return (
                      <Option
                        key={data.value}
                        value={data.value}
                        label={data.label}
                        className="hover:text-white hover:bg-purple-500"
                      >
                        <div className="flex">
                          <Image
                            preview={false}
                            src={data.logo}
                            className="rounded-full mt-1"
                            width={16}
                          />
                          <div className="ml-2">{data.label}</div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
                {!isLogin && (
                  <button
                    // Updated to open the modal instead of directly calling login
                    onClick={openModal}
                    className="ml-auto mr-4 bg-purple-500 px-4 py-1.5 rounded-lg text-white text-base font-medium hover:bg-purple-300 active:bg-purple-700"
                  >
                    {formatMessage({ id: 'CONNECT_WALLET' })}
                  </button>
                )}
                {isLogin && (
                  <div className="ml-5 mr-10 mt-1">
                    <Setting
                      onClick={() => history.push('/admins/')}
                      className="cursor-pointer"
                      width={24}
                    />
                  </div>
                )}
              </div>
            </div>
            {props.children}
            <div className="h-px bg-gray-200 w-full" />
            <div className="px-14 py-8" style={{ background: '#f9fafb' }}>
              <div className="flex">
                <div>
                  <img style={{ width: 140 }} src={LogoSrc} alt="logo" />
                  <div
                    className="text-sm font-normal text-gray-500 mt-4"
                    style={{ width: 320 }}
                  >
                    Embrace the wyt-network revolution and reimagine your Web3
                    investing journey.
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="text-base font-normal text-gray-800">
                    Market
                  </div>
                  <div className="mt-6 cursor-pointer text-gray-500 font-normal text-base">
                    Home
                  </div>
                </div>
                <div className="ml-40">
                  <div className="text-base font-normal text-gray-800">
                    My account
                  </div>
                  <div className="mt-6 cursor-pointer text-gray-500 font-normal text-base">
                    Profile
                  </div>
                  <div className="mt-4 cursor-pointer text-gray-500 font-normal text-base">
                    setting
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-200 w-full mt-24" />
              <div className="w-full text-center mt-3 text-gray-500 text-xs">
                Copyright © 2023-2025 wyt.network
              </div>
            </div>
          </div>
        </div>
        <NativeModal
          openModal={isModalOpen}
          closeModal={closeModal}
          className={'w-full max-w-[500px]'}
        >
          <ConnectWalletModal closeModal={closeModal} />
        </NativeModal>
      </div>
    </Providers>
  );
};

export default connect((state: { user: UserModel }) => ({
  isLogin: state.user.isLogin,
}))(Layout);
