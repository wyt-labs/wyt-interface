import { Image } from 'antd';
import BianceSrc from '@/assets/chat/biance.png';
import { basicRestoreParams } from '@/services/project';

const Overview = (props: { infos: basicRestoreParams[] }) => {
  const { infos } = props;
  const colorArray = [
    'bg-purple-50 text-purple-500',
    'bg-green-50 text-green-500',
    'bg-red-50 text-red-500',
    'bg-yellow-50 text-yellow-500',
    'bg-blue-50 text-blue-500',
  ];

  return (
    <>
      <div className="flex mt-5">
        {infos.map((info, index) => {
          return (
            <div
              key={info.name}
              className={`rounded-xl bg-white p-5 w-1/2 ${
                index > 0 ? 'ml-5' : ''
              }`}
            >
              <div className="text-gray-400 text-sm">Description</div>
              <div className="text-gray-900 text-sm mt-2 h-16 overflow-hidden overflow-ellipsis">
                {info.description.length > 200
                  ? info.description.slice(0, 200) + '...'
                  : info.description}
              </div>
              <div className="text-gray-400 text-sm mt-5">Tracks</div>
              <div className="mt-2 flex">
                {(info.tracks || []).map((track, index1) => {
                  return (
                    <div
                      key={track.id}
                      className={`rounded py-1 px-2 text-xs ${
                        colorArray[index1 % 5]
                      } ${index1 > 0 ? 'ml-1' : ''}`}
                    >
                      {track.name}
                    </div>
                  );
                })}
              </div>
              <div className="text-gray-400 text-sm mt-5">Tags</div>
              <div className="mt-2 flex">
                {(info.tags || []).map((tag, index1) => {
                  return (
                    <div
                      key={tag.id}
                      className={`rounded py-1 px-2 text-xs ${
                        colorArray[index1 % 5]
                      } ${index1 > 0 ? 'ml-1' : ''}`}
                    >
                      {tag.name}
                    </div>
                  );
                })}
              </div>
              <div className="text-gray-400 text-sm mt-5">Chains</div>
              <div className="mt-4 flex">
                {(info.chains || []).map((chain) => {
                  return (
                    <div key={chain.id} className="flex flex-col">
                      <div className="text-center">
                        <Image
                          src={chain.logo_url}
                          className="rounded-full"
                          width={56}
                          preview={false}
                        />
                      </div>
                      <div className="mt-1 text-gray-500 text-center text-xs">
                        {chain.name}
                      </div>
                    </div>
                  );
                })}
                {(info.chains || []).length === 0 && <div>-</div>}
              </div>
            </div>
          );
        })}
        {infos.length === 1 && (
          <div className="ml-5 w-1/2 bg-gray-100 rounded-xl text-center flex flex-col">
            <div className="m-auto text-gray-300">Add a project first</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Overview;
