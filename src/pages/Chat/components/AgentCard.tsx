import React, { useState } from 'react';
import { StarFilled } from '@ant-design/icons';
import './AgentCard.less';
import { exchangeUnit } from '@/utils/chart';

interface CardItem {
  id: number;
  title: string;
  icon: any;
  star: string;
  startNum: number;
  tags: string[];
  desc: string;
  isActive: boolean;
  onClick?: (item) => void;
}

const AgentCard = (props: CardItem) => {
  const { onClick, ...extra } = props;

  const handleClick = () => {
    if (onClick) {
      onClick(extra);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3 ${extra.isActive ? 'agent-card' : 'agent-card-disabled'}`}
    >
      <div className="flex gap-2">
        <img width={48} height={48} src={extra.icon} alt="" />
        <div>
          <div className="font-bold">{extra.title}</div>
          <div className="flex gap-1">
            <div className="flex gap-1 py-0.5 pl-1 pr-2 align-item-center agent-card-star">
              <StarFilled style={{ color: '#FFDD00', width: 14 }} />
              <div className="text-xs text-[#111827] font-bold">
                {extra.star}
              </div>
              <div className="text-[#A0A8C0] agent-card-star-num">
                ({exchangeUnit(extra.startNum)})
              </div>
            </div>
            {(extra.tags || []).map((item) => (
              <div
                key={item}
                className="text-xs px-3 py-0.5 text-[#18ACC6] font-bold agent-card-tag"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-sm text-[rgba(0,0,0,.7)] mt-3">{extra.desc}</div>
    </div>
  );
};

export default AgentCard;
