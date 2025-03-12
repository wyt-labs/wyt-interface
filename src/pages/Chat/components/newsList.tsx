import React, { useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import sanitizeHtml from 'sanitize-html';
import { Image, Spin } from 'antd';
import { useRssFeed } from '@/hooks/useRssFeed';
import dayjs from 'dayjs';
import { RSSItem } from '@/lib/rss';
import { isArray } from 'util';

const DEFAULT_ANIMATION_INTERVAL = 150;

const NewsItem = ({ item, show }: { item: RSSItem; show: boolean }) => (
  <Transition
    show={show}
    enter="transition-all duration-500"
    enterFrom="opacity-0 -translate-y-4 translate-x-10"
    enterTo="opacity-100 translate-y-0 translate-x-0"
    leave="transition-all duration-300"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div
      id={`news-item-${item.id}`}
      className={clsx([
        'mt-5',
        'transition-all ease-in-out',
        'data-[closed]:opacity-0 data-[closed]:-translate-y-4',
        'data-[enter]:duration-500',
        'data-[leave]:duration-300',
      ])}
    >
      <div className="flex">
        <div className="font-normal text-xs text-purple-500 mt-px">
          BLOCKBEATS OFFICIAL
        </div>
      </div>
      <a
        className="mt-1 font-bold text-base"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.title}
      </a>
      <div
        className="text-gray-400 mt-1 text-sm line-clamp-4"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(item.content, {
            allowedTags: ['p'],
          }),
        }}
      />
      {item.pic && <Image preview={false} src={item.pic} className="mt-1" />}
      <div className="text-gray-400 text-xs">
        {dayjs(item.creation_time).format('YYYY-MM-DD')}
      </div>
      <div className="mt-5 h-px w-full bg-gray-300" />
    </div>
  </Transition>
);

const NewsList = () => {
  const { isLoading, data } = useRssFeed();
  const [visibleStates, setVisibleStates] = useState<boolean[]>([]);
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) {
      return;
    }
    if (data && data.length > 0) {
      // Initialize all items as hidden
      setVisibleStates(new Array(data.length).fill(false));

      // Show items one by one
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex < data.length) {
          setVisibleStates((prev) => {
            const newState = [...prev];
            newState[currentIndex] = true;
            return newState;
          });

          currentIndex++;
        } else {
          hasShown.current = true;
          clearInterval(timer);
        }
      }, DEFAULT_ANIMATION_INTERVAL);

      return () => clearInterval(timer);
    }
  }, [data]);

  if (isLoading) {
    return <Spin className={'mt-5'} />;
  }

  return (
    <div className="px-5 pb-5 flex overflow-y-scroll flex-col">
      {(Array.isArray(data) ? data : []).map((item, index) => (
        <NewsItem
          key={item.url}
          item={item}
          show={visibleStates[index] ?? false}
        />
      ))}
    </div>
  );
};

export default NewsList;
