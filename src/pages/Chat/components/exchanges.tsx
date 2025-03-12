import { Image } from 'antd';
import BianceSrc from '@/assets/chat/biance.png';
import OkexSrc from '@/assets/chat/okex.png';
import CoinbaseSrc from '@/assets/chat/coinbase.png';

interface exchangesProps {
  binance_link: string;
  coinbase_link: string;
  okx_link: string;
}

const Exchanges = (props: { info: exchangesProps }) => {
  const { info } = props;
  const openLink = (url: string) => {
    window.open(url);
  };
  return (
    <>
      <div className="flex flex-wrap w-full justify-between">
        <div
          onClick={() => {
            if (info?.binance_link) openLink(info?.binance_link ?? '');
          }}
          className={`p-5 rounded-2xl bg-gray-50 mt-2.5 ${info?.binance_link ? 'cursor-pointer' : ''}`}
          style={{ width: '48%' }}
        >
          <div className="flex">
            <Image preview={false} src={BianceSrc} width={40} height={40} />
            <div className="text-gray-700 font-bold text-base mt-2 ml-2">
              Binance
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            if (info?.okx_link) openLink(info?.okx_link ?? '');
          }}
          className={`p-5 rounded-2xl bg-gray-50 mt-2.5 ${info?.okx_link ? 'cursor-pointer' : ''}`}
          style={{ width: '48%' }}
        >
          <div className="flex">
            <Image preview={false} src={OkexSrc} width={40} height={40} />
            <div className="text-gray-700 font-bold text-base mt-2 ml-2">
              OKEX
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            if (info?.coinbase_link) openLink(info?.coinbase_link ?? '');
          }}
          className={`p-5 rounded-2xl bg-gray-50 mt-2.5 ${info?.coinbase_link ? 'cursor-pointer' : ''}`}
          style={{ width: '48%' }}
        >
          <div className="flex">
            <Image preview={false} src={CoinbaseSrc} width={40} height={40} />
            <div className="text-gray-700 font-bold text-base mt-2 ml-2">
              Coinbase
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Exchanges;
