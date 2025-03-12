import { useEffect, useState } from 'react';
import { Image, Popover, Tabs, TabsProps } from 'antd';
import { ReactComponent as NoInvestor } from '@/assets/svg/no_invstor.svg';
import { getProjectDetail } from '@/services/project';

const TableCard = (props: { id: string }) => {
  const { id } = props;
  const [detail, setDetail] = useState<restoreProjectParams | null>(null);
  useEffect(() => {
    const getDetail = async () => {
      const detailResult = await getProjectDetail(id);
      if (detailResult?.code === 0) {
        setDetail(detailResult.data);
      }
    };
    getDetail();
  }, [id]);

  return (
    <>
      <div style={{ width: 800 }} className='p-5'>
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
            </div>
            <div className="mt-2.5 text-sm font-normal text-gray-500 max-w-lg">
              {detail?.basic.description.length > 200
                ? detail?.basic.description.slice(0, 200) + '...'
                : detail?.basic.description}
            </div>
            <div className="flex mt-5">
              <div>
                <div className="text-sm text-gray-500">Team background:</div>
                <div className="flex mt-2">
                  {(detail?.team.impressions || []).length === 0 && (
                    <div>-</div>
                  )}
                  {(detail?.team.impressions || [])
                    .slice(0, 3)
                    .map((impression) => {
                      return (
                        <div
                          key={impression.id}
                          className="px-2 py-1 text-xs rounded bg-green-50 text-green-500"
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
                        className="px-2 py-1 text-xs rounded bg-green-50 text-green-500"
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
                  {(detail?.basic.tags || []).slice(0, 3).map((tag, index) => {
                    return (
                      <div
                        key={tag.id}
                        className={`${
                          index > 0 ? 'ml-1' : ''
                        } px-2 py-1 text-xs rounded bg-green-50 text-green-500`}
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
            <div className="flex">
              <div className="text-sm text-gray-500 ml-auto">{`${detail?.tokenomics.token_symbol} price`}</div>
            </div>
            <div className="text-4xl font-bold mt-1 ml-auto text-right">
              {`$ ${detail?.basic.coin?.current_price || '-'}`}
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
                    NO CHAIN YET
                  </div>
                </div>
              )}
              {(detail?.basic.chains || []).slice(0, 5).map((chain, index) => {
                return (
                  <div
                    key={chain.id}
                    className={`text-center ${index > 0 ? 'ml-4' : ''}`}
                  >
                    <Image
                      src={chain.logo_url}
                      className="rounded w-16"
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
              {(detail?.basic.chains || []).length > 4 && (
                <div className="flex flex-col ml-4">
                  <Popover
                    placement="top"
                    title={'Chains'}
                    content={(detail?.basic.chains || [])
                      .slice(4)
                      .map((chain) => {
                        return chain.name;
                      })
                      .join(',')}
                  >
                    <div
                      className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 pt-4 cursor-pointer"
                      style={{ backgroundColor: '#E9E9E9' }}
                    >
                      {`+${(detail?.basic.chains || []).length - 4}`}
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
                  return d.type === 1;
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
                    NO INVESTOR YET
                  </div>
                </div>
              )}
              {(
                detail?.funding.top_investors.filter((d) => {
                  return d.type === 1;
                }) || []
              ).map((investor, index) => {
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
                  return d.type === 1;
                }) || []
              ).length > 4 && (
                <div className="flex flex-col ml-4">
                  <Popover
                    placement="top"
                    title={'Chains'}
                    content={(detail?.funding.top_investors || [])
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
                      {`+${(detail?.basic.chains || []).length - 4}`}
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
                  return d.type === 0;
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
                  return d.type === 0;
                }) || []
              )
                .slice(0, 2)
                .map((investor, index) => {
                  return (
                    <div
                      key={investor.id}
                      className={`text-center ${index > 0 ? 'ml-1' : ''}`}
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
                  return d.type === 0;
                }) || []
              ).length > 2 && (
                <div className="flex flex-col ml-4">
                  <Popover
                    placement="top"
                    title={'Chains'}
                    content={(
                      detail?.funding.top_investors.filter((d) => {
                        return d.type === 0;
                      }) || []
                    )
                      .slice(2)
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
                            return d.type === 0;
                          }) || []
                        ).length - 2
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
        <div className="text-center mt-6 text-gray-300">
          {`Token Issuance Date: ${' '}`}
          <span className="text-gray-500">
            {detail?.tokenomics.token_issuance_date === ''
              ? '-'
              : detail?.tokenomics.token_issuance_date}
          </span>
        </div>
      </div>
    </>
  );
};

export default TableCard;
