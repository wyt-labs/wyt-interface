import { listChats } from '@/services/chat';
import type { UmiComponentProps } from '@/utils/common';
import type { UserModel } from '@/utils/model';
import React, { useEffect, useState, useCallback } from 'react';
import type { IRouteComponentProps } from 'umi';
import { connect } from 'umi';
import ChatDialog from './components/ChatDialog';
import ConnectWalletModal from '@/components/Modal/ConnectWalletModal';
import { NativeModal } from '@/components/Modal/NativeModal';

interface chatProps {
  isLogin: boolean;
  account: string;
}

const ChatPage = (
  props: IRouteComponentProps & UmiComponentProps & chatProps,
) => {
  const { location } = props;
  const [chatId, setChatId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listUserChats = async (id?: string) => {
    const listChatsResult = await listChats();
    if (listChatsResult?.code === 0) {
      setChatId(id || '');
    }
  };

  useEffect(() => {
    setChatId(location.query?.id || '');
  }, [location.query?.id]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <ChatDialog
        chatId={chatId}
        type="wyt"
        newChat={listUserChats}
        openModal={openModal}
      />
      <NativeModal
        openModal={isModalOpen}
        closeModal={closeModal}
        className={'w-full max-w-[500px]'}
      >
        <ConnectWalletModal closeModal={closeModal} />
      </NativeModal>
    </>
  );
};

export default connect()(ChatPage);
