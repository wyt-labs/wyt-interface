import ethImg from '@/assets/chat/eth.png';
import unisawpImg from '@/assets/chat/uniswap.png';
import solImg from '@/assets/chat/sol.png';
import rippleImg from '@/assets/chat/ripple.png';
import avenImg from '@/assets/chat/aven.png';
import bnbImg from '@/assets/chat/bnb.png';
import { getAgentList } from '@/services/chat';
export const HotCategories = [
  { title: 'Layer1' },
  { title: 'Infrastructure' },
  { title: 'Defi' },
  { title: 'Privacy' },
  { title: 'StableCoin' },
  { title: 'NFT' },
  { title: 'Layer1' },
];

export const HotTrends = [
  {
    id: 0,
    title: 'Uniswap Agent',
    icon: unisawpImg,
    star: '4.7',
    startNum: 1000,
    conversationsNum: 900,
    tags: ['Defi', 'Dex'],
    desc: 'Uniswap V3 helper, answers any questions about Uniswap and facilitates quick swaps.',
    network: 'uniswap.org',
    starters: [
      'What is Uniswap?',
      'Where can I find more information about Uniswap?',
      'How does the Uniswap protocol compare to a typical market?',
      'Swap',
    ],
    capabilities: ['Answer any questions about Uniswap.', 'Swap tokens.'],
  },
  {
    id: 1,
    title: 'Ethereum Expert',
    icon: ethImg,
    star: '4.7',
    startNum: '1000',
    tags: ['Layer1', 'Infra'],
    desc: 'Expert in Ethereum blockchain analysis via Etherscan API ...',
  },
  {
    id: 2,
    title: 'SOL SDK Expert',
    icon: solImg,
    star: '3.9',
    startNum: '600',
    tags: ['Layer1', 'Infra'],
    desc: 'Senior Solana blockchain developer',
  },
  {
    id: 3,
    title: 'Ripple Effects',
    icon: rippleImg,
    star: '3.5',
    startNum: '500',
    tags: ['Payment'],
    desc: 'Detailing the future impact of XRP',
  },
];

export const likeChainList = [
  {
    id: 0,
    title: 'Aave Earn Interest ',
    icon: avenImg,
    star: '4.3',
    startNum: '400',
    tags: ['Defi'],
    desc: '🚀💰 Welcome to Aave Interest Pro!',
  },
  {
    id: 1,
    title: 'ChatBNB',
    icon: bnbImg,
    star: '4.3',
    startNum: '1000',
    tags: ['Layer1', 'Infra'],
    desc: 'Advanced Smart Contract and DApp assistant and code generator',
  },
  {
    id: 2,
    title: 'Maker Community',
    icon: solImg,
    star: '3.9',
    startNum: '100',
    tags: ['Defi', 'Stablecoin'],
    desc: '🤖✨ Dive into the world of community with expert insights on Maker DAO\n',
  },
  {
    id: 3,
    title: 'Lido Finance Assistant',
    icon: solImg,
    star: '3.5',
    startNum: '400',
    tags: ['Defi'],
    desc: 'A finance-focused assistant providing knowledge and specific link-based answers\n',
  },
];

export const handleAgentList = async (dispatch) => {
  const res = await getAgentList();
  if (res?.code === 0) {
    // const filterAgentList = (res.data.list || []).filter(li => li.pin_status);
    dispatch({
      type: 'chat/setAgentList',
      payload: res.data.list,
    });
  }
};
