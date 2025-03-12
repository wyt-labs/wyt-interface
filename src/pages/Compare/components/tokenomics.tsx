import { Affix, Image } from 'antd';
import BianceSrc from '@/assets/chat/biance.png';
import TokenGraph from './tokengraph';
import { tokenomicsParams } from '@/services/project';
import { useState } from 'react';

const Tokenomics = (props: { infos: tokenomicsParams[] }) => {
  const { infos } = props;
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="flex mt-5">
        {infos.map((info, index) => {
          return (
            <div
              key={`token-${index}`}
              className={`${infos.length > 2 ? 'w-1/3' : 'w-1/2'} ${
                index > 0 ? 'ml-5' : ''
              } flex flex-col`}
            >
              <div className="w-full rounded-xl before-sticky-shadow bg-white text-center text-sm text-gray-900 py-5 sticky top-20 z-50">
                Tokenomics
              </div>
              <div className="w-full rounded-xl bg-white flex justify-evenly mt-1 py-7">
                <div>
                  <div className="text-xs text-gray-500">Total Supply</div>
                  <div className="mt-1 text-sm font-bold">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    Circulating Supply
                  </div>
                  <div className="mt-1 text-sm font-bold">-</div>
                </div>
              </div>
              <div className="mt-1 rounded-xl bg-white p-5 flex-grow">
                <TokenGraph
                  length={infos.length}
                  distribution={info.initial_distribution}
                />
                {!showMore && (
                  <div
                    onClick={() => setShowMore(true)}
                    className="text-center cursor-pointer text-purple-500 text-xs"
                  >
                    show more
                  </div>
                )}
                {showMore && (
                  <div className="mt-5 text-sm text-gray-500">
                    {info.description}
                  </div>
                )}
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

export default Tokenomics;
