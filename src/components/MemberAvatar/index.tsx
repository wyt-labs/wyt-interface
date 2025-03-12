import { Image, Popover, Tooltip } from 'antd';
import DefaultAvatar from '@/assets/team_default_avatar.png';
import { memberParams } from '@/services/project';

const MemberAvatar = (props: { member: memberParams }) => {
  const { member } = props;
  return (
    <>
      <div className="flex flex-col ml-2">
        <div className="text-center">
          <Popover
            content={() => {
              return (
                <>
                  <div className="text-sm text-gray-500 w-80">
                    {member.description}
                  </div>
                </>
              );
            }}
            title={() => {
              return (
                <>
                  <div className="flex">
                    <div>
                      <Image
                        src={member.avatar_url || DefaultAvatar}
                        className="rounded-full"
                        preview={false}
                        width={56}
                        height={56}
                      />
                    </div>
                    <div className="ml-4 mt-0.5">
                      <div className="text-gray-700 font-bold text-base">
                        {member.name}
                      </div>
                      <div>
                        <div
                          style={{ width: 'fit-content' }}
                          className="rounded-3xl bg-green-100 w- text-green-700 text-sm px-2 mt-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
                        >
                          {member.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }}
          >
            <Image
              className="ml-auto rounded-full"
              preview={false}
              src={member.avatar_url || DefaultAvatar}
              width={56}
              height={56}
            />
          </Popover>
        </div>
        <div className="text-gray-500 mt-1 text-xs text-center">
          {member.name}
        </div>
        <div className="mt-1">
          <Tooltip placement="top" title={member.title}>
            <div
              style={{ maxWidth: 100 }}
              className="rounded-3xl bg-green-100 text-green-700 text-sm px-2 m-auto overflow-hidden whitespace-nowrap overflow-ellipsis"
            >
              {member.title}
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default MemberAvatar;
