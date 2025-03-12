import { relatedLinksParams } from '@/services/project';
import { Image, Tooltip } from 'antd';
import { ReactComponent as Twitter } from '@/assets/svg/twitter_bg.svg';
import DefaultAvatar from '@/assets/team_default_avatar.png';

interface teamProps {
  impressions: any;
  members: memberProps[];
}

interface memberProps {
  name: string;
  is_departed: boolean;
  avatar_url: string;
  title: string;
  description: string;
  social_media_links: relatedLinksParams[];
}

const TeamCmp = (props: { info: teamProps; count: number }) => {
  const { count } = props;

  return (
    <>
      {(props.info.members || []).slice(0, 3).map((member) => {
        return (
          <div
            key={member.name}
            className="bg-gray-50 rounded-xl p-5 mt-1 w-full h-52"
          >
            <div className="p-5 rounded-2xl bg-gray-50 mt-2.5 w-full">
              <div className="flex">
                <Image
                  className="rounded-full"
                  preview={false}
                  src={member.avatar_url || DefaultAvatar}
                  width={56}
                  height={56}
                />
                <div className="ml-4">
                  <div className="text-base font-bold">{member.name}</div>
                  <Tooltip placement="top" title={member.title}>
                    <div
                      className="px-2 bg-green-100 text-green-700 mt-2 rounded-3xl text-sm"
                      style={{ width: 'fit-content' }}
                    >
                      {member.title.length > 15
                        ? `${member.title.slice(0, 5)}...${member.title.slice(
                            -5,
                          )}`
                        : member.title}
                    </div>
                  </Tooltip>
                </div>
                {(member.social_media_links || []).filter(
                  (link) => link.type === 'Twitter',
                ).length > 0 && (
                  <Twitter
                    onClick={() => {
                      window.open(
                        (member?.social_media_links || []).filter(
                          (link) => link.type === 'Twitter',
                        )[0].link,
                      );
                    }}
                    className="ml-auto cursor-pointer mt-1 mr-1 team-twitter"
                  />
                )}
              </div>
              <div className="w-full mt-2.5 text-sm text-gray-600 h-14 break-words">
                {member.description.length > 100
                  ? `${member.description.slice(0, 100)}...`
                  : member.description.length === 0
                  ? 'No description yet'
                  : member.description}
              </div>
            </div>
          </div>
        );
      })}
      {(props.info.members || []).length === 0 && (
        <div
          className="bg-gray-50 rounded-xl p-5 mt-1 flex flex-col"
          style={{ height: 208 * count + 4 * (count - 1) }}
        >
          <div className="m-auto text-gray-500 text-sm">NO TEAM INFO</div>
        </div>
      )}
      {(props.info.members || []).length !== 0 &&
        (props.info.members || []).length < count && (
          <div
            className="bg-gray-50 rounded-xl p-5 mt-1 flex flex-col"
            style={{
              height:
                208 * (count - (props.info.members || []).length) +
                4 * (count - (props.info.members || []).length - 1),
            }}
          >
            <div className="m-auto text-gray-500 text-sm">No more</div>
          </div>
        )}
    </>
  );
};

export default TeamCmp;
