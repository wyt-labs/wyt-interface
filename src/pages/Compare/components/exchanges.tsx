import ExchangeAvatar from '@/components/ExchangeAvatar';
import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import { useState } from 'react';
import { exchangesParams } from '@/services/project';

const Exchanges = (props: { infos: (exchangesParams | undefined)[] }) => {
  const { infos } = props;
  const [isMore, setIsMore] = useState([false, false, false]);
  return (
    <>
      <div className="flex mt-1">
        {infos.map((info, index) => {
          return (
            <div
              key={`enchanges-${index}`}
              className={`w-1/2 ${index > 0 ? 'ml-5' : ''}`}
            >
              <div className="w-full rounded-xl before-sticky-shadow bg-white text-center text-sm text-gray-900 py-5 sticky top-20 z-50">
                EXCHANGES
              </div>
              <div className="w-full rounded-xl bg-white mt-1 py-5 flex justify-center">
                <ExchangeAvatar exchange={info?.binance_link ?? ''} type={1} />
                <ExchangeAvatar exchange={info?.okx_link ?? ''} type={2} />
                <ExchangeAvatar exchange={info?.coinbase_link ?? ''} type={3} />
                {/* <div className="flex flex-col ml-2">
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
                      <MoreIcon style={{ stroke: 'white', margin: 'auto' }} />
                    </div>
                  )}
                  <div className="text-gray-500 mt-1.5 text-xs text-center">
                    More
                  </div>
                </div> */}
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

export default Exchanges;
