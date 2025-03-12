import { Image } from 'antd';
import BianceSrc from '@/assets/chat/biance.png';
import OkexSrc from '@/assets/chat/okex.png';
import CoinbaseSrc from '@/assets/chat/coinbase.png';

interface exchangesProps {
  binance_link: string;
  coinbase_link: string;
  okx_link: string;
}

const ExchangesCmp = (props: { info: exchangesProps }) => {
  const { info } = props;
  const openLink = (url: string) => {
    window.open(url);
  };
  return (
    <>
      <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full flex justify-center">
        <div className="w-16 text-center">
          <Image
            onClick={() => {
              openLink(info?.binance_link ?? '');
            }}
            className="rounded-full mx-auto cursor-pointer"
            preview={false}
            src={BianceSrc}
            width={56}
            height={56}
          />
          <div className="text-gray-500 mt-1 text-xs">Binance</div>
        </div>
        <div className="w-16 text-center">
          <Image
            onClick={() => {
              openLink(info?.okx_link ?? '');
            }}
            className="rounded-full mx-auto cursor-pointer"
            preview={false}
            src={OkexSrc}
            width={56}
            height={56}
          />
          <div className="text-gray-500 mt-1 text-xs">OKEX</div>
        </div>
        <div className="w-16 text-center">
          <Image
            onClick={() => {
              openLink(info?.coinbase_link ?? '');
            }}
            className="rounded-full mx-auto cursor-pointer"
            preview={false}
            src={CoinbaseSrc}
            width={56}
            height={56}
          />
          <div className="text-gray-500 mt-1 text-xs">Coinbase</div>
        </div>
      </div>
    </>
  );
};

export default ExchangesCmp;
