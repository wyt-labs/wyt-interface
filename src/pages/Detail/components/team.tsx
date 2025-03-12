import { Image } from 'antd';
import DefaultAvatar from '@/assets/team_default_avatar.png';
import { ReactComponent as TwitterTeam } from '@/assets/svg/detail/twitter_team.svg';
import { ReactComponent as LinkedInTeam } from '@/assets/svg/detail/linkedin_team.svg';
import { teamRestoreParams } from '@/services/project';

const Team = (props: { info: teamRestoreParams | undefined }) => {
  const { info } = props;

  return (
    <>
      <div className="mt-4 px-4">
        <div className="mt-4 text-xl font-bold text-gray-700">Team member</div>
        <div className="flex flex-wrap justify-start">
          {(info?.members || []).map((member) => {
            return (
              <div
                key={member.name}
                className="mt-5 border border=solid mr-5 border-gray-300 rounded-2xl p-8 "
                style={{ width: '45%' }}
              >
                <div className="flex">
                  <Image
                    src={member.avatar_url || DefaultAvatar}
                    className="rounded-full"
                    preview={false}
                    width={56}
                    height={56}
                  />
                  <div className="ml-4">
                    <div className="text-base font-bold text-gray-700">
                      {member.name}
                    </div>
                    <div className="flex mt-2">
                      <div className="bg-green-100 rounded-3xl px-2 text-green-700">
                        {member.title}
                      </div>
                    </div>
                  </div>
                  {(member?.social_media_links || []).filter(
                    (link) => link.type === 'Twitter',
                  ).length > 0 && (
                    <TwitterTeam
                      onClick={() => {
                        window.open(
                          (member?.social_media_links || []).filter(
                            (link) => link.type === 'Twitter',
                          )[0].link,
                        );
                      }}
                      className="ml-auto cursor-pointer team-twitter"
                      width="24"
                    />
                  )}
                  {(member?.social_media_links || []).filter(
                    (link) => link.type === 'Linkedln',
                  ).length > 0 && (
                    <LinkedInTeam
                      onClick={() => {
                        window.open(
                          (member?.social_media_links || []).filter(
                            (link) => link.type === 'Linkedln',
                          )[0].link,
                        );
                      }}
                      className={`team-linkedin ${
                        (member?.social_media_links || []).filter(
                          (link) => link.type === 'Twitter',
                        ).length > 0
                          ? 'ml-2'
                          : 'ml-auto'
                      } cursor-pointer`}
                      width="24"
                    />
                  )}
                </div>
                <div className="mt-2 text-gray-500 text-sm">
                  {member.description}
                </div>
              </div>
            );
          })}
          {(info?.members || []).length === 0 && (
            <div className="mt-4">No members info</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Team;
