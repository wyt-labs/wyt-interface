import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import InvestorAvatar from '@/components/InvestorAvatar';
import { fundingRestoreParams } from '@/services/project';
import { showBriefAmount } from '@/utils/tools';
import { useState } from 'react';
import { history } from 'umi';

const Funding = (props: { ids: string[]; infos: fundingRestoreParams[] }) => {
  const { infos, ids } = props;
  const [isMore, setIsMore] = useState([false, false, false]);
  return (
    <>
      <div className="flex mt-3">
        {infos.map((info, index) => {
          return (
            <div
              key={`funding-${index}`}
              className={`w-1/2 ${index > 0 ? 'ml-5' : ''}`}
            >
              <div className="w-full rounded-xl before-sticky-shadow bg-white flex text-sm text-gray-900 py-5 sticky top-20 z-50">
                <div className="ml-auto">FUND RAISING ROUNDS</div>
                <div className="ml-auto text-gray-500 text-xs mt-0.5">
                  View Details
                </div>
                <MoreIcon
                  onClick={() => {
                    history.push({
                      pathname: '/detail',
                      query: {
                        id: ids[index],
                        tab: '4',
                      },
                    });
                  }}
                  className="ml-1 mr-4 cursor-pointer"
                />
              </div>
              <div className="w-full rounded-xl bg-white mt-1 py-5 flex justify-evenly">
                <div>
                  <div className="text-xs text-gray-400">Funding Rounds</div>
                  <div className="text-sm font-bold mt-1">
                    {info.funding_details?.length || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">
                    Total Funding Amount
                  </div>
                  <div className="text-sm font-bold mt-1">
                    {(info.funding_details || []).length > 0
                      ? `$ ${showBriefAmount(
                          info?.funding_details.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.amount;
                            },
                            0,
                          ) || 0,
                        )}`
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Current Valuation</div>
                  <div className="text-sm font-bold mt-1">
                    {(info?.funding_details || []).length > 0
                      ? `$ ${showBriefAmount(
                          info?.funding_details[
                            (info?.funding_details || []).length - 1
                          ].valuation || 0,
                        )}`
                      : '-'}
                  </div>
                </div>
              </div>
              <div className="w-full rounded-xl bg-white mt-1 py-5">
                <div className="text-gray-400 text-center text-sm">
                  Investors
                </div>
                <div className="flex justify-center mt-5 h-28">
                  {(info.top_investors || []).slice(0, 3).map((investor) => {
                    return (
                      <InvestorAvatar investor={investor} key={investor.id} />
                    );
                  })}
                  {(info.top_investors || []).length === 0 && <div>-</div>}
                  {(info.top_investors || []).length > 3 && (
                    <div className="flex flex-col ml-2">
                      {!isMore[index] && (
                        <div
                          onMouseEnter={() => {
                            setIsMore([
                              ...isMore.slice(0, index),
                              true,
                              ...isMore.slice(index + 1),
                            ]);
                          }}
                          className="text-center rounded-full w-14 h-14 text-gray-500 pt-4 cursor-pointer"
                          style={{ backgroundColor: '#E9E9E9' }}
                        >
                          +12
                        </div>
                      )}
                      {isMore[index] && (
                        <div
                          onMouseLeave={() => {
                            setIsMore([
                              ...isMore.slice(0, index),
                              false,
                              ...isMore.slice(index + 1),
                            ]);
                          }}
                          className="text-center rounded-full w-14 h-14 bg-purple-500 cursor-pointer"
                          style={{ paddingTop: 18 }}
                        >
                          <MoreIcon
                            style={{ stroke: 'white', margin: 'auto' }}
                          />
                        </div>
                      )}
                      <div className="text-gray-500 mt-1.5 text-xs text-center">
                        More
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {infos.length === 1 && (
          <div className="ml-5 w-1/2 bg-gray-100 rounded-xl text-center flex flex-col">
            <div className="m-auto text-gray-300">Add a project first</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Funding;
