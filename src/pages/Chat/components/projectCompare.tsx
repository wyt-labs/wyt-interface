import OverviewCmp from './overviewCmp';
import { Image, Tooltip } from 'antd';
import TokenomicsCmp from './tokenomicsCmp';
import ProfitabilityCmp from './profitabilityCmp';
import TeamCmp from './teamCmp';
import FundingCmp from './fundingCmp';
import ExchangesCmp from './exchangesCmp';

interface projectCompareProps {
  projects: projectProps[];
  view: string;
}

interface projectProps {
  exchanges: any;
  funding: any;
  id: string;
  overview: any;
  profitability: any;
  team: any;
  tokenomics: any;
}

const ProjectCompare = (props: { info: projectCompareProps }) => {
  const { info } = props;

  return (
    <>
      <div className="flex mt-2.5">
        {(info.projects || []).map((project, index) => {
          return (
            <>
              <div
                key={project.id}
                style={{ width: '50%', marginLeft: index === 1 ? 10 : 0 }}
                className={index === 1 ? 'ml-auto' : ''}
              >
                <div className="bg-gray-50 rounded-xl p-5 flex w-full">
                  <Image
                    className="rounded-full"
                    preview={false}
                    src={project.overview?.logo_url}
                    width={48}
                    height={48}
                  />
                  <div className="ml-2 flex-grow">
                    <Tooltip title={project.overview?.name}>
                      <div className="text-sm w-24 font-semibold mt-0.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {project.overview?.name}
                      </div>
                    </Tooltip>
                    <div className="text-sm font-normal text-gray-400 mt-1">
                      {project.overview?.token_symbol}
                    </div>
                  </div>
                  {(info.view === 'overview' || info.view === 'all') && (
                    <Tooltip
                      title={
                        project.overview?.token_price === 0
                          ? '-'
                          : project.overview?.token_price
                      }
                    >
                      <div className="w-18 overflow-hidden whitespace-nowrap overflow-ellipsis ml-auto text-right text-base font-bold text-gray-700 mt-2">{`$ ${
                        project.overview?.token_price === 0
                          ? '-'
                          : project.overview?.token_price
                      }`}</div>
                    </Tooltip>
                  )}
                </div>
                {(info.view === 'overview' || info.view === 'all') && (
                  <OverviewCmp info={project.overview} />
                )}
                {info.view === 'all' && (
                  <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full text-center text-gray-700 text-sm">
                    TOKENOMICS
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>
      <div className="flex">
        {(info.projects || []).map((project, index) => {
          return (
            <>
              <div
                key={project.id}
                style={{ width: '50%', marginLeft: index === 1 ? 10 : 0 }}
                className={`${index === 1 ? 'ml-auto' : ''} flex flex-col`}
              >
                {(info.view === 'tokenomics' || info.view === 'all') && (
                  <TokenomicsCmp info={project.tokenomics} />
                )}
              </div>
            </>
          );
        })}
      </div>
      <div className="flex">
        {(info.projects || []).map((project, index) => {
          return (
            <>
              <div
                key={project.id}
                style={{ width: '50%', marginLeft: index === 1 ? 10 : 0 }}
                className={index === 1 ? 'ml-auto' : ''}
              >
                {info.view === 'all' && (
                  <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full text-center text-gray-700 text-sm">
                    PROFITABILITY
                  </div>
                )}
                {(info.view === 'profitability' || info.view === 'all') && (
                  <ProfitabilityCmp info={project.profitability} />
                )}
                {info.view === 'all' && (
                  <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full text-center text-gray-700 text-sm">
                    TEAM
                  </div>
                )}
                {(info.view === 'team' || info.view === 'all') && (
                  <TeamCmp
                    info={project.team}
                    count={
                      (info.projects || []).length === 0
                        ? 0
                        : (info.projects[0].team.members || []).length >
                          (info.projects[1].team.members || []).length
                        ? (info.projects[0].team.members || []).length > 3
                          ? 3
                          : (info.projects[0].team.members || []).length
                        : (info.projects[1].team.members || []).length > 3
                        ? 3
                        : (info.projects[0].team.members || []).length
                    }
                  />
                )}
                {info.view === 'all' && (
                  <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full text-center text-gray-700 text-sm">
                    FUNDING
                  </div>
                )}
                {(info.view === 'funding' || info.view === 'all') && (
                  <FundingCmp info={project.funding} />
                )}
                {info.view === 'all' && (
                  <div className="bg-gray-50 rounded-xl p-5 mt-1 w-full text-center text-gray-700 text-sm">
                    EXCHANGES
                  </div>
                )}
                {(info.view === 'exchanges' || info.view === 'all') && (
                  <ExchangesCmp info={project.exchanges} />
                )}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ProjectCompare;
