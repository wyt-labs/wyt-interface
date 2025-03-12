import { Input, Drawer, Divider } from 'antd';
import Icon, {
  SearchOutlined,
  StarFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  HotCategories,
  HotTrends,
  likeChainList,
  handleAgentList,
} from '@/utils/agent';
import AgentCard from '@/pages/Chat/components/AgentCard';
import { DoubleDownIcon, DrawIcon, OkIcon } from '@/components/Icon';
import './index.less';
import React, { useState } from 'react';
import { exchangeUnit } from '@/utils/chart';
import { ChatModel } from '@/utils/model';
import { pinAgent } from '@/services/chat';
import { connect, history } from 'umi';

const AgentHub = (props: ChatModel) => {
  const { agentList, dispatch } = props;
  const [open, setOpen] = useState(false);
  const [drawItem, setDrawItem] = useState<any>(HotCategories[0]);
  const [loading, setLoading] = useState(false);
  const handleClick = (item) => {
    setDrawItem(item);
    setOpen(true);
  };

  const handleStart = async () => {
    const filterAgentList = (agentList || []).filter((li) => li.pin_status);
    if (filterAgentList.length > 1) {
      history.push('/uniswap-chat');
    } else {
      setLoading(true);
      try {
        const filterUniswapAgent = (agentList || []).filter((li) =>
          li.project_name?.includes('Uniswap'),
        );
        const res = await pinAgent({
          project_id: filterUniswapAgent[0]?.project_id,
        });
        if (res.code === 0) {
          await handleAgentList(dispatch);
          history.push('/uniswap-chat');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center w-full overflow-y-scroll">
      <div
        className="flex justify-center"
        style={{
          paddingTop: 60,
          paddingBottom: 20,
          width: '80%',
          minWidth: 717,
        }}
      >
        <div>
          <div>
            <div
              className="text-center text-[#000] font-bold"
              style={{ fontSize: 40 }}
            >
              Agent Hub
            </div>
            <div className="text-center px-8 text-[#6B7280] mt-2">
              Explore and craft customized agent that integrate guidelines,
              additional insights, and a mix of various skills.
            </div>
            <div className="mt-4">
              <Input
                style={{
                  fontSize: 14,
                  height: 56,
                  borderRadius: 20,
                  color: '#2D3748',
                }}
                rootClassName="chat-input"
                placeholder="Search..."
                prefix={
                  <SearchOutlined
                    style={{
                      color: '#D1D5DB',
                      paddingLeft: 6,
                      paddingRight: 4,
                    }}
                  />
                }
              />
            </div>
          </div>
          <div>
            <div className="agent-title">Hot Categories</div>
            <div className="flex gap-2">
              {HotCategories.map((item) => (
                <div className="agent-tag" key={item.title}>
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="agent-title" style={{ marginBottom: 4 }}>
              Hot Trends
            </div>
            <div className="agent-desc">
              The most popular extentions in our community
            </div>
            <div className="flex gap-2 flex-wrap">
              {HotTrends.map((item, index) => (
                <AgentCard
                  onClick={(li) => {
                    if (index === 0) handleClick(li);
                  }}
                  {...item}
                  isActive={index === 0}
                />
              ))}
            </div>
            <div className="text-sm text-[rgba(0,0,0,0.25)] mt-4 flex justify-center gap-2">
              <div>See more</div>
              <Icon component={DoubleDownIcon} />
            </div>
          </div>

          <div>
            <div className="agent-title">You May Like</div>
            <div className="flex gap-2 flex-wrap">
              {likeChainList.map((item) => (
                <AgentCard {...item} isActive={false} />
              ))}
            </div>
            <div className="text-sm text-[rgba(0,0,0,0.25)] mt-4 flex justify-center gap-2 pb-5">
              <div>See more</div>
              <Icon component={DoubleDownIcon} />
            </div>
          </div>
        </div>
      </div>
      {/*<div className='agent-drawer'>*/}
      {/*  */}
      {/*</div>*/}

      <Drawer
        destroyOnClose
        title={null}
        open={open}
        mask={false}
        onClose={() => setOpen(false)}
        getContainer={false}
        width={420}
        placement="right"
        footer={
          <div
            onClick={handleStart}
            className={`h-10 w-full flex gap-2 align-item-center justify-center bg-gray-600 text-white font-normal text-sm rounded-2xl cursor-pointer ${loading ? 'bg-gray-400' : 'hover:bg-gray-400 active:bg-gray-800'}`}
            style={{ cursor: 'pointer' }}
          >
            <span>Start Chat</span>
            {loading ? <LoadingOutlined /> : null}
          </div>
        }
      >
        <div>
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <img width={64} src={drawItem.icon} alt="" />
            </div>
            <div
              className="flex justify-center mb-3 text-[#3C465A] text-xl gap-2.5"
              style={{ fontWeight: 700 }}
            >
              <span>{drawItem.title}</span>
              <Icon component={DrawIcon} />
            </div>
            <div className="flex justify-center gap-1 mb-3">
              {(drawItem.tags || []).map((item) => (
                <div
                  key={item}
                  className="text-xs px-3 py-0.5 text-[#18ACC6] font-bold agent-card-tag"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="text-[#A0A8C0] text-sm mb-5">
              By <span>{drawItem.network}</span>
            </div>
            <div className="text-[rgba(0, 0, 0, 0.7)] text-sm mb-10">
              {drawItem.desc}
            </div>
            <div className="flex justify-center mb-8" style={{ fontSize: 16 }}>
              <div>
                <div className="flex justify-center gap-1 mb-2">
                  <StarFilled style={{ color: '#FFDD00', fontSize: 20 }} />
                  <div className="text-[#111827] font-bold">
                    {drawItem.star}
                  </div>
                </div>
                <div className="text-[#A0A8C0] text-xs">
                  Ratings ({exchangeUnit(drawItem.startNum)})
                </div>
              </div>

              <Divider
                style={{ height: 54, margin: '0 16px' }}
                type="vertical"
              />
              <div>
                <div className="flex justify-center mb-2">
                  <div className="text-[#111827] font-bold">
                    {drawItem.conversationsNum}+
                  </div>
                </div>
                <div className="text-[#A0A8C0] text-xs"> Conversations </div>
              </div>
            </div>
          </div>
          {drawItem.starters ? (
            <div className="mb-8">
              <div
                className="text-[#111827]"
                style={{ fontWeight: 700, fontSize: 16 }}
              >
                Conversation Starters
              </div>
              <div>
                {(drawItem.starters || []).map((item) => (
                  <div className="drawer-stars">{item}</div>
                ))}
              </div>
            </div>
          ) : null}

          {drawItem.capabilities ? (
            <div className="mb-8 pb-10">
              <div
                className="text-[#111827] mb-3"
                style={{ fontWeight: 700, fontSize: 16 }}
              >
                Capabilities
              </div>
              <div>
                {(drawItem.capabilities || []).map((item) => (
                  <div className="flex gap-1 text-[rgba(0, 0, 0, 0.7)] mb-2">
                    <Icon component={OkIcon} />
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Drawer>
    </div>
  );
};

export default connect((state: { chat: ChatModel }) => ({
  agentList: state.chat.agentList,
}))(AgentHub);
