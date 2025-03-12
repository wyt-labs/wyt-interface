import { socialsParams } from '@/services/project';

const MoreInfo = (props: { info: socialsParams | undefined }) => {
  const { info } = props;
  return (
    <>
      <div className="mt-4 px-4">
        <div className="mt-4 text-xl font-bold text-gray-700">Socials</div>
        <div className="flex mt-4 flex-wrap justify-begin">
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">Github Commits</div>
                <div className="font-bold text-2xl mt-2">
                  {info?.github_commits || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">Github Stars</div>
                <div className="font-bold text-2xl mt-2">
                  {info?.github_stars || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">GitHub Forks</div>
                <div className="font-bold text-2xl mt-2">
                  {info?.github_forks || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">
                  GitHub Contributors
                </div>
                <div className="font-bold text-2xl mt-2">
                  {info?.github_contributors || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">Github Followers</div>
                <div className="font-bold text-2xl mt-2">
                  {info?.github_followers || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">Twitter Followers</div>
                <div className="font-bold text-2xl mt-2">
                  {info?.twitter_followers || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="mr-4 border rounded-2xl border-solid border-gray-300 px-8 py-6 mb-4">
            <div className="flex">
              <div>
                <div className="text-gray-700 font-bold">Reddit Members</div>
                <div className="font-bold text-2xl mt-2">
                  {info?.reddit_followers || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreInfo;
