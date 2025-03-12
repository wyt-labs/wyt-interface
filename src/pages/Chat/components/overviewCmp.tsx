import { Image } from 'antd';

interface overviewCmpProps {
  description: string;
  logo_url: string;
  name: string;
  tags: any;
  team_impressions: any;
  token_market_cap: number;
  token_price: number;
  token_symbol: string;
  tracks: trackProps[];
}

interface trackProps {
  description: string;
  id: string;
  name: string;
}

const OverviewCmp = (props: { info: overviewCmpProps }) => {
  const { info } = props;

  const trackColorArrays = [
    'bg-purple-50 text-purple-500',
    'bg-green-50 text-green-500',
    'bg-red-50 text-red-500',
  ];

  return (
    <>
      <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full">
        <div className="text-gray-400 text-sm">Description</div>
        <div className="text-gray-700 mt-2 text-sm break-words h-36 overflow-hidden">
          {info.description.length > 200
            ? `${info.description.slice(0, 200)}...`
            : info.description}
        </div>
        {/*<div className="text-gray-400 text-sm mt-5">Tracks</div>*/}
        {/*<div className="mt-2 flex">*/}
        {/*  {(info.tracks || []).map((track, index) => {*/}
        {/*    return (*/}
        {/*      <div*/}
        {/*        key={track.id}*/}
        {/*        className={`py-1 px-2 rounded text-xs font-normal mr-1 ${*/}
        {/*          trackColorArrays[index % 3]*/}
        {/*        }`}*/}
        {/*      >*/}
        {/*        {track.name}*/}
        {/*      </div>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</div>*/}
      </div>
    </>
  );
};

export default OverviewCmp;
