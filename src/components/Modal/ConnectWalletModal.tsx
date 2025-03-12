import { AvatarImage } from '@/components/Avatar/Avatar';
import { useIsMobile } from '@/hooks/isMobile';
import { Api } from '@/lib/client';
import { getSignMessage } from '@/lib/constants';
import { LoadingOutlined } from '@ant-design/icons';
import { Progress, Spin } from 'antd';
import { LogOut, X } from 'lucide-react';
import { cloneElement, useCallback, useEffect, useState } from 'react';
import { WalletProvider, useSession, useWallet } from 'web3-connect-react';
import { AvailableProvider } from 'web3-connect-react/dist/common/availableProviders';
import { connect, history } from 'umi';

interface Props {
  closeModal: () => void;
}

const api = new Api();

/**
 * Return a string with length characters from the start and end of the content.
 * The middle characters are replaced with an ellipsis.
 * @param content The content to shorten
 * @param length number of characters to keep from the start and end
 */
const omitMiddle = (content: string, length: number) => {
  if (content.length <= length * 2) return content;
  return `${content.slice(0, length)}...${content.slice(-length)}`;
};

function WalletItem({
  provider,
  closeModal,
  dispatch,
}: {
  provider: WalletProvider;
  closeModal: () => void;
}) {
  const Image = cloneElement(provider.metadata.image as any, {
    className: 'rounded-lg p-1',
  });

  const { sdk, signIn } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = useCallback(
    async (provider: AvailableProvider) => {
      setIsLoading(true);
      await signIn(provider, {
        onSignedIn: async (walletAddress, provider, session) => {
          console.log('onSignedIn', session);
          sessionStorage.setItem('session', JSON.stringify(session));
          dispatch({
            type: 'user/setAccount',
            payload: walletAddress,
          });
          closeModal();
        },
        getSignInData: async (address, provider) => {
          const nonce = await api.api
            .getNonce({ addr: address })
            .then((res) => {
              if (res.data.code !== 0) {
                throw new Error(res.data.message);
              }
              return res.data.data;
            });
          const message = getSignMessage(address, nonce?.nonce!);
          const signature = await provider.signMessage(message, {
            forAuthentication: true,
          });
          const token = await api.api
            .signIn({
              addr: address,
              nonce: nonce?.nonce!,
              message: message,
              signature: signature,
            })
            .then((res) => {
              if (res.data.code !== 0) {
                throw new Error(res.data.message);
              }
              return res.data.data;
            });

          return {
            token: token?.token!,
            exp: token?.expired_date,
          };
        },
      })
        .catch((e) => {
          alert(e.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [sdk],
  );

  const handleClick = () => {
    if (!provider.isEnabled(sdk.walletProviders)) {
      window.open(provider.metadata.downloadLink);
      closeModal();
    } else {
      onSignIn(provider.metadata.name);
    }
  };

  return (
    <li key={provider.metadata.name} className={'w-full h-[80px]'}>
      <button
        // disabled={!provider.isEnabled(sdk.walletProviders)}
        onClick={handleClick}
        className={
          'flex flex-row bg-[#D1D5DB] bg-opacity-30 p-[15px] pr-[35px] pb-[15px] pl-5 rounded-[10px] w-full disabled:cursor-not-allowed h-full items-center hover:bg-opacity-50'
        }
      >
        <div className={'flex flex-row justify-between w-full'}>
          <div className={'flex-row flex space-x-2 items-center'}>
            <div
              className={`w-6 h-6 rounded-lg ${provider.metadata.name === 'MetaMask' ? 'bg-[#EAE0D7]' : 'bg-black'}`}
            >
              {Image}
            </div>
            <label className={'font-bold text-[#111827] text-sm'}>
              {provider.metadata.name} Wallet
            </label>
          </div>
          {isLoading && (
            <Spin
              indicator={<LoadingOutlined style={{ color: '#C4B5FD' }} spin />}
            />
          )}
          {!provider.isEnabled(sdk.walletProviders) ? (
            <div
              className={'text-[#A0A8C0] text-sm'}
              style={{
                border: '1px solid #A0A8C0',
                padding: '3px 8px',
                borderRadius: 8,
              }}
            >
              not installed
            </div>
          ) : null}
        </div>
      </button>
    </li>
  );
}
const ConnectWalletModal = ({ closeModal, dispatch }: Props) => {
  const { sdk, isSignedIn, signOut } = useWallet();
  const { walletAddress } = useSession();

  useEffect(() => {
    if (walletAddress) {
      dispatch({
        type: 'user/setAccount',
        payload: walletAddress,
      });
    }
  }, [walletAddress]);

  return (
    <div className={'flex p-8 justify-center items-center flex-col'}>
      <div className={'mx-auto w-full space-y-5'}>
        <button
          className={'absolute right-10 top-10'}
          onClick={() => {
            closeModal();
          }}
        >
          <X />
        </button>
        {!isSignedIn && (
          <img
            src={'/assets/logo1.png'}
            alt={'logo'}
            className={'mx-auto'}
            width={90}
            height={35}
          />
        )}
        {!isSignedIn && (
          <>
            <h1 className={'text-2xl font-bold text-[#111827] text-center'}>
              Sign in to WYT
            </h1>
            <p className={'text-[#6B7280] font-normal text-sm text-left'}>
              Get started with your wallet. By signing in to WYT, you agree to
              our Terms of Service and Privacy Policy.
            </p>
            <ul className={'space-y-5 mt-5'}>
              {sdk?.walletProviders
                .filter((p) => p.metadata.name.toLowerCase() === 'okx')
                .map((p) => (
                  <WalletItem
                    dispatch={dispatch}
                    key={p.metadata.name}
                    provider={p}
                    closeModal={closeModal}
                  />
                ))}
            </ul>
          </>
        )}

        {isSignedIn && (
          <>
            <h1 className={'text-2xl font-bold text-[#111827]'}>My Account</h1>
            <div className={'flex flex-row items-center space-x-2'}>
              <div>
                <AvatarImage
                  walletAddress={walletAddress ?? ''}
                  size={40}
                  className={'h-10 w-10'}
                />
              </div>
              <div className={'flex flex-col'}>
                <p className={'text-gray-500'}>Address</p>
                <p>{omitMiddle(walletAddress ?? '', 8)}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                dispatch({
                  type: 'user/setAccount',
                  payload: '',
                });
                history.push('/chat');
                closeModal();
              }}
              className={
                'flex flex-row justify-between bg-[#F7FAFC] p-[15px] pr-[35px] pb-[15px] pl-5 rounded-[10px] w-full disabled:cursor-not-allowed text-[#718096]'
              }
            >
              <span>Sign out</span>
              <LogOut />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default connect()(ConnectWalletModal);
