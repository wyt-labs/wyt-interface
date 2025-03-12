import { Image, Popover } from 'antd';
import DefaultAvatar from '@/assets/avatar.png';
import BianceAvatar from '@/assets/chat/biance.png';
import OkxAvatar from '@/assets/chat/okex.png';
import CoinbaseAvatar from '@/assets/chat/coinbase.png';

const ExchangeAvatar = (props: { exchange: string; type: number }) => {
  const { exchange, type } = props;
  return (
    <>
      <div className="flex flex-col ml-2">
        <div className="text-center">
          <Popover
            title={() => {
              return (
                <>
                  <div className="flex w-80">
                    <div>
                      <Image
                        src={
                          type === 1
                            ? BianceAvatar
                            : type === 2
                            ? OkxAvatar
                            : CoinbaseAvatar
                        }
                        preview={false}
                        width={56}
                      />
                    </div>
                    <div className="ml-4 mt-0.5">
                      <div className="text-gray-700 font-bold text-base">
                        {type === 1
                          ? 'Binance'
                          : type === 2
                          ? 'OKEX'
                          : 'Coinbase'}
                      </div>
                      <div className="rounded-3xl bg-green-100 text-green-700 text-sm px-2 mt-2 w-max">
                        {`Rank: #${type}`}
                      </div>
                    </div>
                  </div>
                </>
              );
            }}
          >
            <Image
              preview={false}
              className="rounded-full"
              src={
                type === 1
                  ? BianceAvatar
                  : type === 2
                  ? OkxAvatar
                  : CoinbaseAvatar
              }
              width={56}
            />
          </Popover>
        </div>
        <div className="text-gray-500 text-xs text-center">
          {type === 1 ? 'Binance' : type === 2 ? 'OKEX' : 'Coinbase'}
        </div>
      </div>
    </>
  );
};

export default ExchangeAvatar;
