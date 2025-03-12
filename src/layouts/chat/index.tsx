import { ReactComponent as ChatCancel } from '@/assets/svg/chat/chat_cancel.svg';
import { ReactComponent as ChatConfirm } from '@/assets/svg/chat/chat_confirm.svg';
import { ReactComponent as ManagerDelete } from '@/assets/svg/manager/manager_delete.svg';
import { ReactComponent as ManagerEdit } from '@/assets/svg/manager/manager_edit.svg';
import { deleteChat, editChatTitle, listChats } from '@/services/chat';
import type { UmiComponentProps } from '@/utils/common';
import { LoadingOutlined } from '@ant-design/icons';
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect, history } from 'umi';
import { chatColorArray } from '@/utils/chat';
// import ChatDialog from '@/pages/Chat/components/ChatDialog';

import type { chatListParams } from '@/utils/interface';
import { Input, Spin, Tooltip } from 'antd';
import NewsList from '@/pages/Chat/components/newsList';
import './index.less';
import ConnectWalletModal from '@/components/Modal/ConnectWalletModal';
import { NativeModal } from '@/components/Modal/NativeModal';
import {Providers} from '@/context/providers';
import ChatSidebar from '@/pages/Chat/components/ChatSidebar';
import { PanelLeft, PanelRight, X } from 'lucide-react';
import { Dialog, DialogPanel } from '@headlessui/react';
import {ChatModel, ProjectItem, UserModel} from '@/utils/model';
import { handleAgentList } from '@/utils/agent';

const antIcon = (
  <LoadingOutlined style={{ fontSize: 15, color: 'white' }} spin />
);

const ChatLayout = (
  props: IRouteComponentProps & UmiComponentProps & ChatModel & UserModel,
) => {
  const { location, dispatch, agentList, account, children } = props;
  const [chatList, setChatList] = useState<chatListParams[]>([]);
  const [isCollapse, setIsCollapse] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewsDrawerOpen, setIsNewsDrawerOpen] = useState(false);
  const [projectList, setProjectList] = useState<ProjectItem>({
    UNISWAP_ID: '',
    WYT_ID: '',
  });
  const [loading, setLoading] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if(account){
      handleAgentList(dispatch);
    }
  }, [account]);

  useEffect(() => {
    if (agentList?.length) {
      const filterUniswapAgent = (agentList || []).filter((li) =>
        li.project_name?.includes('Uniswap'),
      );
      const filterWytAgent = (agentList || []).filter((li) =>
        li.project_name?.includes('WYT'),
      );
      setProjectList({
        UNISWAP_ID: filterUniswapAgent[0].project_id,
        WYT_ID: filterWytAgent[0].project_id,
      });
    }
  }, [agentList?.length]);

  const listUserChats = async (id?: string) => {
    const listChatsResult = await listChats();
    if (listChatsResult?.code === 0) {
      let isToday = false;
      let isPastThirty = false;
      const today = new Date();
      const currentTimestamp = Date.now();
      const DateSet = new Set();
      const newList = (listChatsResult.data.list || []).map((chat: any) => {
        let label = '';
        const updateDate = new Date(chat.update_time * 1000);
        if (
          updateDate.getFullYear() === today.getFullYear() &&
          updateDate.getMonth() === today.getMonth() &&
          updateDate.getDay() === today.getDay()
        ) {
          if (!isToday) {
            isToday = true;
            label = 'Today';
          }
        } else {
          if (
            chat.update_time * 1000 >
              currentTimestamp - 30 * 24 * 60 * 60 * 1000 &&
            chat.update_time * 1000 < currentTimestamp
          ) {
            if (!isPastThirty) {
              isPastThirty = true;
              label = 'Previous 30 days';
            }
          } else {
            if (updateDate.getFullYear() === today.getFullYear()) {
              const temp = updateDate.getMonth().toLocaleString();
              if (!DateSet.has(temp)) {
                label = temp;
                DateSet.add(label);
              }
            } else {
              const temp =
                updateDate.getMonth().toLocaleString() +
                ' ' +
                updateDate.getFullYear();
              if (!DateSet.has(temp)) {
                label = temp;
                DateSet.add(label);
              }
            }
          }
        }
        if (id === chat.id) {
          return {
            ...chat,
            isSelected: true,
            isEdit: false,
            isDelete: false,
            label,
            editTitle: chat.title,
            isLoading: false,
          };
        }
        return {
          ...chat,
          isSelected: false,
          isEdit: false,
          isDelete: false,
          label,
          editTitle: chat.title,
          isLoading: false,
        };
      });
      setChatList(newList);
      dispatch({
        type: 'chat/setChatList',
        payload: newList,
      });
    }
  };

  const newChat = async () => {
    history.push('/chat');
  };

  const newUniswapChat = async () => {
    history.push('/uniswap-chat');
  };

  const initData = async (id: string) => {
    try {
      setLoading(true);
      await listUserChats(id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(account){
      initData(location.query.id as string);
    }
  }, [account]);

  useEffect(() => {
    if(account){
      listUserChats(location.query.id as string);
    }
  }, [location.query?.id, account]);

  useEffect(() => {
    if (chatList.length === 0) {
      listUserChats();
    }
  }, [chatList?.length]);

  const renderListItem = useCallback(
    (chat: chatListParams, index: number) => {
      return (
        <>
          {chat.label !== '' && (
            <div
              className={`text-sm my-2 ${
                !isCollapse
                  ? 'w-20 whitespace-nowrap overflow-hidden overflow-ellipsis'
                  : ''
              }`}
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {chat.label}
            </div>
          )}
          <Tooltip title={chat.title}>
            <div
              key={chat.id}
              onClick={async () => {
                if (!chat.isSelected) {
                  setChatList(
                    chatList.map((c, i) => {
                      if (index === i) {
                        return { ...c, isSelected: true };
                      } else {
                        return { ...c, isSelected: false };
                      }
                    }),
                  );
                  if (chat.project_id === projectList.WYT_ID) {
                    history.push({
                      pathname: '/chat',
                      query: {
                        id: chat.id,
                      },
                    });
                  } else {
                    history.push({
                      pathname: '/uniswap-chat',
                      query: {
                        id: chat.id,
                      },
                    });
                  }
                }
              }}
              className={`${
                isCollapse ? '' : 'w-full ml-auto mr-auto'
              } flex px-3 py-4 rounded-lg mb-1 ${
                chat.isSelected ? 'side-bg' : 'side-bg-hover'
              } cursor-pointer chat-list-item`}
            >
              <div
                className={`h-4 w-4 mt-0.5 rounded ${
                  isCollapse ? '' : 'ml-auto mr-auto'
                }`}
                style={{
                  backgroundColor:
                    chatColorArray[
                      (chatList.length - index) % chatColorArray.length
                    ],
                }}
              />
              {isCollapse && (
                <div className="ml-3 flex w-48">
                  {!chat.isEdit && (
                    <div
                      className="text-sm text-gray-100 font-normal overflow-hidden break-all max-h-5 overflow-ellipsis"
                      style={{ marginTop: 0 }}
                    >
                      {chat.title}
                    </div>
                  )}
                  {chat.isEdit && (
                    <Input
                      autoFocus
                      value={chat.editTitle}
                      bordered={false}
                      className="text-sm px-0 text-gray-100 font-normal overflow-hidden break-all max-h-5 overflow-ellipsis bg-transparent"
                      style={{ marginTop: 0, color: 'white' }}
                      onChange={(e: BaseSyntheticEvent) => {
                        setChatList(
                          chatList.map((c, i) => {
                            if (index === i) {
                              return {
                                ...c,
                                editTitle: e.target.value,
                              };
                            } else {
                              return { ...c };
                            }
                          }),
                        );
                      }}
                      onPressEnter={async (e: any) => {
                        if (e.nativeEvent.isComposing) {
                          return;
                        }
                        setChatList(
                          chatList.map((c, i) => {
                            if (index === i) {
                              return { ...c, isLoading: true };
                            } else {
                              return { ...c };
                            }
                          }),
                        );
                        const editResult = await editChatTitle(
                          chat.id,
                          chat.editTitle,
                        );
                        if (editResult.code === 0) {
                          await listUserChats(chat.id);
                        }
                      }}
                    />
                  )}
                  {chat.isSelected && !chat.isEdit && !chat.isDelete && (
                    <div className="ml-auto w-10 overflow-hidden">
                      <div className="flex w-10">
                        <div className="w-0 overflow-visible">
                          <div
                            className="z-5 h-5 relative"
                            style={{ left: -32, width: 76 }}
                          />
                        </div>
                        <ManagerEdit
                          onClick={() => {
                            setChatList(
                              chatList.map((c, i) => {
                                if (index === i) {
                                  return { ...c, isEdit: true };
                                } else {
                                  return { ...c };
                                }
                              }),
                            );
                          }}
                          width={20}
                          height={20}
                          className="list-action relative ml-auto z-10"
                        />
                        <ManagerDelete
                          onClick={async () => {
                            setChatList(
                              chatList.map((c, i) => {
                                if (index === i) {
                                  return { ...c, isDelete: true };
                                } else {
                                  return { ...c };
                                }
                              }),
                            );
                          }}
                          width={20}
                          height={20}
                          className="list-action relative ml-1 z-10"
                        />
                      </div>
                    </div>
                  )}
                  {chat.isEdit && (
                    <div className="ml-auto w-12 overflow-hidden">
                      <div className="flex w-10">
                        <div className="w-0 overflow-visible">
                          <div
                            className="z-5 h-5 relative"
                            style={{ left: -28, width: 76 }}
                          />
                        </div>
                        {chat.isLoading && (
                          <Spin
                            className="list-action relative ml-auto z-10"
                            style={{ top: 4, left: -3 }}
                            indicator={antIcon}
                          />
                        )}
                        {!chat.isLoading && (
                          <ChatConfirm
                            onClick={async () => {
                              setChatList(
                                chatList.map((c, i) => {
                                  if (index === i) {
                                    return { ...c, isLoading: true };
                                  } else {
                                    return { ...c };
                                  }
                                }),
                              );
                              const editResult = await editChatTitle(
                                chat.id,
                                chat.editTitle,
                              );
                              if (editResult.code === 0) {
                                await listUserChats(chat.id);
                              }
                            }}
                            className="list-action relative ml-auto z-10"
                          />
                        )}
                        {!chat.isLoading && (
                          <ChatCancel
                            onClick={() => {
                              setChatList(
                                chatList.map((c, i) => {
                                  if (index === i) {
                                    return { ...c, isEdit: false };
                                  } else {
                                    return { ...c };
                                  }
                                }),
                              );
                            }}
                            width={20}
                            height={20}
                            className="list-action relative ml-1 z-10"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {chat.isDelete && (
                    <div className="ml-auto w-12 overflow-hidden">
                      <div className="flex w-10">
                        <div className="w-0 overflow-visible">
                          <div
                            className="z-5 h-5 relative"
                            style={{ left: -28, width: 76 }}
                          />
                        </div>
                        {chat.isLoading && (
                          <Spin
                            className="list-action relative ml-auto z-10"
                            style={{ marginTop: 4, left: -3 }}
                            indicator={antIcon}
                          />
                        )}
                        {!chat.isLoading && (
                          <ChatConfirm
                            onClick={async () => {
                              setChatList(
                                chatList.map((c, i) => {
                                  if (index === i) {
                                    return { ...c, isLoading: true };
                                  } else {
                                    return { ...c };
                                  }
                                }),
                              );
                              const deleteResult = await deleteChat(chat.id);
                              if (deleteResult.code === 0) {
                                await listUserChats();
                                history.push({
                                  pathname: '/chat',
                                });
                              }
                            }}
                            className="list-action relative ml-auto z-10"
                          />
                        )}
                        {!chat.isLoading && (
                          <ChatCancel
                            onClick={() => {
                              setChatList(
                                chatList.map((c, i) => {
                                  if (index === i) {
                                    return { ...c, isDelete: false };
                                  } else {
                                    return { ...c };
                                  }
                                }),
                              );
                            }}
                            width={20}
                            height={20}
                            className="list-action relative ml-1 z-10"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Tooltip>
        </>
      );
    },
    [isCollapse, chatList],
  );

  const sidebar = (showCollapse: boolean, collapse?: boolean) => (
    <ChatSidebar
      showCollapse={showCollapse}
      collapse={collapse ?? isCollapse}
      onClick={() => {
        history.push('/home');
      }}
      onAddChat={newChat}
      onAddUniswapChat={newUniswapChat}
      chatListParams={chatList}
      renderChatItem={renderListItem}
      openModal={openModal}
      closeModal={closeModal}
      onCollapse={() => {
        setIsCollapse(false);
      }}
      onExpand={() => {
        setIsCollapse(true);
      }}
    />
  );

  return (
    <Providers>
      <Spin spinning={loading} indicator={antIcon}>
        <div
          className={isCollapse ? 'chat-wrapper' : 'chat-wrapper collapse-wrap'}
        >
          <div className="w-screen h-screen py-5 px-5 flex overflow-hidden bg-theme-primary">
            <Tooltip title={'Open Drawer'}>
              <button
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
                className={
                  'absolute top-10 left-10 p-1 rounded-lg hover:bg-gray-400/25 text-gray-700 block sm:hidden'
                }
              >
                <PanelLeft />
              </button>
            </Tooltip>
            <Tooltip title={'Open news panel'}>
              <button
                onClick={() => {
                  setIsNewsDrawerOpen(true);
                }}
                className={
                  'absolute top-10 right-10 p-1 rounded-lg hover:bg-gray-400/25 text-gray-700 block lg:hidden'
                }
              >
                <PanelRight />
              </button>
            </Tooltip>
            {/* Sidebar component for small screen */}
            <Dialog
              open={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
              }}
              className="relative z-10"
            >
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 left-0 flex w-64">
                    <DialogPanel
                      transition
                      className="pointer-events-auto w-screen max-w-md transform transition ease-in-out data-[closed]:translate-x-full"
                    >
                      <div className={'flex bg-purple-800 h-full py-10 px-2'}>
                        <button
                          className={'absolute top-5 right-5 text-white'}
                          onClick={() => {
                            setIsDrawerOpen(false);
                          }}
                        >
                          <X />
                        </button>
                        {sidebar(false, true)}
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </div>
            </Dialog>
            {/* Sidebar component for large screen */}
            <div className={'h-full hidden lg:flex'}>{sidebar(true)}</div>
            {/*Sidebar component for medium screen*/}
            <div className={'h-full hidden sm:flex lg:hidden'}>
              {sidebar(false, false)}
            </div>
            {/*Chat*/}
            <div className="bg-gray-50 w-full h-full flex rounded-3xl">
              <div className="flex h-full justify-center mx-auto w-full overflow-y-auto">
                {children}
              </div>
              {/*News list*/}
              <div className="hidden lg:block lg:w-px lg:h-full lg:bg-gray-300" />
              <div className="hidden lg:flex lg:flex-col lg:pt-8 lg:shrink-0 lg:h-full lg:w-[320px]">
                <div className="px-5">
                  <div className="text-xl font-bold">LATEST NEWS</div>
                </div>
                <div className="w-full h-px bg-gray-200 mt-5" />
                <NewsList />
                <div className="h-10" />
              </div>
              {/*News list for small screen*/}
              <Dialog
                open={isNewsDrawerOpen}
                onClose={() => {
                  setIsNewsDrawerOpen(false);
                }}
                className="relative z-10"
              >
                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex w-80">
                      <DialogPanel
                        transition
                        className="pointer-events-auto w-screen max-w-md transform transition ease-in-out data-[closed]:translate-x-full"
                      >
                        <div className={'bg-white h-full'}>
                          <button
                            className={'absolute top-5 right-5 text-black'}
                            onClick={() => {
                              setIsNewsDrawerOpen(false);
                            }}
                          >
                            <X />
                          </button>
                          <div className="flex flex-col w-full py-10">
                            <div className="px-5">
                              <div className="text-xl font-bold">
                                LATEST NEWS
                              </div>
                            </div>
                            <div className="w-full h-px bg-gray-200 mt-5" />
                            <NewsList />
                            <div className="h-10" />
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </div>
              </Dialog>
            </div>
          </div>
          {/* Connect wallet modal */}
          <NativeModal
            openModal={isModalOpen}
            closeModal={closeModal}
            className={'w-full max-w-[500px]'}
          >
            <ConnectWalletModal closeModal={closeModal} />
          </NativeModal>
        </div>
      </Spin>
    </Providers>
  );
};

export default connect((state: { chat: ChatModel, user }) => ({
  agentList: state.chat.agentList,
  account: state.user.account,
}))(ChatLayout);
