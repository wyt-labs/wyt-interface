import MemberAvatar from '@/components/MemberAvatar';
import { ReactComponent as MoreIcon } from '@/assets/svg/more_icon.svg';
import { Image } from 'antd';
import DefaultAvatar from '@/assets/avatar.png';
import { useState } from 'react';
import { teamRestoreParams } from '@/services/project';
import { history } from 'umi';

const Team = (props: { infos: teamRestoreParams[], ids: string[] }) => {
  const { infos, ids } = props;
  const [isMore, setIsMore] = useState([false, false, false]);

  const list = [1, 1];
  return (
    <>
      <div className="flex mt-1">
        {infos.map((info, index) => {
          return (
            <div
              key={`team-${index}`}
              className={`w-1/2 ${index > 0 ? 'ml-5' : ''} h-80`}
            >
              <div className="w-full rounded-xl before-sticky-shadow bg-white text-center text-sm text-gray-900 py-5 sticky top-20 z-50">
                Team
              </div>
              <div className="w-full rounded-xl bg-white mt-1 py-5">
                <div className="text-center text-gray-400 text-sm">
                  Team Impression
                </div>
                <div className="flex mt-2 justify-center">
                  {(info.impressions || []).map((impression, index1) => {
                    return (
                      <div
                        key={impression.id}
                        className={`rounded bg-purple-50 px-2 py-1 text-purple-500 text-xs ${
                          index1 > 0 ? 'ml-1' : ''
                        }`}
                      >
                        {impression.name}
                      </div>
                    );
                  })}
                  {(info.impressions || []).length === 0 && <div>-</div>}
                </div>
                <div className="text-center text-gray-400 text-sm mt-5">
                  Members
                </div>
                <div className="flex mt-5 justify-center h-28">
                  {(info.members || []).slice(0, 3).map((member) => {
                    return <MemberAvatar key={member.name} member={member} />;
                  })}
                  {(info.members || []).length > 3 && (
                    <div className="flex flex-col ml-2 mt-4">
                      {!isMore[index] && (
                        <div
                          onMouseEnter={() => {
                            setIsMore([
                              ...isMore.slice(0, index),
                              true,
                              ...isMore.slice(index + 1),
                            ]);
                          }}
                          className="text-center rounded-full w-12 h-12 text-gray-500 pt-3 cursor-pointer"
                          style={{ backgroundColor: '#E9E9E9' }}
                        >
                          {`+${(info.members || []).length - 3}`}
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
                          onClick={() => {
                            history.push({
                              pathname: '/detail',
                              query: {
                                id: ids[index],
                                tab: '3',
                              }
                            })
                          }}
                          className="text-center rounded-full w-12 h-12 pt-3.5 bg-purple-500 cursor-pointer"
                        >
                          <MoreIcon
                            style={{ stroke: 'white', margin: 'auto' }}
                          />
                        </div>
                      )}
                      <div className="text-gray-500 mt-1 text-xs text-center">
                        More
                      </div>
                    </div>
                  )}
                  {(info.members || []).length === 0 && (
                    <div className="">-</div>
                  )}
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

export default Team;
