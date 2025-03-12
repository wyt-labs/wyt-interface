import { Image } from 'antd';
import TokenUnlock from '@/assets/token_unlocks.png';
import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import { profitabilityParams } from '@/services/project';

const Profitability = (props: { info: profitabilityParams | undefined }) => {
  const { info } = props;

  return (
    <>
      <div className="mt-4 px-4">
        <div className="mt-4 text-xl font-bold text-gray-700">
          Financial Statement
        </div>
        {(info?.financial_statement_link || '') !== '' && (
          <div
            onClick={() => {
              window.open(info?.financial_statement_link);
            }}
            className="mt-4 bg-gray-50 rounded-lg py-2 px-4 cursor-pointer w-52"
          >
            <Image src={TokenUnlock} width={24} />
            <div className="flex mt-2">
              <div>Financial Statement</div>
              <MoreIcon width={16} className="mt-px ml-2" />
            </div>
          </div>
        )}
        {(info?.financial_statement_link || '') === '' && <div className='mt-2'>-</div>}
        <div className="mt-8 text-xl font-bold text-gray-700">Revenue</div>
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
              style={{ width: '25%' }}
            >
              REVENUE MODE
            </div>
            <div
              className="ml-12 text-xs font-semibold text-gray-500 pt-4"
              style={{ width: '20%' }}
            >
              REVENUE INCOME
            </div>
            <div
              className="ml-20 text-xs font-semibold text-gray-500 pt-4"
              style={{ width: '55%' }}
            >
              DESCRIPTION
            </div>
          </div>
          {(info?.business_models || []).length > 0 &&
            (info?.business_models || []).map((model, index) => {
              return (
                <>
                  <div className="flex py-4">
                    <div
                      className="pl-8 flex flex-row"
                      style={{ width: '25%' }}
                    >
                      <div className="text-xs font-semibold text-gray-500 my-auto">
                        {model.model}
                      </div>
                    </div>
                    <div
                      className="ml-12 flex flex-row"
                      style={{ width: '20%' }}
                    >
                      <div className="text-xs font-semibold text-gray-500 my-auto">
                        {`${toThousands(model.annual_income)} USD`}
                      </div>
                    </div>
                    <div
                      className="ml-20 text-xs font-semibold text-gray-600"
                      style={{ width: '55%' }}
                    >
                      {model.description}
                    </div>
                  </div>
                  {index !== (info?.business_models || []).length - 1 && (
                    <div className="h-px w-full bg-gray-200" />
                  )}
                </>
              );
            })}
          {(info?.business_models || []).length === 0 && (
            <div className="flex py-4">
              <div className="pl-8 flex flex-row" style={{ width: '25%' }}>
                <div className="text-xs font-semibold text-gray-500 my-auto">
                  -
                </div>
              </div>
              <div className="ml-12 flex flex-row" style={{ width: '20%' }}>
                <div className="text-xs font-semibold text-gray-500 my-auto">
                  -
                </div>
              </div>
              <div
                className="ml-20 text-xs font-semibold text-gray-600"
                style={{ width: '55%' }}
              >
                -
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profitability;
