import { Image, Tooltip } from 'antd';
import LogoSrc from '@/assets/logo.png';
import { showBriefAmount } from '@/utils/tools';
import { changePrice } from '@/utils/chain';

interface OverviewProps {
  info: any;
}

const Overview = (props: OverviewProps) => {
  const { info } = props;

  return (
    <>
      <div className="mt-2.5 bg-gray-50 rounded-xl p-5">
        <div className="flex">
          <Image
            width={56}
            height={56}
            src={info.logo_url}
            className="rounded-full flex-1"
            preview={false}
          />
          <Tooltip title={info.name}>
            <div
              style={{ maxWidth: 220 }}
              className="ml-4 text-4xl font-bold mt-2 overflow-hidden whitespace-nowrap overflow-ellipsis"
            >
              {info.name}
            </div>
          </Tooltip>
          {info.token_symbol ? (
            <div className="h-10 bg-gray-200 rounded-xl pt-2.5 pb-px px-4 text-gray-500 ml-2 mt-2">
              {info.token_symbol}
            </div>
          ) : null}
          <Tooltip title={info.token_price}>
            <div className="ml-auto">
              <div className="text-4xl font-bold text-right">{`$ ${changePrice(info.token_price)}`}</div>
              <div className="text-right text-gray-500 text-xs mt-1">
                {'Market Cap:' + showBriefAmount(info.token_market_cap)}
              </div>
            </div>
          </Tooltip>
        </div>
        <div className="mt-2.5 text-gray-500 text-sm font-normal">
          {info.description}
        </div>
        {/*<div className="flex mt-5 justify-start">*/}
        {/*  <div className="">*/}
        {/*    <div className="text-gray-500 text-sm font-normal">*/}
        {/*      Team background:*/}
        {/*    </div>*/}
        {/*    {(info.team_impressions || []).length === 0 && (*/}
        {/*      <>*/}
        {/*        <div className="flex mt-2">*/}
        {/*          <div className="mt-1 text-xs">-</div>*/}
        {/*        </div>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*    {(info.team_impressions || []).length > 0 &&*/}
        {/*      (info.team_impressions || [])*/}
        {/*        .slice(0, 2)*/}
        {/*        .map((impression: any) => {*/}
        {/*          return (*/}
        {/*            <>*/}
        {/*              <div className="flex mt-2">*/}
        {/*                <div className="bg-green-50 rounded py-1 px-2 text-green-500 text-xs">*/}
        {/*                  {impression.name}*/}
        {/*                </div>*/}
        {/*              </div>*/}
        {/*            </>*/}
        {/*          );*/}
        {/*        })}*/}
        {/*    {(info.team_impressions || []).length > 2 && (*/}
        {/*      <>*/}
        {/*        <div className="flex mt-2">*/}
        {/*          <Tooltip*/}
        {/*            title={(info.team_impressions || [])*/}
        {/*              .slice(2)*/}
        {/*              .map((impression: any) => impression.name)*/}
        {/*              .join(',')}*/}
        {/*          >*/}
        {/*            <div className="bg-purple-50 rounded py-1 px-2 text-purple-500 text-xs">*/}
        {/*              View all*/}
        {/*            </div>*/}
        {/*          </Tooltip>*/}
        {/*        </div>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*  <div className="ml-10">*/}
        {/*    <div className="text-gray-500 text-sm font-normal">Tracks:</div>*/}
        {/*    {(info.tracks || []).length === 0 && (*/}
        {/*      <>*/}
        {/*        <div className="flex mt-2">*/}
        {/*          <div className="mt-1 text-xs">-</div>*/}
        {/*        </div>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*    {(info.tracks || []).length > 0 && (*/}
        {/*      <>*/}
        {/*        <div className="flex mt-2">*/}
        {/*          {info.tracks.slice(0, 2).map((track: any, index) => {*/}
        {/*            return (*/}
        {/*              <div*/}
        {/*                key={track.id}*/}
        {/*                className={`bg-gray-200 rounded py-1 px-2 text-gray-500 text-xs ${*/}
        {/*                  index > 0 ? 'ml-1' : ''*/}
        {/*                }`}*/}
        {/*              >*/}
        {/*                {track.name}*/}
        {/*              </div>*/}
        {/*            );*/}
        {/*          })}*/}
        {/*          {info.tracks.length > 2 && (*/}
        {/*            <div className="bg-purple-200 rounded py-1 px-2 text-purple-500 text-xs ml-1">*/}
        {/*              View all*/}
        {/*            </div>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*  <div className="ml-10">*/}
        {/*    <div className="text-gray-500 text-sm font-normal">Tags:</div>*/}
        {/*    {(info.tags || []).length === 0 && (*/}
        {/*      <>*/}
        {/*        <div className="flex mt-2">*/}
        {/*          <div className="mt-1 text-xs">-</div>*/}
        {/*        </div>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*    {(info.tags || []).length > 0 && (*/}
        {/*      <>*/}
        {/*        <div className="flex mt-2">*/}
        {/*          {info.tags.slice(0, 2).map((tag: any) => {*/}
        {/*            return (*/}
        {/*              <div*/}
        {/*                key={tag.id}*/}
        {/*                className="bg-green-50 rounded py-1 px-2 text-green-500 text-xs"*/}
        {/*              >*/}
        {/*                {tag.name}*/}
        {/*              </div>*/}
        {/*            );*/}
        {/*          })}*/}
        {/*          {info.tracks.length > 2 && (*/}
        {/*            <div className="bg-purple-50 rounded py-1 px-2 text-purple-500 text-xs ml-1">*/}
        {/*              View all*/}
        {/*            </div>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </>
  );
};

export default Overview;
