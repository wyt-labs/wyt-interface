import '@/global.less';
import { ReactComponent as Search } from '@/assets/svg/search.svg';
import { useState } from 'react';
import { useIntl, getLocale, setLocale } from 'umi';

const IndexPage = () => {
  const { formatMessage } = useIntl();
  const [searchText, setSearchText] = useState('');
  console.log(setLocale('en-US', false));

  const search = (e: React.KeyboardEvent | undefined) => {
    if (e && e.key === 'Enter') {
      console.log('Enter');
    }
  };

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    setSearchText(e?.target.value || '');
  };

  return (
    <div className="w-full">
      <div className="shadow h-16 pl-4">
        <div className="pt-4 flex">
          <Search
            className="mt-2 hover:cursor-pointer"
            width={20}
            height={20}
          />
          <input
            onKeyDown={search}
            className="ml-2 focus:outline-none"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={changeSearch}
          />
          <button className="ml-auto mr-4 bg-purple-500 px-4 py-1.5 rounded-lg text-white text-base font-medium hover:bg-purple-300 active:bg-purple-700">
            {formatMessage({ id: 'CONNECT_WALLET' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
