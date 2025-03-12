import { Image, Popover, Tabs, TabsProps, Tooltip } from 'antd';
import DefaultAvatar from '@/assets/avatar.png';
import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import { ReactComponent as GithubIcon } from '@/assets/svg/detail/github_icon.svg';
import { ReactComponent as FacebookIcon } from '@/assets/svg/detail/facebook_icon.svg';
import { ReactComponent as TwitterIcon } from '@/assets/svg/detail/twitter_icon.svg';
import { ReactComponent as DiscordIcon } from '@/assets/svg/detail/discord_icon.svg';
import { ReactComponent as NoInvestor } from '@/assets/svg/no_invstor.svg';
import Tokennomics from './components/tokenomics';
import Profitability from './components/profitability';
import Team from './components/team';
import Funding from './components/funding';
import Exchanges from './components/exchanges';
import Ecosystem from './components/ecosystem';
import MoreInfo from './components/more_info';
import { useEffect, useState } from 'react';
import {
  getProjectDetail,
  restoreProjectParams,
  updateProjectParams,
} from '@/services/project';
import { IRouteComponentProps, connect } from 'umi';
import CompareFloatButton from '@/components/CompareFloatButton';
import { UserModel } from '@/utils/model';
import { UmiComponentProps } from '@/utils/common';
import { SET_COMPARES } from '@/utils/reducer';
import { trackColorArray } from '@/utils/constants';
import { getHashIndex } from '@/utils/tools';
import { showBriefAmount } from '@/utils/tools';

const Detail = (props: IRouteComponentProps & UmiComponentProps) => {
  const { location, dispatch, compares } = props;
  const [first, setFirst] = useState(true);
  const [detail, setDetail] = useState<restoreProjectParams | null>(null);

  const openLink = (type: string) => {
    if (
      detail &&
      detail.related_links.filter((link) => {
        return link.type === type;
      }).length > 0
    ) {
      window.open(
        detail?.related_links.filter((link) => {
          return link.type === type;
        })[0].link,
      );
    }
  };

  useEffect(() => {
    const getDetail = async () => {
      const detailResult = await getProjectDetail(location.query.id as string);
      console.log(detailResult);
      if (detailResult.code === 0) {
        setDetail(detailResult.data);
      }
    };
    getDetail();
    setFirst(false);
  }, [location]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <div className="text-2xl font-bold">Tokenomics</div>,
      children: (
        <Tokennomics
          info={detail?.tokenomics}
          unlock_url={
            (detail?.related_links || []).filter(
              (link) => link.type === 'TokenUnlocks',
            ).length > 0
              ? (detail?.related_links || []).filter(
                  (link) => link.type === 'TokenUnlocks',
                )[0].link
              : undefined
          }
        />
      ),
    },
    {
      key: '2',
      label: <div className="text-2xl font-bold">Profitability</div>,
      children: <Profitability info={detail?.profitability} />,
    },
    {
      key: '3',
      label: <div className="text-2xl font-bold">Team</div>,
      children: <Team info={detail?.team} />,
    },
    {
      key: '4',
      label: <div className="text-2xl font-bold">Funding</div>,
      children: <Funding info={detail?.funding} />,
    },
    {
      key: '5',
      label: <div className="text-2xl font-bold">Exchanges</div>,
      children: <Exchanges info={detail?.exchanges} />,
    },
    {
      key: '6',
      label: <div className="text-2xl font-bold">Ecosystem</div>,
      children: <Ecosystem info={detail?.ecosystem} />,
    },
    {
      key: '7',
      label: <div className="text-2xl font-bold">More Info</div>,
      children: <MoreInfo info={detail?.socials} />,
    },
  ];

  return (
    <>
      <div
        className="px-14 py-6 mt-16"
        style={{
          background:
            'linear-gradient(180deg, #D1D5DB 0%, rgba(209, 213, 219, 0.61) 0.01%,  white 40%, white 100%)',
        }}
      >
        <div className="bg-white border border-solid rounded-2xl shadow-md p-8">
          <div className="flex">
            <div>
              <div className="flex">
                <Image
                  src={detail?.basic.logo_url}
                  className="rounded-full"
                  preview={false}
                  width={48}
                  height={48}
                />
                <div className="ml-4 mt-2 text-3xl font-bold">
                  {detail?.basic.name}
                </div>
                {detail?.tokenomics.token_symbol !== '' && (
                  <div className="ml-3 mt-1 pt-2 h-10 px-4 text-gray-500 bg-gray-100 rounded-lg">
                    {detail?.tokenomics.token_symbol}
                  </div>
                )}
                {compares.length < 3 &&
                  compares.filter((c: any) => c.id === detail?.id).length ===
                    0 && (
                    <div
                      onClick={() => {
                        dispatch({
                          type: SET_COMPARES,
                          payload: [
                            ...compares,
                            {
                              id: detail?.id,
                              name: detail?.basic.name,
                              logo: detail?.basic.logo_url,
                            },
                          ],
                        });
                      }}
                      className="bg-purple-500 color-white rounded-lg h-10 px-6 py-2 mt-1 ml-5 text-white cursor-pointer hover:bg-purple-300 active:bg-purple-700"
                    >
                      + Compare
                    </div>
                  )}
              </div>
              <div className="mt-2.5 text-sm font-normal text-gray-500 max-w-4xl">
                {detail?.basic.description}
              </div>
              <div className="flex mt-5">
                <div className="h-8 pt-1.5 rounded-lg px-3 bg-purple-100 text-sm text-purple-700">
                  {`Rank#${detail?.rank || '-'}`}
                </div>
                {(detail?.related_links || []).filter(
                  (link) => link.type === 'Whitepaper',
                ).length > 0 && (
                  <div className="ml-2 h-8 pt-1.5 rounded-lg px-3 text-sm bg-gray-100 text-gray-900 flex cursor-pointer hover:bg-gray-300 hover:text-gray-500 active:bg-gray-300 active:border-gray-500 border active:text-gray-700">
                    White Paper{' '}
                    <span className="ml-2">
                      <MoreIcon />
                    </span>
                  </div>
                )}
                <div
                  onClick={() => {
                    openLink('Official Website');
                  }}
                  className="ml-2 h-8 pt-1.5 rounded-lg px-3 text-sm bg-gray-100 text-gray-900 flex cursor-pointer hover:bg-gray-300 hover:text-gray-500 active:bg-gray-300 active:border-gray-500 border border-gray-100 active:text-gray-700"
                >
                  Website{' '}
                  <span className="ml-2">
                    <MoreIcon />
                  </span>
                </div>
                {(detail?.related_links || []).filter((link) => {
                  return link.type === 'GitHub';
                }).length > 0 && (
                  <div
                    onClick={() => {
                      openLink('GitHub');
                    }}
                    className="ml-2 h-8 pt-1.5 rounded-lg px-3 text-sm bg-gray-100 text-gray-900 flex cursor-pointer"
                  >
                    <span className="mr-2" style={{ marginTop: -1.5 }}>
                      <GithubIcon />
                    </span>
                    Opensource
                  </div>
                )}
                {((detail?.related_links || []).filter((link) => {
                  return link.type === 'Facebook';
                }).length > 0 ||
                  (detail?.related_links || []).filter((link) => {
                    return link.type === 'Twitter';
                  }).length > 0 ||
                  (detail?.related_links || []).filter((link) => {
                    return link.type === 'Discord';
                  }).length > 0) && (
                  <div className="ml-2 h-8 pt-1.5 rounded-lg px-4 text-sm bg-gray-100 text-gray-900 flex cursor-pointer">
                    {(detail?.related_links || []).filter((link) => {
                      return link.type === 'Facebook';
                    }).length > 0 && (
                      <span className="mr-2" style={{ marginTop: -1.5 }}>
                        <Tooltip title="Facebook">
                          <FacebookIcon
                            onClick={() => {
                              openLink('Facebook');
                            }}
                          />
                        </Tooltip>
                      </span>
                    )}
                    {(detail?.related_links || []).filter((link) => {
                      return link.type === 'Twitter';
                    }).length > 0 && (
                      <span className="mr-2" style={{ marginTop: -1.5 }}>
                        <Tooltip title="Twitter">
                          <TwitterIcon
                            onClick={() => {
                              openLink('Twitter');
                            }}
                          />
                        </Tooltip>
                      </span>
                    )}
                    {(detail?.related_links || []).filter((link) => {
                      return link.type === 'Discord';
                    }).length > 0 && (
                      <span className="mr-2" style={{ marginTop: -1.5 }}>
                        <Tooltip title="Discord">
                          <DiscordIcon
                            onClick={() => {
                              openLink('Discord');
                            }}
                          />
                        </Tooltip>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex mt-5">
                <div>
                  <div className="text-sm text-gray-500">Team background:</div>
                  <div className="flex mt-2">
                    {(detail?.team.impressions || []).length === 0 && (
                      <div>-</div>
                    )}
                    {(detail?.team.impressions || [])
                      .slice(0, 2)
                      .map((impression) => {
                        return (
                          <div
                            key={impression.id}
                            className={`px-2 py-1 text-xs rounded ${
                              trackColorArray[
                                getHashIndex(
                                  impression.name,
                                  trackColorArray.length,
                                )
                              ]
                            }`}
                          >
                            {impression.name}
                          </div>
                        );
                      })}
                    {(detail?.team.impressions || []).length > 2 && (
                      <div className="text-purple-500 cursor-pointer ml-3 text-xs mt-1">
                        View all
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-7">
                  <div className="text-sm text-gray-500">Tracks:</div>
                  <div className="flex mt-2">
                    {(detail?.basic.tracks || []).length === 0 && <div>-</div>}
                    {(detail?.basic.tracks || []).slice(0, 3).map((track) => {
                      return (
                        <div
                          key={track.id}
                          className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-500 mr-1"
                        >
                          {track.name}
                        </div>
                      );
                    })}
                    {(detail?.basic.tracks || []).length > 2 && (
                      <div className="text-purple-500 cursor-pointer ml-3 text-xs mt-1">
                        View all
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-7">
                  <div className="text-sm text-gray-500">Tags:</div>
                  <div className="flex mt-2">
                    {(detail?.basic.tags || []).length === 0 && <div>-</div>}
                    {(detail?.basic.tags || [])
                      .slice(0, 3)
                      .map((tag, index) => {
                        return (
                          <div
                            key={tag.id}
                            className={`${
                              index > 0 ? 'ml-1' : ''
                            } px-2 py-1 text-xs rounded bg-gray-50 text-gray-500`}
                          >
                            {tag.name}
                          </div>
                        );
                      })}
                    {(detail?.basic.tags || []).length > 2 && (
                      <div className="text-purple-500 cursor-pointer ml-3 text-xs mt-1">
                        View all
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <div
                onClick={() => {
                  if (detail?.exchanges?.binance_link !== '') {
                    window.open(detail?.exchanges?.binance_link);
                  }
                }}
                className="text-4xl font-bold mt-1 ml-auto text-right cursor-pointer"
              >
                {`$ ${detail?.basic.coin?.current_price || '-'}`}
              </div>
              <div className="flex mt-3">
                {(detail?.related_links || []).filter(
                  (link) => link.type === 'Explorer',
                ).length > 0 && (
                  <div className="h-8 pt-1.5 rounded-lg px-3 text-sm bg-gray-100 text-gray-500 flex cursor-pointer">
                    Explorer{' '}
                    <span className="ml-2">
                      <MoreIcon />
                    </span>
                  </div>
                )}
                <div className="ml-2 h-8 pt-1.5 rounded-lg px-3 text-sm bg-gray-100 text-gray-500 flex cursor-pointer">
                  {`Token Issuance on: ${
                    detail?.tokenomics.token_issuance_date === ''
                      ? '-'
                      : detail?.tokenomics.token_issuance_date
                  }`}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 border rounded-lg border-solid border-gray-300 px-20 py-8 flex justify-evenly">
            <div>
              <div className="text-gray-700 text-sm text-center">CHAINS</div>
              <div className="flex mt-4">
                {(detail?.basic.chains || []).length === 0 && (
                  <div>
                    <div
                      className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 m-auto"
                      style={{ backgroundColor: '#E9E9E9' }}
                    >
                      <NoInvestor />
                    </div>
                    <div className="text-gray-500 text-sm mt-2 text-center">
                      No CHAIN YET
                    </div>
                  </div>
                )}
                {(detail?.basic.chains || [])
                  .slice(0, 3)
                  .map((chain, index) => {
                    return (
                      <div
                        key={chain.id}
                        className={`text-center ${index > 0 ? 'ml-4' : ''}`}
                      >
                        <Image
                          src={chain.logo_url}
                          className="rounded-full w-16"
                          preview={false}
                          width={56}
                          height={56}
                        />
                        <div className="text-gray-500 text-sm mt-1">
                          {chain.name}
                        </div>
                      </div>
                    );
                  })}
                {(detail?.basic.chains || []).length > 3 && (
                  <div className="flex flex-col ml-4">
                    <Popover
                      placement="top"
                      title={'Chains'}
                      content={(detail?.basic.chains || [])
                        .slice(3)
                        .map((chain) => {
                          return chain.name;
                        })
                        .join(',')}
                    >
                      <div
                        className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 pt-4 cursor-pointer"
                        style={{ backgroundColor: '#E9E9E9' }}
                      >
                        {`+${(detail?.basic.chains || []).length - 3}`}
                      </div>
                    </Popover>
                    <div className="text-gray-500 text-sm mt-2 text-center">
                      More
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-px h-28 mt-1 bg-gray-300" />
            <div>
              <div className="text-gray-700 text-sm text-center">INVESTORS</div>
              <div className="flex mt-4">
                {(
                  detail?.funding.top_investors.filter((d) => {
                    return d.subject === 0;
                  }) || []
                ).length === 0 && (
                  <div>
                    <div
                      className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 m-auto"
                      style={{ backgroundColor: '#E9E9E9' }}
                    >
                      <NoInvestor />
                    </div>
                    <div className="text-gray-500 text-sm mt-2 text-center">
                      No INVESTOR YET
                    </div>
                  </div>
                )}
                {(
                  detail?.funding.top_investors.filter((d) => {
                    return d.subject === 0;
                  }) || []
                )
                  .slice(0, 3)
                  .map((investor, index) => {
                    return (
                      <div
                        key={investor.id}
                        className={`text-center ${index > 0 ? 'ml-4' : ''}`}
                      >
                        <Image
                          src={investor.avatar_url}
                          className="rounded-full w-16"
                          preview={false}
                          width={56}
                          height={56}
                        />
                        <div className="text-gray-500 text-sm mt-1">
                          {investor.name}
                        </div>
                      </div>
                    );
                  })}
                {(
                  detail?.funding.top_investors.filter((d) => {
                    return d.subject === 0;
                  }) || []
                ).length > 3 && (
                  <div className="flex flex-col ml-4">
                    <Popover
                      placement="top"
                      title={'Investors'}
                      content={(detail?.funding.top_investors || [])
                        .filter((d) => {
                          return d.subject === 0;
                        })
                        .slice(3)
                        .map((investor) => {
                          return investor.name;
                        })
                        .join(',')}
                    >
                      <div
                        className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 pt-4 cursor-pointer"
                        style={{ backgroundColor: '#E9E9E9' }}
                      >
                        {`+${
                          (
                            detail?.funding.top_investors.filter((d) => {
                              return d.subject === 0;
                            }) || []
                          ).length - 3
                        }`}
                      </div>
                    </Popover>
                    <div className="text-gray-500 text-sm mt-2 text-center">
                      More
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-px h-28 mt-1 bg-gray-300" />
            <div>
              <div className="text-gray-700 text-sm text-center">
                KOL HOLD & SUPPORT
              </div>
              <div className="flex mt-4 justify-center">
                {(
                  detail?.funding.top_investors.filter((d) => {
                    return d.subject === 1;
                  }) || []
                ).length === 0 && (
                  <div>
                    <div
                      className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 m-auto"
                      style={{ backgroundColor: '#E9E9E9' }}
                    >
                      <NoInvestor />
                    </div>
                    <div className="text-gray-500 text-sm mt-2 text-center">
                      NO KOL YET
                    </div>
                  </div>
                )}
                {(
                  detail?.funding.top_investors.filter((d) => {
                    return d.subject === 1;
                  }) || []
                )
                  .slice(0, 3)
                  .map((investor, index) => {
                    return (
                      <div
                        key={investor.id}
                        className={`text-center ${index > 0 ? 'ml-4' : ''}`}
                      >
                        <Image
                          src={investor.avatar_url}
                          className="rounded-full w-16"
                          preview={false}
                          width={56}
                          height={56}
                        />
                        <div className="text-gray-500 text-sm mt-1">
                          {investor.name}
                        </div>
                      </div>
                    );
                  })}
                {(
                  detail?.funding.top_investors.filter((d) => {
                    return d.subject === 1;
                  }) || []
                ).length > 3 && (
                  <div className="flex flex-col ml-4">
                    <Popover
                      placement="top"
                      title={'KOL HOLD & SUPPORT'}
                      content={(detail?.funding.top_investors || [])
                        .filter((d) => {
                          return d.subject === 1;
                        })
                        .slice(4)
                        .map((investor) => {
                          return investor.name;
                        })
                        .join(',')}
                    >
                      <div
                        className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 pt-4 cursor-pointer"
                        style={{ backgroundColor: '#E9E9E9' }}
                      >
                        {`+${
                          (
                            detail?.funding.top_investors.filter((d) => {
                              return d.subject === 1;
                            }) || []
                          ).length - 3
                        }`}
                      </div>
                    </Popover>
                    <div className="text-gray-500 text-sm mt-2 text-center">
                      More
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 flex justify-evenly py-2 mt-5">
            <div>
              <div className="text-gray-500 text-xs">Active Developers</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.active_developer_number || '-'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Ave. Transaction Fees</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.current_average_gas_used || '-'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Volume(7D)</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.volume || '-'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Market Cap</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.market_cap
                  ? `$ ${showBriefAmount(detail?.basic.coin?.market_cap)}`
                  : '-'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Market Cap ATH</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.market_cap_ath || '-'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Market Cap CL</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.market_cap_cl || '-'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Unique Address</div>
              <div className="text-gray-700 text-sm font-bold mt-1">
                {detail?.basic.coin?.unique_address_number || '-'}
              </div>
            </div>
          </div>
        </div>
        <Tabs
          defaultActiveKey={(location.query.tab as string) ?? '1'}
          className="mt-10"
          items={items}
          tabBarGutter={50}
        />
      </div>
      <CompareFloatButton />
    </>
  );
};

export default connect((state: { user: UserModel }) => ({
  isLogin: state.user.isLogin,
  compares: state.user.compares,
}))(Detail);
