import { showBriefAmount } from '@/utils/tools';
import { Image, Popover, Tooltip } from 'antd';
import { useState } from 'react';
import { ReactComponent as NoInvestor } from '@/assets/svg/no_invstor.svg';

interface fundingProps {
  funding_details: any;
  highlights: highlightProps;
  references: string;
  top_investors: investorProps[];
}

interface highlightProps {
  funding_rounds: number;
  investors_number: number;
  large_funding_indexes: any;
  lead_investors_number: number;
  recent_funding_indexes: any;
  total_funding_amount: number;
}

interface investorProps {
  avatar_url: string;
  description: string;
  id: string;
  name: string;
  social_media_links: any;
  subject: number;
  type: number;
}

const Fundings = (props: { info: fundingProps }) => {
  const { info } = props;
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="mt-2.5 rounded-lg bg-gray-50 py-2 px-10 flex justify-around">
        <div>
          <div className="text-xs text-gray-500">Funding round</div>
          <div className="text-sm text-gray-700 font-bold mt-1">
            {(info.funding_details || []).length || '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Total funding amount</div>
          <div className="text-sm text-gray-700 font-bold mt-1">
            {(info?.funding_details || []).length > 0
              ? `$ ${showBriefAmount(
                  info?.funding_details.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.amount;
                  }, 0) || 0,
                )}`
              : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Large Funding</div>
          <div className="text-sm text-gray-700 font-bold mt-1">
            {(info?.funding_details || []).length > 0
              ? `$ ${showBriefAmount(
                  info?.funding_details.reduce((maxValue, obj) => {
                    return obj.amount > maxValue ? obj.amount : maxValue;
                  }, -1) || 0,
                )}`
              : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Latest Funding</div>
          <div className="text-sm text-gray-700 font-bold mt-1">
            {(info?.funding_details || []).length > 0
              ? `$ ${showBriefAmount(
                  info?.funding_details[
                    (info?.funding_details || []).length - 1
                  ].amount || 0,
                )}`
              : '-'}
          </div>
        </div>
      </div>
      <div className="mt-2.5 rounded-lg bg-gray-50 py-2 px-10 flex justify-center">
        {/* <div className="flex-row flex">
          <div className="my-auto text-sm text-gray-700 mr-10">INVESTORS</div>
        </div> */}
        {(info.top_investors || []).length === 0 && (
          <div className="text-center mr-2">
            <div
              className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 m-auto"
              style={{ backgroundColor: '#E9E9E9' }}
            >
              <NoInvestor />
            </div>
            <div className="text-gray-500 mt-1 text-xs">No investor yet</div>
          </div>
        )}
        {(info.top_investors || []).length > 0 &&
          info.top_investors.slice(0, 5).map((data) => {
            return (
              <div key={data.id} className="w-20 text-center mr-2">
                <Image
                  className="rounded-full mx-auto"
                  preview={false}
                  src={data.avatar_url}
                  width={56}
                  height={56}
                />
                <div className="text-gray-500 mt-1 text-xs">{data.name}</div>
              </div>
            );
          })}
        {(info.top_investors || []).length > 5 && (
          <div className="w-20 text-center mr-2">
            <div className="rounded-full h-16 w-16 pt-5 text-gray-600 bg-gray-300 mx-auto">{`+ ${
              (info.top_investors || []).length - 5
            }`}</div>
            <div className="text-gray-500 mt-1 text-xs">More</div>
          </div>
        )}
      </div>
      {!showMore && (info.funding_details || []).length > 0 && (
        <div
          onClick={() => {
            setShowMore(true);
          }}
          className="text-center mt-2.5 text-xs text-purple-500 cursor-pointer"
        >
          View Detail
        </div>
      )}
      {showMore &&
        (info.funding_details || []).map((funding: any, index: number) => {
          return (
            <div
              key={`funding-${index}`}
              className="mt-2.5 rounded-lg bg-gray-50 py-4 px-6 flex"
            >
              <div className="flex flex-col">
                <div className="text-xl font-bold mt-auto">{`#${index}`}</div>
                <div className="mt-3 text-xs text-gray-400">
                  {new Date(funding.date)
                    .toDateString()
                    .split(' ')
                    .slice(1)
                    .join(' ')}
                </div>
              </div>
              <div className="ml-8 flex flex-col w-20">
                <div className="text-sm font-bold mt-auto">
                  {showBriefAmount(funding.amount)}
                </div>
                <div className="mt-3 text-xs text-gray-400">Amount</div>
              </div>
              <div className="ml-8 flex flex-col w-20">
                <div className="text-sm font-bold mt-auto">
                  {showBriefAmount(funding.valuation) === '0'
                    ? '-'
                    : showBriefAmount(funding.valuation)}
                </div>
                <div className="mt-3 text-xs text-gray-400">Valuation</div>
              </div>
              <div className="ml-8 flex flex-col mr-6">
                <div className="w-px h-10 bg-gray-300 my-auto" />
              </div>
              {(funding.investors_refactor || []).length === 0 && (
                <div className="text-center mr-2">
                  <div
                    className="text-center rounded-full mt-0.5 w-14 h-14 text-gray-500 m-auto"
                    style={{ backgroundColor: '#E9E9E9' }}
                  >
                    <NoInvestor />
                  </div>
                  <div className="text-gray-500 mt-1 text-xs">
                    No investor yet
                  </div>
                </div>
              )}
              {(funding.investors_refactor || [])
                .slice(0, 3)
                .map((investor: any) => {
                  return (
                    <div
                      key={`investor-${investor.id}`}
                      className="text-center mr-2"
                    >
                      <Image
                        className="rounded-full mx-auto"
                        preview={false}
                        src={investor.avatar_url || NoInvestor}
                        width={32}
                        height={32}
                      />
                      <Tooltip title={investor.name}>
                        <div className="text-gray-500 mt-1 text-xs w-20 overflow-hidden whitespace-nowrap overflow-ellipsis">
                          {investor.name}
                        </div>
                      </Tooltip>
                    </div>
                  );
                })}
              {(funding.investors_refactor || []).length > 3 && (
                <Popover
                  title="Investors"
                  overlayInnerStyle={{maxWidth: 600}}
                  content={(funding.investors_refactor || [])
                    .slice(3)
                    .map((investor: any) => investor.name)
                    .join(',')}
                >
                  <div className="text-center mr-2 ml-1 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto text-xs text-gray-500 pt-2">
                      + {funding.investors_refactor.length - 3}
                    </div>
                    <div className="text-gray-500 mt-3 text-xs overflow-hidden whitespace-nowrap overflow-ellipsis">
                      More
                    </div>
                  </div>
                </Popover>
              )}
            </div>
          );
        })}
    </>
  );
};

export default Fundings;
