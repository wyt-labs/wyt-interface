import { Image, Popover } from 'antd';
import DefaultAvatar from '@/assets/avatar.png';

const ProjectAvatar = () => {
  return (<>
    <div className="flex flex-col ml-2">
      <div className="text-center">
          <Image preview={false} src={DefaultAvatar} width={56} />
      </div>
      <div className="text-gray-500 text-xs text-center">Uniswap</div>
    </div>
  </>)
}

export default ProjectAvatar