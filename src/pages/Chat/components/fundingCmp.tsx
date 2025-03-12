import { showBriefAmount } from '@/utils/tools';
import { Image } from 'antd';

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
const FundingCmp = (props: { info: fundingProps }) => {
  const { info } = props;

  return (
    <>
      <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full flex justify-between">
        <div>
          <div className="text-xs text-gray-400">Funding round</div>
          <div className="text-sm text-gray-700 font-bold mt-1">
            {info.highlights.funding_rounds}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total funding amount</div>
          <div className="text-sm text-gray-700 font-bold mt-1">
            {`$ ${showBriefAmount(info.highlights.total_funding_amount)}`}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full justify-between">
        <div
          className="text-sm text-gray-500 text-center"
          style={{ opacity: (info.top_investors || []).length === 0 ? 0 : 1 }}
        >
          INVESTORS
        </div>
        <div className="flex mt-4 h-24 justify-center">
          {(info.top_investors || []).length === 0 && (
            <div className='mt-4 text-gray-500 text-sm font-normal'>No INVESTORS INFO</div>
          )}
          {(info.top_investors || []).length > 0 &&
            info.top_investors.slice(0, 3).map((data) => {
              return (
                <div key={data.id} className="w-16 text-center">
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
          {(info.top_investors || []).length > 3 && (
            <div className="w-16 text-center">
              <div className="rounded-full h-16 w-16 pt-5 text-gray-600 bg-gray-300 mx-auto">{`+ ${
                (info.top_investors || []).length - 3
              }`}</div>
              <div className="text-gray-500 mt-1 text-xs">More</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FundingCmp;
