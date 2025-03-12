import { ReactComponent as Add } from '@/assets/svg/add.svg';
import { ReactComponent as Collapse } from '@/assets/svg/collapse.svg';
import { ReactComponent as Spand } from '@/assets/svg/spand.svg';
import React, { useState } from 'react';

import uniswapLogo from '@/assets/chat/uniswap.png';
import wytLogo from '@/assets/chat/wyt-logo.png';
import { AvatarImage } from '@/components/Avatar/Avatar';
import { AgentIcon, UnpinIcon, goIcon } from '@/components/Icon';
import { unpinAgent } from '@/services/chat';
import { handleAgentList } from '@/utils/agent';
import type { chatListParams } from '@/utils/interface';
import { ChatModel } from '@/utils/model';
import Icon, { LoadingOutlined } from '@ant-design/icons';
// import { Progress } from 'antd';
import { BotIcon, WalletIcon } from 'lucide-react';
import { connect, history } from 'umi';
import { useSession, useWallet } from 'web3-connect-react';

function UserProfileButton(props: {
  collapse: boolean;
  openModal?: () => void;
  closeModal?: () => void;
}) {
  const { isSignedIn } = useWallet();
  const { walletAddress } = useSession();

  if (!isSignedIn)
    return (
      <button
        className="flex mt-auto items-center mb-8 py-4 px-5 rounded-[32px] text-white space-x-2 text-sm font-bold bg-theme-secondary bg-opacity-20 hover:bg-opacity-50 focus:bg-opacity-40 w-full"
        onClick={props.openModal}
      >
        <WalletIcon />
        {props.collapse && <span>Connect wallet</span>}
      </button>
    );

  return (
    <button
      className="flex mt-auto mb-8 py-4 px-5 bg-theme-secondary side-bg items-center"
      style={{
        borderRadius: '32px 10px 32px 32px',
      }}
      onClick={props.openModal}
    >
      <AvatarImage
        walletAddress={walletAddress ?? ""}
        size={56}
        className={'h-14 w-14'}
      />
      {props.collapse && (
        <div className="ml-3 flex flex-col justify-start items-start">
          <div className="mt-1 text-sm font-normal text-gray-100 flex-shrink-0 ">
            My Account
          </div>
          <div className="mt-1 text-sm font-bold text-white">{`${walletAddress?.slice(
            0,
            6,
          )}...${walletAddress?.slice(-4)}`}</div>
        </div>
      )}
    </button>
  );
}

const ChatSidebar = (
  props: {
    collapse: boolean;
    onClick: () => void;
    onAddChat: () => void;
    onAddUniswapChat: () => void;
    chatListParams: chatListParams[];
    renderChatItem: (chat: any, index: number) => React.JSX.Element;
    openModal: () => void;
    closeModal: () => void;
    onCollapse: () => void;
    onExpand: () => void;
    showCollapse: boolean;
    dispatch: any;
  } & ChatModel,
) => {
  const { agentList, dispatch } = props;
  const filterAgentList = (agentList || []).filter((li) => li.pin_status);
  const { isSignedIn } = useWallet();
  const [isHover, setIsHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const expandButton = (
    <div className="flex flex-col">
      {props.collapse && props.showCollapse && (
        <div
          onClick={props.onCollapse}
          className="mt-auto mb-auto bg-theme-secondary rounded-lg py-6 cursor-pointer text-theme-primary"
        >
          <Collapse />
        </div>
      )}
      {!props.collapse && props.showCollapse && (
        <div
          onClick={props.onExpand}
          className="mt-auto mb-auto bg-theme-secondary rounded-lg py-6 cursor-pointer text-theme-primary"
        >
          <Spand />
        </div>
      )}
    </div>
  );

  if (!isSignedIn) {
    return (
      <>
        <div
          className={`pr-2.5 flex flex-col text-theme-secondary gap-2 justify-between ${props.collapse ? 'w-[263px]' : 'w-[88px]'}`}
        >
          <img src={'/assets/logo2.png'} alt={'logo'} width={112} height={64} />
          <div className={'flex flex-col gap-2'}>
            <div className="h-px w-full bg-opacity-50 bg-theme-secondary mb-5" />
            <h1 className={'font-bold text-lg'}>
              Sign in {props.collapse ? 'to WYT' : ''}
            </h1>
            {props.collapse && (
              <span className={'text-opacity-50 text-white text-sm'}>
                Get started with your wallet to unlock the power of WYT AI agent
              </span>
            )}
            <div className={'h-14 w-full'}>
              <UserProfileButton
                collapse={props.collapse}
                openModal={props.openModal}
                closeModal={props.closeModal}
              />
            </div>
            {/*divider*/}
            <div className="h-px w-full bg-opacity-50 bg-theme-secondary mt-5" />
          </div>
        </div>
        {expandButton}
      </>
    );
  }

  const handleCancelUniswap = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setLoading(true);
      const filterUniswapAgent = (agentList || []).filter((li) =>
        li.project_name?.includes('Uniswap'),
      );
      const res = await unpinAgent({
        project_id: filterUniswapAgent[0]?.project_id,
      });
      if (res.code === 0) {
        await handleAgentList(dispatch);
        // if(chatList.length){
        //   if(chatList[0].project_id === filterUniswapAgent[0].project_id){
        //     history.push({
        //       pathname: '/uniswap-chat',
        //       query: {
        //         id: chatList[0].id,
        //       },
        //     })
        //   } else {
        //     history.push({
        //       pathname: '/chat',
        //       query: {
        //         id: chatList[0].id,
        //       },
        //     })
        //   }
        // } else {
        //   history.push('/chat')
        // }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`pr-2.5 flex flex-col ${props.collapse ? 'w-[263px]' : 'w-[100px]'} transition-all ease-in-out`}
      >
        <div className="flex pr-2.5 align-item-center justify-between">
          <img src={'/assets/logo2.png'} alt={'logo'} width={112} height={64} />
          {props.collapse && (
            <a href="https://wyt.network" target="_blank">
              <Icon
                component={goIcon}
                className="text-[#fff] text-opacity-20 hover:text-opacity-50"
              />
            </a>
          )}
        </div>
        <div className="mt-8">
          <a
            // href={'/chat'}
            onClick={() => history.push({ pathname: '/chat' })}
            className={`flex py-3 px-5 cursor-pointer bg-theme-secondary ${history?.location?.pathname === '/chat-agent' ? 'side-bg-default' : 'side-bg'} rounded-xl text-gray-100`}
          >
            <BotIcon
              className={`chat-menu-item text-[#fff]  ${!props.collapse ? 'mx-auto' : ''}`}
            />
            {props.collapse && (
              <div className="ml-2 mt-0.5 text-[#fff]">WYT AI Agent</div>
            )}
          </a>
          <a
            // href={'/chat-agent'}
            onClick={() => history.push({ pathname: '/chat-agent' })}
            className={`flex py-3 mt-2 px-5 cursor-pointer bg-theme-secondary ${history?.location?.pathname === '/chat-agent' ? 'side-bg' : 'side-bg-default'} rounded-xl text-gray-100`}
          >
            <Icon
              component={AgentIcon}
              className={`chat-menu-item text-[#fff]  ${!props.collapse ? 'mx-auto' : ''}`}
            />
            {props.collapse && (
              <div className="ml-2 mt-0.5 text-[#fff]">Agent Hub</div>
            )}
          </a>
        </div>
        {/*{props.collapse && (*/}
        {/*  <>*/}
        {/*    /!* divider*!/*/}
        {/*    <Divider className='mb-0' style={{borderColor: 'rgba(255, 255, 255, 0.5)'}} />*/}
        {/*    /!*<div className="w-full h-px bg-theme-secondary bg-opacity-50 mt-10" />*!/*/}
        {/*    <div className="flex py-2 pl-4 gap-8 items-center">*/}
        {/*      <div className="text-gray-100">follow us:</div>*/}
        {/*      <a href={'https://x.com/WytNetwork'} target={'_blank'}>*/}
        {/*        <TwitterHover*/}
        {/*          className="cursor-pointer bg-[#D8F3FF] bg-opacity-50 hover:bg-opacity-80 p-2 rounded-lg w-8 h-8"*/}
        {/*          style={{ marginTop: -2 }}*/}
        {/*        />*/}
        {/*      </a>*/}
        {/*    </div>*/}
        {/*    <Divider className='mt-0' style={{borderColor: 'rgba(255, 255, 255, 0.5)'}} />*/}
        {/*  </>*/}
        {/*)}*/}
        {props.collapse && (
          <div className="mt-8 text-xl font-bold text-white">CHAT LIST</div>
        )}
        {!props.collapse && (
          <div className="mt-8 text-xl font-bold text-white">CHAT...</div>
        )}
        {props.collapse ? (
          <div
            onClick={props.onAddChat}
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="flex py-3 px-2 side-bg-new mt-5 rounded-xl cursor-pointer"
            style={{ alignItems: 'center' }}
          >
            <Add />
            <div className="ml-2 text-[#fff] font-normal text-sm">
              {isHover ? 'New chat with WYT' : 'New chat'}
            </div>
          </div>
        ) : (
          <div
            onClick={props.onAddChat}
            className="w-full ml-auto mr-auto flex py-3 px-2 bg-gray-300/30 hover:bg-gray-300/50 active:bg-gray-400 mt-5 rounded-xl cursor-pointer"
          >
            <Add style={{ marginLeft: 'auto', marginRight: 'auto' }} />
          </div>
        )}
        <div className="overflow-y-auto">
          <div className="mt-5 text-[rgba(255,255,255,.7)] text-sm">
            Agent list
          </div>
          {props.collapse ? (
            <div>
              <div
                onClick={props.onAddChat}
                className={`flex py-3 px-2 ${history?.location?.pathname !== '/uniswap-chat' ? 'side-bg' : 'side-bg-default'} mt-2 rounded-xl cursor-pointer`}
                style={{ alignItems: 'center' }}
              >
                {/*<Add />*/}
                <img src={wytLogo} width={25} alt="WYT" />
                <div className="ml-2 text-[#fff] font-normal text-sm">
                  WYT AI Agent
                </div>
              </div>
              {filterAgentList?.length > 1 ? (
                <div
                  className={`flex py-3 px-2 ${history?.location?.pathname === '/uniswap-chat' ? 'side-bg' : 'side-bg-default'} mt-2 rounded-xl align-item-center justify-between cursor-pointer`}
                  onClick={props.onAddUniswapChat}
                >
                  <div className="flex  align-item-center">
                    <img src={uniswapLogo} width={25} alt="Uniswap" />
                    <div className="ml-2  font-normal text-[#fff] text-sm">
                      Uniswap Agent
                    </div>
                  </div>
                  {loading ? (
                    <LoadingOutlined style={{ fontSize: 15 }} spin />
                  ) : (
                    <Icon
                      component={UnpinIcon}
                      onClick={handleCancelUniswap}
                      className="text-[#fff]"
                      style={{ width: 15 }}
                    />
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div
                onClick={props.onAddChat}
                className={`w-full ml-auto mr-auto flex justify-center py-3 px-2 ${history?.location?.pathname !== '/uniswap-chat' ? 'bg-gray-300/30' : ''} hover:bg-gray-300/50 active:bg-gray-400 mt-5 rounded-xl cursor-pointer`}
              >
                <img src={wytLogo} width={25} alt="WYT" />
              </div>
              {filterAgentList?.length > 1 ? (
                <div
                  onClick={props.onAddUniswapChat}
                  className={`w-full ml-auto mr-auto flex justify-center py-3 px-2 ${history?.location?.pathname === '/uniswap-chat' ? 'bg-gray-300/30' : ''} hover:bg-gray-300/50 active:bg-gray-400 mt-5 rounded-xl cursor-pointer`}
                >
                  <img src={uniswapLogo} width={25} alt="Uniswap" />
                </div>
              ) : null}
            </div>
          )}
          {/*Chat list*/}
          <div className="flex-grow mt-5 max-h-80 chatlist">
            {(props?.chatListParams || []).map(props.renderChatItem)}
          </div>
        </div>
        {/*User profile section */}
        <UserProfileButton
          collapse={props.collapse}
          openModal={props.openModal}
          closeModal={props.closeModal}
        />
      </div>
      {expandButton}
    </>
  );
};

export default connect((state: { chat: ChatModel }) => ({
  agentList: state.chat.agentList,
  chatList: state.chat.chatList,
}))(ChatSidebar);
