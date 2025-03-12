import { Image } from 'antd';
import BianceSrc from '@/assets/chat/biance.png';
import OkexSrc from '@/assets/chat/okex.png';
import CoinbaseSrc from '@/assets/chat/coinbase.png';
import { exchangesParams } from '@/services/project';

const Exchanges = (props: { info: exchangesParams | undefined }) => {
  const { info } = props;

  const openLink = (url: string) => {
    window.open(url);
  };

  return (
    <>
      <div className="mt-4 px-4">
        <div className="mt-4 text-xl font-bold text-gray-700">Exchanges</div>
        <div className="flex mt-4 flex-wrap">
          <div
            onClick={() => {
              openLink(info?.binance_link ?? '');
            }}
            className="border border-solid rounded-2xl border-gray-300 p-6 flex cursor-pointer"
          >
            <Image preview={false} src={BianceSrc} width={40} height={40} />
            <div className="ml-2 font-bold mt-2 w-60">Binance</div>
          </div>
          <div
            onClick={() => {
              openLink(info?.okx_link ?? '');
            }}
            className="ml-4 border border-solid rounded-2xl border-gray-300 p-6 flex cursor-pointer"
          >
            <Image preview={false} src={OkexSrc} width={40} height={40} />
            <div className="ml-2 font-bold mt-2 w-60">OKEX</div>
          </div>
          <div
            onClick={() => {
              openLink(info?.coinbase_link ?? '');
            }}
            className="ml-4 border border-solid rounded-2xl border-gray-300 p-6 flex cursor-pointer"
          >
            <Image preview={false} src={CoinbaseSrc} width={40} height={40} />
            <div className="ml-2 font-bold mt-2 w-60">Coinbase</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Exchanges;
