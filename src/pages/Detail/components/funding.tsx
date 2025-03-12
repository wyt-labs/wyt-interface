import { Image } from 'antd';
import DefaultAvatar from '@/assets/avatar.png';
import { fundingRestoreParams } from '@/services/project';
import { showBriefAmount, toThousands } from '@/utils/tools';

const Funding = (props: { info: fundingRestoreParams | undefined }) => {
  const { info } = props;

  console.log(info?.funding_details);

  return (
    <>
      <div className="mt-4 px-4">
        <div className="mt-4 text-xl font-bold text-gray-700">
          Top Investors & KOL
        </div>
        <div className="flex mt-4">
          {(info?.top_investors || []).map((investor, index) => {
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
          {(info?.top_investors || []).length === 0 && <div>-</div>}
        </div>
        <div className="mt-8 text-xl font-bold text-gray-700">Summary</div>
        <div className="flex mt-4 justify-start">
          <div className="border border-solid rounded-2xl border-gray-300 py-6 px-8 w-80">
            <div className="text-gray-700 text-base font-bold">
              Funding round
            </div>
            <div className="mt-2 text-2xl font-bold">
              {info?.funding_details?.length ?? '-'}
            </div>
          </div>
          <div className="border border-solid rounded-2xl border-gray-300 py-6 px-8 w-80 ml-4">
            <div className="text-gray-700 text-base font-bold">
              Total funding amount
            </div>
            <div className="mt-2 text-2xl font-bold">
              {(info?.funding_details || []).length > 0
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
          <div className="border border-solid rounded-2xl border-gray-300 py-6 px-8 w-80 ml-4">
            <div className="text-gray-700 text-base font-bold">
              Large Funding
            </div>
            <div className="mt-2 text-2xl font-bold">
              {(info?.funding_details || []).length > 0
                ? `$ ${showBriefAmount(
                    info?.funding_details.reduce((maxValue, obj) => {
                      return obj.amount > maxValue ? obj.amount : maxValue;
                    }, -1) || 0,
                  )}`
                : '-'}
            </div>
          </div>
          <div className="border border-solid rounded-2xl border-gray-300 py-6 px-8 w-80 ml-4">
            <div className="text-gray-700 text-base font-bold">
              Latest Funding
            </div>
            <div className="mt-2 text-2xl font-bold">
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
        <div className="mt-8 text-xl font-bold text-gray-700">
          Funding Details
        </div>
        <div className="mt-4 border border-solid rounded-2xl p-6">
          <div
            className="flex h-11 bg-gray-50"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <div
              className="text-xs font-semibold text-gray-500 pl-8 pt-4"
              style={{ width: '15%' }}
            >
              ROUND
            </div>
            <div
              className="ml-12 text-xs font-semibold text-gray-500 pt-4"
              style={{ width: '15%' }}
            >
              DATA
            </div>
            <div
              className="ml-12 text-xs font-semibold text-gray-500 pt-4"
              style={{ width: '20%' }}
            >
              AMOUNT
            </div>
            <div
              className="ml-12 text-xs font-semibold text-gray-500 pt-4"
              style={{ width: '20%' }}
            >
              VALUATION
            </div>
            <div
              className="ml-20 text-xs font-semibold text-gray-500 pt-4"
              style={{ width: '30%' }}
            >
              INVESTORS
            </div>
          </div>
          {(info?.funding_details || []).map((detail, index) => {
            return (
              <>
                <div key={detail.round} className="flex py-4">
                  <div className="pl-8 flex flex-row" style={{ width: '15%' }}>
                    <div className="text-xs font-semibold text-gray-500 my-auto">
                      {detail.round}
                    </div>
                  </div>
                  <div className="ml-12 flex flex-row" style={{ width: '15%' }}>
                    <div className="text-xs font-semibold text-gray-500 my-auto">
                      {detail.date}
                    </div>
                  </div>
                  <div className="ml-12 flex flex-row" style={{ width: '20%' }}>
                    <div className="text-xs font-semibold text-gray-500 my-auto">
                      {`$ ${toThousands(detail.amount)}`}
                    </div>
                  </div>
                  <div className="ml-12 flex flex-row" style={{ width: '20%' }}>
                    <div className="text-xs font-semibold text-gray-500 my-auto">
                      {`$ ${toThousands(detail.valuation)}`}
                    </div>
                  </div>
                  <div
                    className="ml-20 text-xs font-semibold text-gray-600"
                    style={{ width: '30%' }}
                  >
                    {detail.investors}
                  </div>
                </div>
                {index !== (info?.funding_details || []).length - 1 && (
                  <div className="h-px bg-gray-200 w-full" />
                )}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Funding;
