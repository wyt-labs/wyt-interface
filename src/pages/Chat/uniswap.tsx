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

  useEffect(() => {
    setChatId(location.query?.id || '');
  }, [location]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <ChatDialog type="uniswap" chatId={chatId} openModal={openModal} />
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

export default connect((state: { user: UserModel }) => ({
  isLogin: state.user.isLogin,
  account: state.user.account,
}))(ChatPage);
