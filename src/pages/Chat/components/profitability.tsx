interface profitabilityProps {
  business_models: modelProps[];
  financial_statement_link: string;
  financial_statement_link_logo_url: string;
}

interface modelProps {
  model: string;
  annual_income: number;
  description: string;
}

const Profitability = (props: { info: profitabilityProps }) => {
  const toThousands = (num: number) => {
    if ((num || 0).toFixed(0) !== num.toString()) {
      return num.toString();
    }
    const numStr = (num || 0).toString().split('');
    let counter = 0;
    const result: string[] = [];
    for (let i = numStr.length - 1; i >= 0; i--) {
      counter++;
      result.unshift(numStr[i]);
      if (!(counter % 3) && i != 0) {
        result.unshift(',');
      }
    }
    return result.join('');
  };

  return (
    <>
      <div
        className="w-full mt-2.5"
        style={{ borderRadius: 20, backgroundColor: '#F9FAFB' }}
      >
        <div
          className="flex h-11"
          style={{
            backgroundColor: 'rgba(209, 213, 219, 0.3)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <div
            className="text-xs font-semibold text-gray-600 pl-8 pt-4"
            style={{ width: '25%' }}
          >
            REVENUE MODE
          </div>
          <div
            className="ml-12 text-xs font-semibold text-gray-600 pt-4"
            style={{ width: '20%' }}
          >
            REVENUE INCOME
          </div>
          <div
            className="ml-20 text-xs font-semibold text-gray-600 pt-4"
            style={{ width: '55%' }}
          >
            DESCRIPTION
          </div>
        </div>
        {(props.info.business_models || []).length > 0 &&
          (props.info.business_models || []).map((model, index) => {
            return (
              <>
                <div className="flex py-4">
                  <div className="pl-8 flex flex-row" style={{ width: '25%' }}>
                    <div className="text-xs font-semibold text-gray-500 my-auto">
                      {model.model}
                    </div>
                  </div>
                  <div className="ml-12 flex flex-row" style={{ width: '20%' }}>
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
                {index !== props.info.business_models.length - 1 && (
                  <div className="h-px w-full bg-gray-200" />
                )}
              </>
            );
          })}
        {(props.info.business_models || []).length === 0 && (
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
    </>
  );
};

export default Profitability;
