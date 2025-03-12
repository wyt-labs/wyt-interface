import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as ChatDialogLogo } from '@/assets/svg/chat/chat_logo.svg';
import { ReactComponent as Idea } from '@/assets/svg/idea.svg';
import { ReactComponent as Arrow } from '@/assets/svg/arrow.svg';
import { ReactComponent as Loading } from '@/assets/svg/loading.svg';
import type { UmiComponentProps } from '@/utils/common';
import { Input, Spin } from 'antd';
import './ChatDialog.less';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import {
  createChat,
  getChatHistory,
  onChat,
  pinAgent,
  unpinAgent,
} from '@/services/chat';
import { IRouteComponentProps, history, connect } from 'umi';
import ProjectSwap from './projectSwap';
import { ChatModel, ProjectItem } from '@/utils/model';
import ProjectInfo from './projectInfo';
import ProjectCompare from './projectCompare';
import { useSession, useWallet } from 'web3-connect-react';
import { AvatarImage } from '@/components/Avatar/Avatar';
import SwapIframe from './iframe';
import TokenChart from '@/components/Charts/TokenChart';
import TransactionsChart from '@/components/Charts/TransactionsChart';
import LaunchCountChart from '@/components/Charts/LaunchCountChart';
import PumpTop from './PumpTop';
import PumpTopDetail from './PumpTopDetail';
import Markdown from 'markdown-to-jsx';
import { Controlled as CodeMirror } from 'react-codemirror2';
import {
  uniswapQuestion,
  uniswapQuickQuestion,
  wytQuestion,
  wytQuickQuestion,
} from '@/utils/chat';
import uniswapPng from '@/assets/chat/uniswap.png';
import { overviewSubItems, chartSubItems } from '@/utils/chat';

// import 'codemirror/mode/lua/lua';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/paraiso-light.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/base16-dark.css';
import {
  AddIcon,
  PinIcon,
  uniswapPageIcon,
  UnpinIcon,
} from '@/components/Icon';
import { handleAgentList } from '@/utils/agent';

interface ChatDialogProps {
  chatId: string;
  type: string;
  openModal: () => void;
}

interface ChatDialogContent {
  create_time: number;
  msg_num: number;
  msgs: ChatMessageProps[] | null;
}

interface ChatMessageProps {
  timestamp: number;
  role: string;
  content: any;
  index?: number;
}
const antIcon = (
  <LoadingOutlined style={{ fontSize: 18, color: 'white' }} spin />
);

const GridItem = ({ onClick, title, example }: any) => (
  <div
    onClick={onClick}
    className={`chat-input-example p-5 w-full cursor-pointer ${example ? '' : 'flex align-item-center'}`}
  >
    <div
      className={`flex ${example ? '' : 'align-item-center'} flex-1 flex-wrap`}
    >
      <div className="text-sm text-gray-700 flex-1">{title}</div>
      <Arrow className="ml-auto w-9" />
    </div>
    {example ? (
      <div className="mt-2 font-normal text-sm text-gray-500 break-words">
        eg: {example}
      </div>
    ) : null}
  </div>
);

const ResponsiveGrid = ({
                          setUserInput,
                          isUniswap,
                        }: {
  setUserInput: (value: string) => void;
  isUniswap: boolean;
}) => {
  const handleClick = (item: any) => {
    setUserInput(item.desc || item.example || item.title);
  };

  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {(isUniswap ? uniswapQuickQuestion : wytQuickQuestion).map(
        (item, index) => (
          <GridItem key={index} onClick={() => handleClick(item)} {...item} />
        ),
      )}
    </div>
  );
};

const ChatDialog = (
  props: IRouteComponentProps & ChatDialogProps & UmiComponentProps & ChatModel,
) => {
  const { chatId, type, agentList, dispatch } = props;
  const [showBox, setShowBox] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [askAvailable, setAskAvailable] = useState(true);
  const [isTransparent, setIsTransparent] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const [scrollTop, setScrollTop] = useState(0);
  const [projectList, setProjectList] = useState<ProjectItem>({
    UNISWAP_ID: '',
    WYT_ID: '',
  });
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ChatDialogContent>({
    create_time: 0,
    msg_num: 0,
    msgs: null,
  });

  const filterAgentList = (agentList || []).filter((li) => li.pin_status);

  const isUniswap = type === 'uniswap';
  const { isSignedIn } = useWallet();
  const { walletAddress } = useSession();

  const updateChatHistory = async () => {
    if (chatId) {
      const getChatHistoryResult = await getChatHistory(chatId);
      if (getChatHistoryResult?.code === 0) {
        setContent({
          create_time: getChatHistoryResult.data.create_time || 0,
          msg_num: getChatHistoryResult.data.msg_num || 0,
          msgs: (getChatHistoryResult.data.msgs || []).reverse(),
        });
      }
    }
  };

  const queryChatHistory = async () => {
    if (chatId) {
      setIsLoading(true);
      const getChatHistoryResult = await getChatHistory(chatId);
      if (getChatHistoryResult?.code === 0) {
        setContent({
          create_time: getChatHistoryResult.data.create_time || 0,
          msg_num: getChatHistoryResult.data.msg_num || 0,
          msgs: (getChatHistoryResult.data.msgs || []).reverse(),
        });
      }
      setIsLoading(false);
    } else {
      setContent({
        create_time: 0,
        msg_num: 0,
        msgs: null,
      });
    }
  };

  useEffect(() => {
    queryChatHistory();
  }, [chatId]);

  useEffect(() => {
    if (userInput.length > 0) {
      setShowBox(false);
    }
  }, [userInput]);

  useEffect(() => {
    const element = document.getElementById('chat-container');
    // @ts-ignore
    container?.scrollTo({
      top: (element?.scrollHeight || 0) - (element?.clientHeight || 0) + 200,
      behavior: 'smooth',
    });
    const chatContainer = document.getElementById('chat-container');
    chatContainer?.addEventListener('scroll', () => {
      if (
        chatContainer.scrollHeight -
        (chatContainer.scrollTop + chatContainer.clientHeight) <
        10
      ) {
        setIsTransparent(false);
      } else {
        setIsTransparent(true);
      }
    });
  }, [container, content]);

  const ask = async (e: any) => {
    if (e.nativeEvent.isComposing) return;
    if (!askAvailable) return;
    if (!isSignedIn) {
      props.openModal();
      return;
    }

    if (!userInput) return;
    let id = chatId;
    let isNewChat = false;
    if (chatId === '') {
      const creatChatResult = await createChat({
        project_id: isUniswap ? projectList.UNISWAP_ID : projectList.WYT_ID,
      });
      if (creatChatResult.code === 0) {
        id = creatChatResult.data.id;
        isNewChat = true;
      }
    }
    setContent({
      create_time: content.create_time,
      msg_num: content.msg_num + 1,
      msgs: [
        ...(content.msgs || []),
        {
          role: 'user',
          timestamp: new Date().getMilliseconds(),
          content: {
            content: userInput,
          },
        },
        {
          role: 'loading',
          timestamp: new Date().getMilliseconds(),
          content: '',
        },
      ],
    });
    setUserInput('');
    const askValue = {
      id,
      type: 'user',
      project_id: isUniswap ? projectList.UNISWAP_ID : projectList.WYT_ID,
      msg: userInput,
    };
    setAskAvailable(false);
    const onChatResult = await onChat(askValue);
    setAskAvailable(true);
    updateChatHistory();

    if (isNewChat) {
      // @ts-ignore
      history.push({
        pathname:
          onChatResult.code === 0 && isUniswap ? '/uniswap-chat' : '/chat',
        query: {
          id,
        },
      });
    }
  };

  const handleInputFocus = (inputValue) => {
    setUserInput(inputValue);
    // @ts-ignore
    inputRef.current?.focus();
    setShowBox(false);
  };

  const getImg = () => {
    if (isUniswap)
      return (
        <div className="relative" style={{ top: -46, left: 0 }}>
          <img style={{ width: 56 }} src={uniswapPng} alt="logo" />
        </div>
      );
    return (
      <div className="relative" style={{ top: -55, left: -40 }}>
        <img style={{ width: 100 }} src="/gif/chat_bot.gif" alt="logo" />
      </div>
    );
  };

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

  const handleUniswapAdd = async () => {
    history.push('/uniswap-chat');
  };

  const handleChangePin = async () => {
    const filterUniswapAgent = (agentList || []).filter((li) =>
      li.project_name?.includes('Uniswap'),
    );
    try {
      setLoading(true);
      let res: any;
      if (filterAgentList.length > 1) {
        res = await unpinAgent({
          project_id: filterUniswapAgent[0]?.project_id,
        });
      } else {
        res = await pinAgent({
          project_id: filterUniswapAgent[0]?.project_id,
        });
      }

      if (res.code === 0) {
        await handleAgentList(dispatch);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const handleClickItem = async (item: any) => {
    setUserInput(item.title);
    // @ts-ignore
    inputRef.current?.focus();
    setShowBox(false);
  };

  return (
    <>
      <div className="w-full flex flex-col pb-10 h-full pt-4 px-6 md:px-4">
        {isUniswap && !isLoading ? (
          <div
            className="flex w-full mx-auto"
            style={{ maxWidth: 800, background: 'rgba(0,0,0,0)' }}
          >
            <div
              className="uniswap-pin"
              style={{
                boxShadow:
                  scrollTop > 20 ? '0 4px 32px rgba(0,0,0,.15)' : '0 0 0',
              }}
            >
              {loading ? (
                <LoadingOutlined style={{ fontSize: 20 }} spin />
              ) : (
                <Icon
                  onClick={handleChangePin}
                  component={filterAgentList.length > 1 ? UnpinIcon : PinIcon}
                />
              )}
              <Icon onClick={handleUniswapAdd} component={AddIcon} />
            </div>
          </div>
        ) : null}
        {isLoading && (content.msgs || []).length === 0 && (
          <div className="flex-1">
            <div
              className="mx-auto loading-dialog w-full h-80 flex flex-col"
              style={{ maxWidth: 800 }}
            >
              <Loading className="mt-auto mx-auto" />
              <div className="mb-auto mt-9 text-sm text-gray-400 text-center">
                Loading
              </div>
            </div>
          </div>
        )}
        {(!chatId || (content.msgs || []).length === 0) && !isLoading && (
          <div
            className="dialog"
            style={{ height: '80%', overflowY: 'auto' }}
            onScroll={handleScroll}
          >
            {isUniswap ? (
              <div className="mx-auto" style={{ maxWidth: 800 }}>
                <div className="flex w-full justify-center mt-1 mb-5">
                  <img src={uniswapPng} width={64} alt="Logo" />
                </div>
                <div className="flex w-full justify-center gap-2.5 text-2xl font-bold text-[#3C465A]">
                  <span>Uniswap Agent</span>
                  <Icon component={uniswapPageIcon} />
                </div>
                <div className="mt-3 text-center mb-5 text-sm text-[#A0A8C0]">
                  By uniswap.org
                </div>
                <div className="text-center mb-10 text-sm text-[rgba(0,0,0,.7)]">
                  Uniswap V3 helper, answers any questions about Uniswap and
                  facilitates quick swaps.
                </div>
                {uniswapQuestion.map((item) => (
                  <div
                    style={{ paddingTop: 19, paddingBottom: 19 }}
                    onClick={() => handleClickItem(item)}
                    className="mt-2 w-full p-5 rounded-3xl border-gray-300 border flex cursor-pointer"
                  >
                    <Idea />
                    <div className="flex ml-2.5 align-item-center">
                      <div className="font-bold text-base text-gray-700">
                        {item.title}
                      </div>
                    </div>
                    {/* <Arrow className="mt-3" /> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto" style={{ maxWidth: 800 }}>
                <ChatDialogLogo className="mt-16" />
                <div
                  className="mt-5 pb-9 text-3xl font-bold text-gray-700"
                  style={{ textTransform: 'uppercase' }}
                >
                  whatever you think
                </div>
                {wytQuestion.map((item) => (
                  <div
                    style={{ paddingTop: 19, paddingBottom: 19 }}
                    className="mt-2 w-full p-5 rounded-3xl border-gray-300 border flex"
                  >
                    <Idea />
                    <div className="flex-grow ml-2.5">
                      <div className="font-bold text-base text-gray-700">
                        {item.title}
                      </div>
                      <div className="text-gray-400 text-sm font-normal">
                        {item.desc}
                      </div>
                    </div>
                    {/* <Arrow className="mt-3" /> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {((chatId && content.msgs) || []).length > 0 && (
          <div
            id="chat-container"
            onScroll={handleScroll}
            className="flex-auto py-16 overflow-y-auto overflow-x-visible dialog pr-2 mb-3"
            ref={setContainer}
          >
            <div
              id="chat-content"
              className="h-full w-full mx-auto"
              style={{ maxWidth: 800 }}
            >
              {(content.msgs || []).map((msg, index) => {
                return (
                  <>
                    {(msg.role === 'user' || msg.role === 'user_builtin') && (
                      <div
                        className={`chat-box py-5 px-5 ${
                          index === 0 ? '' : 'mt-12'
                        }`}
                        style={{
                          background: 'rgba(24, 172, 198, 0.2)',
                          border: '1px solid #18ACC6',
                        }}
                      >
                        <div className="h-0 w-full flex">
                          <div
                            className="chat-user relative  ml-auto"
                            style={{ top: -45, left: -10 }}
                          >
                            <AvatarImage
                              walletAddress={walletAddress ?? ""}
                              size={56}
                              className={'h-14 w-14'}
                            />
                          </div>
                        </div>
                        <div className="text-gray-600 font-bold text-sm">
                          {msg.content.content}
                        </div>
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <div
                        key={`chat-index-${msg.index}`}
                        className={`chat-box py-5 px-5 ${
                          index === 0 ? '' : 'mt-12'
                        }`}
                      >
                        <div className="h-0 w-full flex">{getImg()}</div>
                        <div className="flex">
                          {msg.content.type !== 'fill' &&
                            msg.content.type !== 'general_answer' && (
                              <div className="mt-5 text-gray-500 z-10 text-sm">
                                {msg.content.tips ||
                                  'No information found, please try again or modify your prompt. '}
                              </div>
                            )}
                          {msg.content.type === 'fill' &&
                            msg.content.type !== 'general_answer' && (
                              <div className="mt-5 text-gray-500 z-10 text-sm">
                                {msg.content.fill ||
                                  'No information found, please try again or modify your prompt. '}
                              </div>
                            )}

                          {/* {getOverView(msg.content)} */}
                        </div>
                        {msg.content.type === 'project_info' && (
                          <ProjectInfo projectInfo={msg.content.project_info} />
                        )}
                        {msg.content.type === 'project_compare' && (
                          <ProjectCompare info={msg.content.project_compare} />
                        )}

                        {msg.content.type === 'uniswap' ? (
                          <>
                            <SwapIframe
                              src={
                                msg.content?.uniswap?.uniswap?.func_calling_ret
                                  ?.uniswap?.url || 'https://app.uniswap.org'
                              }
                            />
                          </>
                        ) : null}
                        {msg.content.type === 'swap' ? (
                          <>
                            <ProjectSwap
                              info={{
                                ...msg.content?.swap_info?.swap
                                  ?.func_calling_ret.fc_swap_result,
                              }}
                              isActive={index + 1 === content.msg_num}
                            />
                          </>
                        ) : null}
                        {msg.content.type === 'daily_new_token' ? (
                          <TokenChart
                            isActive={index + 1 === content.msg_num}
                            initList={
                              msg.content?.daily_new_token?.daily_new_token
                                ?.func_calling_ret?.daily_new_token
                                ?.daily_new_token?.rows || []
                            }
                          />
                        ) : null}
                        {msg.content.type ===
                        'token_launched_time_distribution' ? (
                          <LaunchCountChart
                            initList={
                              msg.content?.token_launched_time_distribution
                                ?.token_launched_time_distribution
                                ?.func_calling_ret
                                ?.token_launched_time_distribution
                                ?.token_launched_time_distribution?.rows || []
                            }
                            isActive={index + 1 === content.msg_num}
                          />
                        ) : null}
                        {msg.content.type === 'daily_token_swap_count' ? (
                          <TransactionsChart
                            initList={
                              msg.content?.daily_token_swap_count
                                ?.daily_token_swap_count?.func_calling_ret
                                ?.daily_token_swap_count?.tx_counts?.rows || []
                            }
                            isActive={index + 1 === content.msg_num}
                          />
                        ) : null}
                        {msg.content.type === 'top_trader' ? (
                          <PumpTop
                            initList={
                              msg.content?.top_trader?.top_trader
                                ?.func_calling_ret?.top_trader?.top_traders
                                ?.rows || []
                            }
                            isActive={index + 1 === content.msg_num}
                            onClick={async (hash) => {
                              setContent({
                                create_time: content.create_time,
                                msg_num: content.msg_num + 1,
                                msgs: [
                                  ...(content.msgs || []),
                                  {
                                    role: 'user',
                                    timestamp: new Date().getMilliseconds(),
                                    content: {
                                      content: `pump.fun trader ${hash}`,
                                    },
                                  },
                                  {
                                    role: 'loading',
                                    timestamp: new Date().getMilliseconds(),
                                    content: '',
                                  },
                                ],
                              });
                              const askValue = {
                                id: chatId,
                                type: 'user',
                                project_id: isUniswap
                                  ? projectList.UNISWAP_ID
                                  : projectList.WYT_ID,
                                related_msg_index: msg.index,
                                msg: `pump.fun trader ${hash}`,
                              };
                              const onChatResult = await onChat(askValue);
                              if (onChatResult.code === 0) {
                                updateChatHistory();
                              }
                            }}
                          />
                        ) : null}
                        {msg.content.type === 'trader_overview' ? (
                          <PumpTopDetail
                            initObj={
                              msg.content?.trader_overview?.trader_overview
                                ?.func_calling_ret?.trader_overview
                                ?.trader_details || {}
                            }
                            isActive={index + 1 === content.msg_num}
                          />
                        ) : null}

                        {msg.content.type === 'general_answer' ? (
                          <div className="pt-5">
                            <Markdown
                              options={{
                                wrapper: 'aside',
                                forceWrapper: true,
                                slugify: (str) => str,
                                overrides: {
                                  h3: {
                                    component: ({ children, ...rest }) => (
                                      <div {...rest}>{children}</div>
                                    ),
                                    props: {
                                      className: 'markdown-h3',
                                    },
                                  },
                                  h2: {
                                    component: ({ children, ...rest }) => (
                                      <div {...rest}>{children}</div>
                                    ),
                                    props: {
                                      className: 'markdown-h2',
                                    },
                                  },
                                  h1: {
                                    component: ({ children, ...rest }) => (
                                      <div {...rest}>{children}</div>
                                    ),
                                    props: {
                                      className: 'markdown-h1',
                                    },
                                  },
                                  code: {
                                    component: ({ children, ...rest }) => (
                                      <code {...rest}>{children}</code>
                                    ),
                                    props: {
                                      className: 'markdown-code',
                                    },
                                  },
                                },
                                renderRule(next, node) {
                                  if (node.lang) {
                                    return (
                                      <CodeMirror
                                        onBeforeChange={() => {}}
                                        // editorDidMount={editor => {
                                        //   this.instance = editor;
                                        // }}
                                        value={node?.text || ''}
                                        options={{
                                          theme: 'base16-light',
                                          placeholder: '',
                                          lineWrapping: 'wrap',
                                          autoCursor: true,
                                          lineNumbers: true,
                                          matchBrackets: true,
                                          autoCloseBrackets: true,
                                        }}
                                        onChange={() => {}}
                                      />
                                    );
                                  }

                                  return next();
                                },
                                sanitizer: (value, tag, attribute) => value,
                              }}
                              children={
                                msg.content?.general_answer?.general_answer
                                  ?.content ||
                                'No information found, please try again or modify your prompt. '
                              }
                            />
                          </div>
                        ) : null}
                      </div>
                    )}

                    {(msg.content?.type === 'project_info' ||
                      msg.content?.type === 'project_compare') && (
                      <div>
                        <div className="mt-3 text-gray-600 text-sm font-normal ml-5 mb-2.5">
                          More info:
                        </div>
                        <div className="flex flex-wrap pl-5">
                          {(overviewSubItems || []).map((item) => {
                            return (
                              <div
                                onClick={async () => {
                                  setContent({
                                    create_time: content.create_time,
                                    msg_num: content.msg_num + 1,
                                    msgs: [
                                      ...(content.msgs || []),
                                      {
                                        role: 'user',
                                        timestamp: new Date().getMilliseconds(),
                                        content: {
                                          content: item.id,
                                        },
                                      },
                                      {
                                        role: 'loading',
                                        timestamp: new Date().getMilliseconds(),
                                        content: '',
                                      },
                                    ],
                                  });
                                  const askValue = {
                                    id: chatId,
                                    type: 'user_builtin',
                                    project_id: isUniswap
                                      ? projectList.UNISWAP_ID
                                      : projectList.WYT_ID,
                                    related_msg_index: msg.index,
                                    msg: item.id.toLowerCase(),
                                  };
                                  const onChatResult = await onChat(askValue);
                                  if (onChatResult.code === 0) {
                                    updateChatHistory();
                                  }
                                }}
                                key={item.id}
                                className={`py-1.5 px-6 mr-2 mb-2.5 text-sm text-gray-700 hover:text-gray-500 cursor-pointer bg-white chat-more-info`}
                              >
                                {item.id}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {(msg.content?.type === 'daily_new_token' ||
                      msg.content?.type ===
                      'token_launched_time_distribution' ||
                      msg.content?.type === 'daily_token_swap_count' ||
                      msg.content?.type === 'top_trader' ||
                      msg.content?.type === 'trader_overview') && (
                      <div>
                        <div className="mt-3 text-gray-600 text-sm font-normal ml-5 mb-2.5">
                          More info:
                        </div>
                        <div className="flex flex-wrap pl-5">
                          {chartSubItems.map((item) => {
                            return (
                              <div
                                onClick={async () => {
                                  setContent({
                                    create_time: content.create_time,
                                    msg_num: content.msg_num + 1,
                                    msgs: [
                                      ...(content.msgs || []),
                                      {
                                        role: 'user',
                                        timestamp: new Date().getMilliseconds(),
                                        content: {
                                          content: item.desc,
                                        },
                                      },
                                      {
                                        role: 'loading',
                                        timestamp: new Date().getMilliseconds(),
                                        content: '',
                                      },
                                    ],
                                  });
                                  const askValue = {
                                    id: chatId,
                                    type: 'user',
                                    project_id: isUniswap
                                      ? projectList.UNISWAP_ID
                                      : projectList.WYT_ID,
                                    related_msg_index: msg.index,
                                    msg: item.desc,
                                  };
                                  const onChatResult = await onChat(askValue);
                                  if (onChatResult.code === 0) {
                                    updateChatHistory();
                                  }
                                }}
                                key={item.id}
                                className={`py-1.5 px-6 mr-2 mb-2.5 text-sm text-gray-700 hover:text-gray-500 cursor-pointer bg-white chat-more-info`}
                              >
                                {item.id}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {msg.role === 'loading' && (
                      <div
                        className={`border rounded-2xl border-gray-300 py-5 px-5 ${'mt-12'}`}
                      >
                        <div className="h-0 w-full flex">{getImg()}</div>
                        <div className="w-full text-center text-gray-500">
                          Loading...
                        </div>
                      </div>
                    )}
                    {msg.role === 'system' && (
                      <div
                        className={`border rounded-2xl border-red-500 bg-red-50 py-5 px-5 ${'mt-12'}`}
                      >
                        <div className="h-0 w-full flex">{getImg()}</div>
                        <div className="w-full text-center text-red-500">
                          {msg.content.content}
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        )}
        <div className="mx-14 mt-auto h-0">
          <div
            className={`p-5 rounded-2xl mx-auto w-full relative ${
              showBox
                ? isUniswap
                  ? 'UniswapSuggestBoxIn'
                  : 'SuggestBoxIn'
                : isUniswap
                  ? 'UniswapSuggestBoxOut'
                  : 'SuggestBoxOut'
            }`}
            style={{
              background: 'rgba(209, 213, 219, 0.3)',
              backdropFilter: 'blur(10px)',
              top: -500,
              zIndex: 20,
              maxWidth: 800,
            }}
          >
            <div>
              <div className="h-0 w-160 flex">
                {isUniswap ? (
                  <div
                    className="relative"
                    style={{ top: -55, left: 0, zIndex: -1 }}
                  >
                    <img style={{ width: 56 }} src={uniswapPng} alt="logo" />
                  </div>
                ) : (
                  <div
                    className="relative"
                    style={{ top: -75, left: -20, zIndex: -1 }}
                  >
                    <img
                      style={{ width: 100 }}
                      src="/gif/chat_bot.gif"
                      alt="logo"
                    />
                  </div>
                )}
              </div>
              <div className="text-base font-bold z-50">
                You can ask me like this:
              </div>
              <ResponsiveGrid
                isUniswap={isUniswap}
                setUserInput={handleInputFocus}
              />
            </div>
          </div>
        </div>
        {isTransparent && (
          <div className="h-0">
            <div
              className="relative h-20 bg-gradient-to-b from-transparent to-gray-50 mx-auto"
              style={{ top: -80, maxWidth: 800 }}
            />
          </div>
        )}
        {/*Input*/}
        {/*<div*/}
        {/*  className="mt-5 z-10 lg:max-w-4xl mx-auto w-full"*/}
        {/*  style={{ left: '1.25rem' }}*/}
        {/*>*/}
        {/* */}
        {/*</div>*/}

        <div
          className="mx-auto mt-5 w-full z-10 p-5 flex justify-center chat-input-box"
          style={{ maxWidth: 800 }}
        >
          <Input
            onFocus={() => {
              if (userInput.length === 0) {
                setShowBox(true);
              }
            }}
            // @ts-ignore
            ref={inputRef}
            onBlur={() => setShowBox(false)}
            placeholder={
              isSignedIn
                ? 'Ask me anything...'
                : 'Sign to unlock the power of WYT AI agent'
            }
            value={userInput}
            onChange={(e) => {
              if (userInput.length === 0) {
                setShowBox(true);
              }
              setUserInput(e.target.value);
            }}
            variant={'borderless'}
            onPressEnter={ask}
            disabled={!isSignedIn}
          />
          <div
            onClick={ask}
            className={`h-11 ${isSignedIn ? 'w-28' : 'w-40'} text-center ${
              (askAvailable && userInput) || !isSignedIn
                ? 'bg-gray-600'
                : 'bg-gray-400'
            } text-white pt-3 font-normal text-sm rounded-2xl cursor-pointer hover:bg-gray-400 active:bg-gray-800`}
            style={{
              cursor:
                (askAvailable && userInput) || !isSignedIn
                  ? 'pointer'
                  : 'not-allowed',
            }}
          >
            {isSignedIn ? 'Ask' : 'Connect wallet'}
            {!askAvailable && (
              <span>
                <Spin
                  style={{ marginLeft: 5, marginTop: -5 }}
                  indicator={antIcon}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default connect((state: { chat: ChatModel }) => ({
  chatList: state.chat.chatList,
  projectList: state.chat.projectList,
  agentList: state.chat.agentList,
}))(ChatDialog);
// export default ChatDialog;
