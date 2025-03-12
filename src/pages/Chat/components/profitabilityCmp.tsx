import { useEffect, useState } from 'react';

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

const ProfitabilityCmp = (props: { info: profitabilityProps }) => {
  const { info } = props;

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
      <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full">
        <div className="text-gray-400 text-sm font-normal">Revenue Mode</div>
        <div className="mt-2 text-gray-700 text-sm">
          {(info.business_models || []).length === 0
            ? '-'
            : `${toThousands(info.business_models[0].annual_income)} USD`}
        </div>
        <div className="text-gray-400 text-sm font-normal mt-5">
          Revenue Income
        </div>
        <div className="mt-2 text-gray-700 text-sm">
          {(info.business_models || []).length === 0
            ? '-'
            : info.business_models[0].description}
        </div>
        <div className="text-gray-400 text-sm font-normal mt-5">
          Description
        </div>
        <div className="mt-2 text-gray-700 text-sm">
          {(info.business_models || []).length === 0
            ? '-'
            : info.business_models[0].description}
        </div>
      </div>
    </>
  );
};

export default ProfitabilityCmp;
