import { Image, Popover } from 'antd';
import DefaultAvatar from '@/assets/avatar.png';
import { investorOption } from '@/utils/interface';

const InvestorAvatar = (props: { investor: investorOption }) => {
  const { investor } = props;

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
                        src={investor.avatar_url}
                        className="rounded-full"
                        preview={false}
                        width={56}
                      />
                    </div>
                    <div className="ml-4 mt-0.5">
                      <div className="text-gray-700 font-bold text-base">
                        {investor.name}
                      </div>
                      <div className="rounded-3xl bg-green-100 text-green-700 text-sm px-2 mt-2 w-max">
                        {investor.type === 1 ? 'KOL' : 'Institution'}
                      </div>
                    </div>
                  </div>
                </>
              );
            }}
          >
            <Image
              className="rounded-full"
              preview={false}
              src={investor.avatar_url}
              width={56}
            />
          </Popover>
        </div>
        <div className="text-gray-500 text-xs text-center">{investor.name}</div>
      </div>
    </>
  );
};

export default InvestorAvatar;
