import { Image } from 'antd';
import DODO from '@/assets/DODO.png';
import { ecosystemParams } from '@/services/project';
import { ReactComponent as EcoEmpty } from '@/assets/svg/detail/eco_empty.svg';

const Ecosystem = (props: { info: ecosystemParams | undefined }) => {
  const { info } = props;

  return (
    <>
      <div className="mt-4 px-4">
        <div className="mt-4 flex">
          <div className="text-xl font-bold text-gray-700">Top Projects</div>
          <div className="ml-3 mt-1 text-gray-500">In the total number of</div>
          <div className="text-gray-700 mt-1 ml-1">{info?.total_amount}</div>
        </div>
        <div className="mt-4 flex">
          {(info?.top_projects || []).map((project: any) => {
            return (
              <div
                key={project.id}
                className="rounded-2xl border border-solid border-gray-300 p-6"
              >
                <div className="flex">
                  <Image src={project.logo_url} width={24} preview={false} />
                  <div className="text-gray-700 font-bold ml-2">
                    {project.name}
                  </div>
                </div>
                <div className="text-gray-500 mt-1">{project.description}</div>
              </div>
            );
          })}
          {(info?.top_projects || []).length === 0 && (
            <>
              <div className="rounded-2xl border border-gray-300 py-24 w-full">
                <EcoEmpty className="m-auto" />
                <div className="mt-2 text-xs text-gray-300 text-center">
                  no info
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 text-xl font-bold text-gray-700">
          Ecological Growth Curve
        </div>
        {info?.growth_curve_picture_url !== '' && (
          <Image className="mt-8" src={DODO} />
        )}
        {info?.growth_curve_picture_url === '' && (
          <>
            <div className="rounded-2xl border border-gray-300 py-24 w-full mt-8">
              <EcoEmpty className="m-auto" />
              <div className="mt-2 text-xs text-gray-300 text-center">
                no info
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Ecosystem;
