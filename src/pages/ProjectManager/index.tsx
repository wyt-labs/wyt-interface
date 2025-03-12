/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable react/jsx-key */
import '@/global.less';

import { useEffect, useState } from 'react';

import {
  Dropdown,
  Input,
  Modal,
  notification,
  Popover,
  Select,
  Table,
  Tooltip,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { history, useIntl } from 'umi';

import { ReactComponent as TableLoading } from '@/assets/svg/loading.svg';
import { ReactComponent as CrawlFiveColor } from '@/assets/svg/manager/crawl_five_color.svg';
import { ReactComponent as CrawlFiveGray } from '@/assets/svg/manager/crawl_five_gray.svg';
import { ReactComponent as CrawlFourColor } from '@/assets/svg/manager/crawl_four_color.svg';
import { ReactComponent as CrawlFourGray } from '@/assets/svg/manager/crawl_four_gray.svg';
import { ReactComponent as CrawlOneColor } from '@/assets/svg/manager/crawl_one_color.svg';
import { ReactComponent as CrawlOneGray } from '@/assets/svg/manager/crawl_one_gray.svg';
import { ReactComponent as CrawlSixColor } from '@/assets/svg/manager/crawl_six_color.svg';
import { ReactComponent as CrawlSixGray } from '@/assets/svg/manager/crawl_six_gray.svg';
import { ReactComponent as CrawlThreeColor } from '@/assets/svg/manager/crawl_three_color.svg';
import { ReactComponent as CrawlThreeGray } from '@/assets/svg/manager/crawl_three_gray.svg';
import { ReactComponent as CrawlTwoColor } from '@/assets/svg/manager/crawl_two_color.svg';
import { ReactComponent as CrawlTwoGray } from '@/assets/svg/manager/crawl_two_gray.svg';
import { ReactComponent as ManagerDelete } from '@/assets/svg/manager/manager_delete.svg';
import { ReactComponent as ManagerEdit } from '@/assets/svg/manager/manager_edit.svg';
import { ReactComponent as ManagerMore } from '@/assets/svg/manager/manager_more.svg';
import { ReactComponent as ManagerPublish } from '@/assets/svg/manager/manager_publish.svg';
import { ReactComponent as ManagerView } from '@/assets/svg/manager/manager_view.svg';
import { ReactComponent as StatusFinishIcon } from '@/assets/svg/manager/product_status_finish.svg';
import { ReactComponent as StatusNotIcon } from '@/assets/svg/manager/product_status_not.svg';
import { ReactComponent as StatusUpdateIcon } from '@/assets/svg/manager/product_status_update.svg';
import { ReactComponent as Search } from '@/assets/svg/search.svg';
import { ReactComponent as Warning } from '@/assets/svg/warning.svg';
import {
  addProject,
  deleteProject,
  listProjects,
  publishProject,
  viewProjects,
} from '@/services/project';
import { LoadingOutlined } from '@ant-design/icons';

const { Column } = Table;
const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
interface DataType {
  key: string;
  name: string;
  status: number;
  fields_completion: FieldsParams[];
  fetched_crawlers: any;
  create_time: string;
  update_time: string;
}

interface FieldsParams {
  field: string;
  completion: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const CrawlList = [
  [
    <CrawlOneColor className="cursor-pointer" style={{ marginTop: 3 }} />,
    <CrawlOneGray className="cursor-pointer" style={{ marginTop: 3 }} />,
  ],
  [
    <CrawlTwoColor className="cursor-pointer" style={{ marginTop: 3 }} />,
    <CrawlTwoGray className="cursor-pointer" style={{ marginTop: 3 }} />,
  ],
  [
    <CrawlThreeColor className="cursor-pointer" style={{ marginTop: 3 }} />,
    <CrawlThreeGray className="cursor-pointer" style={{ marginTop: 3 }} />,
  ],
  [
    <CrawlFourColor className="cursor-pointer" style={{ marginTop: 3 }} />,
    <CrawlFourGray className="cursor-pointer" style={{ marginTop: 3 }} />,
  ],
  [
    <CrawlFiveColor className="cursor-pointer" style={{ marginTop: 3 }} />,
    <CrawlFiveGray className="cursor-pointer" style={{ marginTop: 3 }} />,
  ],
  [
    <CrawlSixColor className="cursor-pointer" style={{ marginTop: 3 }} />,
    <CrawlSixGray className="cursor-pointer" style={{ marginTop: 3 }} />,
  ],
];

const CrawlNameList = [
  'CoinMarketCap',
  'CoinCarp',
  'Messari',
  'TokenTerminal',
  'TokenUnlocks',
  'RootData',
];

const FieldsNameList = [
  ['Basic Information', 1],
  ['Team', 3],
  ['Funding', 4],
  ['Tokenomics', 5],
  ['Revenue', 6],
  ['Related Links ', 2],
];

const IndexPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const { formatMessage } = useIntl();
  const [projectList, setProjectList] = useState<DataType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [getList, setGetList] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [queryKey, setQueryKey] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [filterType, setFilterType] = useState(0);

  const openPublishNotification = () => {
    api.open({
      message: (
        <div className="flex bg-green-50">
          <div className="w-1.5 h-14 bg-green-400" />
          <div className="text-base font-bold text-green-700 ml-6 mt-4">
            Successfully Published
          </div>
        </div>
      ),
      className: 'p-0 border-0 w-52',
      closeIcon: false,
    });
  };

  const publishInfo = async (id: string) => {
    const publishResult = await publishProject(id);
    console.log(publishResult);
    if (publishResult.code === 0) {
      openPublishNotification();
    }
  };

  const handleSearch = async (newValue: string) => {
    const queryParmas = {
      page: 1,
      size: 10,
      query: newValue,
      conditions: {
        chains: [],
        tracks: [],
        investors: [],
        market_cap_range: null,
        founded_date_range: null,
      },
      sort_field: 'marketcap',
      is_asc: false,
    };
    const searchResult = await viewProjects(queryParmas);
    if (searchResult.code === 0) {
      setSearchData(
        searchResult.data.list.map((data: any) => ({
          value: data.id,
          label: data.name,
          logo: data.logo_url,
        })),
      );
    }
  };

  const listAllProjects = async (query?: string, status?: number) => {
    setTableLoading(true);
    const queryParmas = {
      page: tableParams.pagination?.current as number,
      size: tableParams.pagination?.pageSize as number,
      query: query,
      status: status,
      sort_field: 'create_time',
      is_asc: true,
    };
    const listResult = await listProjects(queryParmas);
    if (listResult.code === 0) {
      const currentList = listResult.data.list?.map((item: any) => {
        const created = new Date(item.create_time * 1000).toDateString();
        const updatedValue = new Date(item.update_time * 1000);
        const updated =
          updatedValue.getFullYear() +
          '-' +
          (updatedValue.getMonth() < 10 ? '0' : '') +
          updatedValue.getMonth() +
          '-' +
          (updatedValue.getDate() < 10 ? '0' : '') +
          updatedValue.getDate();
        return {
          name: item.name,
          status: item.status,
          create_time: created,
          update_time: updated,
          completion_status: item.completion_status,
          fields_completion: item.fields_completion,
          fetched_crawlers: item.fetched_crawlers ?? [],
          key: item.id,
        };
      });
      setProjectList(currentList);
      setGetList(true);
      console.log(listResult.data.total);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: listResult.data.total,
        },
      });
    } else {
      const listInterval = setInterval(async () => {
        const result = await listProjects(queryParmas);
        if (result.code === 0) {
          const currentList = result.data.list?.map((item: any) => {
            const created = new Date(item.create_time * 1000).toDateString();
            const updatedValue = new Date(item.update_time * 1000);
            const updated =
              updatedValue.getFullYear() +
              '-' +
              (updatedValue.getMonth() < 10 ? '0' : '') +
              updatedValue.getMonth() +
              '-' +
              (updatedValue.getDate() < 10 ? '0' : '') +
              updatedValue.getDate();
            return {
              name: item.name,
              status: item.status,
              create_time: created,
              update_time: updated,
              completion_status: item.completion_status,
              fields_completion: item.fields_completion,
              fetched_crawlers: item.fetched_crawlers ?? [],
              key: item.id,
            };
          });
          setProjectList(currentList);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: result.data.total,
            },
          });
          clearInterval(listInterval);
        }
      }, 2000);
      setGetList(true);
    }
    setTableLoading(false);
  };

  const handleTableChange = async (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<DataType>,
  ) => {
    setTableLoading(true);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    const queryParmas = {
      page: pagination.current as number,
      size: pagination.pageSize as number,
      query: '',
      status: 0,
      sort_field: (sorter.columnKey as string) || 'create_time',
      is_asc: sorter.order === 'descend' ? false : true,
    };
    const listResult = await listProjects(queryParmas);
    if (listResult.code === 0) {
      const currentList = listResult.data.list?.map((item: any) => {
        const created = new Date(item.create_time * 1000).toDateString();
        const updatedValue = new Date(item.update_time * 1000);
        const updated =
          updatedValue.getFullYear() +
          '-' +
          (updatedValue.getMonth() < 10 ? '0' : '') +
          updatedValue.getMonth() +
          '-' +
          (updatedValue.getDate() < 10 ? '0' : '') +
          updatedValue.getDate();
        return {
          name: item.name,
          status: item.status,
          create_time: created,
          update_time: updated,
          completion_status: item.completion_status,
          fields_completion: item.fields_completion,
          fetched_crawlers: item.fetched_crawlers ?? [],
          key: item.id,
        };
      });
      setProjectList(currentList);
      setGetList(true);
    } else {
      const listInterval = setInterval(async () => {
        const result = await listProjects(queryParmas);
        if (result.code === 0) {
          const currentList = result.data.list?.map((item: any) => {
            const created = new Date(item.create_time * 1000).toDateString();
            const updatedValue = new Date(item.update_time * 1000);
            const updated =
              updatedValue.getFullYear() +
              '-' +
              (updatedValue.getMonth() < 10 ? '0' : '') +
              updatedValue.getMonth() +
              '-' +
              (updatedValue.getDate() < 10 ? '0' : '') +
              updatedValue.getDate();
            return {
              name: item.name,
              status: item.status,
              create_time: created,
              update_time: updated,
              completion_status: item.completion_status,
              fields_completion: item.fields_completion,
              fetched_crawlers: item.fetched_crawlers ?? [],
              key: item.id,
            };
          });
          setProjectList(currentList);
          clearInterval(listInterval);
        }
      }, 2000);
      setGetList(true);
    }
    setTableLoading(false);
  };

  const setFilter = (value: number) => {
    setFilterType(value);
    listAllProjects(undefined, value);
  };

  useEffect(() => {
    if (!getList) {
      listAllProjects();
    }
  }, [getList]);

  const deleteP = async (id: string) => {
    const deleteResult = await deleteProject(id);
    if (deleteResult.code === 0) {
      listAllProjects();
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: formatMessage({ id: 'Name' }),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 142,
      render: (text: string, record) => (
        <a
          onClick={() => {
            history.push({
              pathname: 'edit_project',
              query: {
                id: record.key,
              },
            });
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: formatMessage({ id: 'STATUS' }),
      dataIndex: 'status',
      width: 142,
      render: (status: number, record: any) => {
        return (
          <>
            <div className="flex">
              {record.completion_status === 0 && (
                <Tooltip title="Incomplete">
                  <StatusNotIcon className="cursor-pointer" />
                </Tooltip>
              )}
              {record.completion_status === 2 && (
                <Tooltip title="Complete">
                  <StatusFinishIcon className="cursor-pointer" />
                </Tooltip>
              )}
              {record.completion_status === 1 && (
                <Tooltip title="Core Data Complete">
                  <StatusUpdateIcon className="cursor-pointer" />
                </Tooltip>
              )}
              {status === 0 && (
                <text className="px-2 bg-gray-100 rounded-lg text-sm font-normal ml-1 pt-0.5">
                  {formatMessage({ id: 'STATUS_UNPUBLISHED' })}
                </text>
              )}
              {status === 1 && (
                <text className="px-2 bg-green-100 rounded-lg text-sm font-normal text-green-700 ml-1 pt-0.5">
                  {formatMessage({ id: 'STATUS_PUBLISHED' })}
                </text>
              )}
              {status === 2 && (
                <text
                  className="px-2 -100 rounded-lg text-sm font-normal ml-1 pt-0.5"
                  style={{ backgroundColor: '#FFEDD5', color: '#C2410C' }}
                >
                  Updated
                </text>
              )}
            </div>
          </>
        );
      },
    },
    {
      title: 'Fields Completion',
      key: 'fields_completion',
      width: 140,
      render: (value, record) => (
        <Popover
          title={null}
          content={() => {
            return (
              <div className="px-1 w-72">
                <div className="flex mb-2">
                  <div className="text-xs text-gray-700 font-bold">Total</div>
                  <div className="ml-auto text-xs text-gray-700 font-bold">
                    {record.fields_completion
                      ? record.fields_completion[0].completion + '%'
                      : '0%'}
                  </div>
                </div>
                {FieldsNameList.map((name) => {
                  return (
                    <div className="flex mt-1">
                      <div className="text-xs text-gray-500">{name[0]}</div>
                      <div className="ml-auto text-xs text-gray-500">
                        {record.fields_completion
                          ? record.fields_completion[name[1] as number]
                              .completion + '%'
                          : '0%'}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }}
        >
          <div className="flex cursor-pointer">
            <div
              className="text-sm text-gray-700 font-medium mr-3"
              style={{ width: 28 }}
            >
              {record.fields_completion
                ? record.fields_completion[0].completion + '%'
                : '0%'}
            </div>
            {FieldsNameList.map((name) => {
              return (
                <div className="h-5 w-2 rounded-sm bg-purple-100 flex flex-col mr-0.5">
                  <div
                    className="mt-auto w-2 rounded-sm bg-purple-500"
                    style={{
                      height:
                        (20 *
                          (record.fields_completion
                            ? record.fields_completion[name[1] as number]
                                .completion
                            : 0)) /
                        100,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </Popover>
      ),
    },
    {
      title: 'Crawl',
      key: 'crawl',
      width: 142,
      render: (_, record) => (
        <div className="flex">
          <div className="text-sm text-gray-500 font-medium mr-1.5">
            {Object.values(record.fetched_crawlers).reduce(
              (accumulator: any, currentValue: any) => {
                return accumulator + (currentValue.is_crawled ? 1 : 0);
              },
              0,
            ) + '/6'}
          </div>
          {CrawlList.map((crawl, index) => {
            return (
              <Popover
                title={null}
                className="mr-1"
                content={() => (
                  <div className="flex w-60">
                    {record.fetched_crawlers?.[CrawlNameList[index]]?.is_crawled
                      ? crawl[0]
                      : crawl[1]}
                    <div
                      className="ml-1 text-gray-500 text-xs"
                      style={{ marginTop: 3 }}
                    >
                      {CrawlNameList[index]}
                    </div>
                    <div
                      className={`w-1 h-1 rounded-full ml-auto ${
                        record.fetched_crawlers[CrawlNameList[index]]
                          ?.is_crawled
                          ? 'bg-gray-700'
                          : 'bg-gray-500'
                      } mt-2.5`}
                    />
                    <div
                      className={`${
                        record.fetched_crawlers[CrawlNameList[index]]
                          ?.is_crawled
                          ? 'text-gray-700'
                          : 'text-gray-500'
                      } text-xs ml-1`}
                      style={{ marginTop: 3 }}
                    >
                      {record.fetched_crawlers[CrawlNameList[index]]?.is_crawled
                        ? 'Finish'
                        : 'Not Finish'}
                    </div>
                  </div>
                )}
              >
                {record.fetched_crawlers[CrawlNameList[index]]?.is_crawled
                  ? crawl[0]
                  : crawl[1]}
              </Popover>
            );
          })}
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'UPDATE_TIME' }),
      dataIndex: 'update_time',
      key: 'update_time',
      sorter: true,
      width: 142,
    },
    {
      title: 'Action',
      key: 'action',
      width: 142,
      render: (_, record: any) => (
        <div className="flex">
          <a
            onClick={() => {
              history.push({
                pathname: 'edit_project',
                query: {
                  id: record.key,
                },
              });
            }}
            className="px-2 text-purple-500 font-medium text-sm"
          >
            <Tooltip title="edit">
              <ManagerEdit className="cursor-pointer" />
            </Tooltip>
          </a>
          <div className="w-px h-3 bg-gray-200 m-1" />
          <a
            onClick={() => {
              history.push({
                pathname: '/preview',
                query: {
                  id: record.key,
                },
              });
            }}
            className="px-2 text-purple-500 font-medium text-sm"
          >
            <Tooltip title="view">
              <ManagerView className="cursor-pointer" />
            </Tooltip>
          </a>
          <div className="w-px h-3 bg-gray-200 m-1" />
          <Dropdown
            overlayStyle={{ width: 120 }}
            menu={{
              items: [
                {
                  key: '1',
                  disabled: record.completion_status === 0,
                  label: (
                    <div
                      className={`flex py-1.5 ${
                        record.completion_status === 0
                          ? 'cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <ManagerPublish className="mt-px" />
                      <div
                        onClick={() => {
                          if (record.completion_status === 0) {
                            return;
                          }
                          publishInfo(record.key);
                        }}
                        className="text-grey-700 font-medium text-sm ml-2.5"
                      >
                        Publish
                      </div>
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <div
                      onClick={() => {
                        setDeleteId(record.key);
                        setIsDeleteModalOpen(true);
                      }}
                      className="flex py-1.5"
                    >
                      <ManagerDelete className="" />
                      <div className="text-red-500 font-medium text-sm ml-2.5">
                        Delete
                      </div>
                    </div>
                  ),
                },
              ],
            }}
          >
            <a className="px-2 text-purple-500 font-medium text-sm">
              <ManagerMore className="cursor-pointer" />
            </a>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6 overflow-y-auto flex-grow">
        <div className="font-bold text-2xl">
          {formatMessage({ id: 'ALL_PRODUCTS' })}
        </div>
        <div className="mt-4 flex">
          {/* <Select
            value={searchValue === '' ? 'Search' : searchValue}
            placeholder="Search"
            className="w-60 ml-1 "
            showSearch
            suffixIcon={
              <Search
                className="hover:cursor-pointer mt-px"
                width={20}
                height={20}
              />
            }
            filterOption={false}
            onSelect={(value: string) => {
              listAllProjects(searchData.filter(data => data.id === value)[0].name);
              setSearchValue('');
            }}
            size="large"
            onSearch={handleSearch}
            notFoundContent={null}
            onChange={(newValue: string) => {
              setSearchValue(newValue);
            }}
          >
            {searchData.map((data: any) => {
              return (
                <Option key={data.value} value={data.value} label={data.label}>
                  <div className="flex">
                    <Image
                      preview={false}
                      src={data.logo}
                      className="rounded-full"
                      width={16}
                    />
                    <div className="ml-2" style={{ marginTop: -4 }}>
                      {data.label}
                    </div>
                  </div>
                </Option>
              );
            })}
          </Select> */}
          <Input
            allowClear
            placeholder="Search"
            value={queryKey}
            suffix={
              <Search
                onClick={() => {
                  listAllProjects(queryKey);
                }}
                className="hover:cursor-pointer mt-px"
                width={20}
                height={20}
              />
            }
            onChange={(e) => {
              if (e.target.value === '') {
                listAllProjects(e.target.value);
              }
              setQueryKey(e.target.value);
            }}
            onPressEnter={(e: any) => {
              if (e.nativeEvent.isComposing) {
                return;
              }
              listAllProjects(e.target.value);
            }}
            className="w-60"
          />
          <div className="ml-2 flex rounded-lg border border-gray-300 bg-gray-100 hover:cursor-pointer">
            <div
              onClick={() => setFilter(0)}
              className={`py-2 px-4 rounded-l-lg border-r border-gray-300 text-sm ${
                filterType === 0 ? 'bg-white' : ''
              }`}
            >
              All
            </div>
            <div
              onClick={() => setFilter(2)}
              className={`py-2 px-4 border-r border-gray-300 text-sm ${
                filterType === 2 ? 'bg-white' : ''
              }`}
            >
              Published
            </div>
            <div
              onClick={() => setFilter(1)}
              className={`py-2 px-4 border-r border-gray-300 text-sm ${
                filterType === 1 ? 'bg-white' : ''
              }`}
            >
              Unpublished
            </div>
            <div
              onClick={() => setFilter(3)}
              className={`py-2 px-4 border-r border-gray-300 text-sm ${
                filterType === 3 ? 'bg-white' : ''
              }`}
            >
              Completed
            </div>
            <div
              onClick={() => setFilter(4)}
              className={`py-2 px-4 border-r border-gray-300 text-sm ${
                filterType === 4 ? 'bg-white' : ''
              }`}
            >
              Incompleted
            </div>
            <div
              onClick={() => setFilter(5)}
              className={`py-2 px-4 rounded-r-lg text-sm ${
                filterType === 5 ? 'bg-white' : ''
              }`}
            >
              Core Completed
            </div>
          </div>
          <button
            onClick={async () => {
              const addResult = await addProject();
              if (addResult.code === 0) {
                history.push({
                  pathname: './edit_project',
                  query: {
                    id: addResult.data.id,
                  },
                });
              }
            }}
            className="ml-auto bg-purple-500 px-4 py-1.5 rounded-lg text-white text-base font-medium hover:bg-purple-300 active:bg-purple-700"
          >
            {formatMessage({ id: 'ADD_PROJECT' })}
          </button>
        </div>
        <Table
          className="mt-4"
          dataSource={projectList}
          loading={
            tableLoading
              ? { indicator: <TableLoading style={{ fontSize: 120 }} /> }
              : false
          }
          columns={columns}
          onChange={handleTableChange}
          pagination={tableParams.pagination}
          scroll={{ x: 420 }}
        />
      </div>
      <Modal
        open={isDeleteModalOpen}
        closable={false}
        okText="Delete"
        onOk={() => {
          deleteP(deleteId);
          setIsDeleteModalOpen(false);
          setDeleteId('');
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteId('');
        }}
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ danger: true }}
      >
        <div className="flex">
          <Warning />
          <div className="ml-4">
            <div className="text-gray-900 font-medium text-lg">
              Confirm delete project
            </div>
            <div className="mt-2 text-gray-500 font-normal text-sm">
              this action could not be reverted
            </div>
          </div>
        </div>
      </Modal>
      {contextHolder}
    </>
  );
};

export default IndexPage;
