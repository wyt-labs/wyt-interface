import Exchanges from './exchanges';
import Fundings from './fundings';
import Overview from './overview';
import Profitability from './profitability';
import Team from './team';
import Tokenomics from './tokenomics';

interface ProjectInfoProps {
  projectInfo: infoProps;
}

interface infoProps {
  project: any;
  view: string;
}

const ProjectInfo = (props: ProjectInfoProps) => {
  const { projectInfo } = props;

  return (
    <>
      {(projectInfo.view === 'overview' || projectInfo.view === 'all') && (
        <Overview info={projectInfo.project.overview} />
      )}
      {/*{projectInfo.view === 'all' && <div className="text-sm text-gray-500 mt-2">Tokenomics</div>}*/}
      {/*{(projectInfo.view === 'tokenomics' || projectInfo.view === 'all') && (*/}
      {/*  <Tokenomics info={projectInfo.project.tokenomics} />*/}
      {/*)}*/}
      {/*{projectInfo.view === 'all' && <div className="text-sm text-gray-500 mt-2">Profitability</div>}*/}
      {/*{(projectInfo.view === 'profitability' || projectInfo.view === 'all') && (*/}
      {/*  <Profitability info={projectInfo.project.profitability} />*/}
      {/*)}*/}
      {projectInfo.view === 'all' && (
        <div className="text-sm text-gray-500 mt-2">Team</div>
      )}
      {(projectInfo.view === 'team' || projectInfo.view === 'all') && (
        <Team info={projectInfo.project.team} />
      )}
      {projectInfo.view === 'all' && (
        <div className="text-sm text-gray-500 mt-2">Funding</div>
      )}
      {(projectInfo.view === 'funding' || projectInfo.view === 'all') && (
        <Fundings info={projectInfo.project.funding} />
      )}
      {projectInfo.view === 'all' && (
        <div className="text-sm text-gray-500 mt-2">Exchanges</div>
      )}
      {(projectInfo.view === 'exchanges' || projectInfo.view === 'all') && (
        <Exchanges info={projectInfo.project.exchanges} />
      )}
    </>
  );
};

export default ProjectInfo;
