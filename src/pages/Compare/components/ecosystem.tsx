import ProjectAvatar from '@/components/ProjectAvatar';
import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import { useState } from 'react';
import { ecosystemParams } from '@/services/project';

const Ecosystem = (props: { infos: ecosystemParams[] }) => {
  const { infos } = props;
  const [isMore, setIsMore] = useState([false, false, false]);
  return (
    <>
      <div className="flex mt-1">
        {infos.map((info, index) => {
          return (
            <div
              key={`eco-${index}`}
              className={`w-1/2 ${index > 0 ? 'ml-5' : ''}`}
            >
              <div className="w-full rounded-xl before-sticky-shadow bg-white text-center text-sm text-gray-900 py-5 sticky top-20 z-50">
                ECOSYSTEM
              </div>
              <div className="w-full rounded-xl bg-white mt-1 py-5 text-center">
                <div className="text-gray-400 text-sm">Total Projects</div>
                <div className="text-gray-900 mt-1 text-sm font-bold">
                  {info.total_amount}
                </div>
              </div>
              <div className="w-full rounded-xl bg-white mt-1 py-5 text-center">
                <div className="text-gray-400 text-sm">Top Projects</div>
                <div className="mt-5 flex justify-center h-28">
                  {(info.top_projects || []).slice(0, 3).map((project: any) => {
                    return <ProjectAvatar key={project.id} />;
                  })}
                  {(info.top_projects || []).length > 3 && (
                    <div className="flex flex-col ml-2">
                      {!isMore[index] && (
                        <div
                          onMouseEnter={() => {
                            setIsMore([
                              ...isMore.slice(0, index),
                              true,
                              ...isMore.slice(index + 1),
                            ]);
                          }}
                          className="text-center rounded-full w-14 h-14 text-gray-500 pt-4 cursor-pointer"
                          style={{ backgroundColor: '#E9E9E9' }}
                        >
                          {`+${(info.top_projects || []).length - 3}`}
                        </div>
                      )}
                      {isMore[index] && (
                        <div
                          onMouseLeave={() => {
                            setIsMore([
                              ...isMore.slice(0, index),
                              false,
                              ...isMore.slice(index + 1),
                            ]);
                          }}
                          className="text-center rounded-full w-14 h-14 bg-purple-500 cursor-pointer"
                          style={{ paddingTop: 18 }}
                        >
                          <MoreIcon
                            style={{ stroke: 'white', margin: 'auto' }}
                          />
                        </div>
                      )}
                      <div className="text-gray-500 mt-1.5 text-xs text-center">
                        More
                      </div>
                    </div>
                  )}
                  {(info.top_projects || []).length === 0 && <div>-</div>}
                </div>
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

export default Ecosystem;
