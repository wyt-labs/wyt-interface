import '@/global.less';

import { BaseSyntheticEvent, useEffect, useState } from 'react';

/* eslint-disable react/no-array-index-key */
import {
  Affix,
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Progress,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import AntdImgCrop from 'antd-img-crop';
import type { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import type { PickerMode } from 'rc-picker/lib/interface';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { history, IRouteComponentProps, useIntl } from 'umi';

import DefaultAvatar from '@/assets/avatar.png';
import { ReactComponent as Delete } from '@/assets/svg/delete.svg';
import { ReactComponent as Edit } from '@/assets/svg/edit.svg';
import { ReactComponent as Warning } from '@/assets/svg/warning.svg';
import { ReactComponent as Xicon } from '@/assets/svg/xicon.svg';
import UploadPng from '@/assets/upload.png';
import {
  addBriefProject,
  businessModelParams,
  distributionItem,
  fundingDetailsParams,
  getBriefProject,
  getProjectInfo,
  listProjects,
  publishProject,
  relatedLinksParams,
  restoreProjectParams,
  topProjectItem,
  updateBriefProject,
  updateProject,
  updateProjectParams,
  uploadFile,
} from '@/services/project';
import {
  addImpressions,
  addNewInvestor,
  addNewTag,
  listChains,
  listImpressions,
  listInvestors,
  listTags,
  listTracks,
  updateInvestor,
} from '@/services/related';
import {
  chainsOption,
  impressionsOption,
  investorDetail,
  investorOption,
  tagsOption,
  tracksOption,
} from '@/utils/interface';
import { showBriefAmount } from '@/utils/tools';

interface trackRenderItem {
  value: string;
  label: string;
  isSelected: boolean;
}

interface tagRenderItem {
  value: string;
  label: string;
  id: string;
}

interface impressionRenderItem {
  value: string;
  label: string;
}

interface investorRenderItem {
  value: string;
  label: string;
}

interface teamMemberItem {
  avatar: string | undefined;
  name: string | undefined;
  title: string | undefined;
  isDeparted: number;
  desc: string | undefined;
  isTwitter: boolean;
  isLinkedIn: boolean;
  twitterLink: string | undefined;
  linkedinLink: string | undefined;
}

const { confirm } = Modal;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const linkOptions = [
  { value: 'Official Website' },
  { value: 'GitHub' },
  { value: 'Twitter' },
  { value: 'Instagram' },
  { value: 'Discord' },
  { value: 'Fecebook' },
  { value: 'White Paper' },
  { value: 'Blog' },
  { value: 'Other Resources' },
];

const colorGroups = [
  'bg-gray-300',
  'bg-red-300',
  'bg-yellow-300',
  'bg-green-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300',
  'bg-pink-300',
];

const { TextArea } = Input;

const unSelectTrackClass =
  'rounded-lg px-7 py-2 mr-2 mt-2 border-gray-500 border hover:cursor-pointer hover:bg-gray-50 hover:text-gray-300 hover:border-gray-300';
const selectTrackClass =
  'rounded-lg px-7 py-2 mr-2 mt-2 bg-purple-700 text-white hover:cursor-pointer';

const linkRemoveClass =
  'text-gray-700 text-sm font-medium border rounded-lg px-4 py-2.5 mt-1.5 cursor-pointer bg-white hover:bg-gray-50 hover:text-gray-300 active:text-gray-700';
const linkRemoveDisabledClass =
  'text-grey-300 text-sm font-medium border rounded-lg px-4 py-2.5 mt-7 bg-gray-50  cursor-not-allowed';

const anchorNotReached =
  'text-xs hover:text-purple-700 font-bold flex-auto hover:cursor-pointer';
const anchorReached =
  'text-xs text-purple-700 font-bold flex-auto hover:cursor-pointer';
const anchorReachedLast =
  'text-xs text-purple-700 font-bold flex-none hover:cursor-pointer';
const anchorNotReachedLast =
  'text-xs hover:text-purple-700 font-bold flex-nonde hover:cursor-pointer';

const EditProject = (props: IRouteComponentProps) => {
  const [api, contextHolder] = notification.useNotification();
  const { formatMessage } = useIntl();
  const { location } = props;
  const [form] = Form.useForm();
  const [constants, setConstants] = useState({
    DEFAULT_PROJECT_LOGO_URL: '',
    DEFAULT_AVATAR_URL: '',
  });
  const [percent, setPercent] = useState(0);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isKolHold, setIsKolHold] = useState(false);
  const [isKolSupport, setIsKolSupport] = useState(false);
  const [foundDateMode, setFoundDateMode] = useState<PickerMode>('date');
  const [foundDateError, setFoundDateError] = useState(false);
  const [launchDateMode, setLaunchDateMode] = useState<PickerMode>('date');
  const [launchDateError, setLaunchDateError] = useState(false);
  const [isRestor, setIsRestor] = useState(false);
  const [tagValue, setTagValue] = useState<string[]>([]);
  const [tagValueError, setTagValueError] = useState(false);
  const [anchorIndex, setAnchorIndex] = useState(0);

  // basic info params
  const [basicName, setBasicName] = useState('');
  const [basicNameError, setBasicNameError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [chains, setChains] = useState<string[]>([]);
  const [kolHoldDetail, setKolHoldDetail] = useState('');
  const [kolHoldLink, setKolHoldLink] = useState('');
  const [kolSupportDetail, setKolSupportDetail] = useState('');
  const [kolSupportLink, setKolSupportLink] = useState('');
  const [foundDate, setFoundDate] = useState('');
  const [foundPanel, setFoundPanel] = useState<any>(undefined);
  const [launchDate, setLaunchDate] = useState('');
  const [launchPanel, setLaunchPanel] = useState<any>(undefined);
  const [isOpenSource, setIsOpenSource] = useState(1);
  const [basicReference, setBasicReference] = useState('');

  // related link params
  const [officialLink, setOfficialLink] = useState('');
  const [linkGroups, setLinkGroups] = useState<relatedLinksParams[]>([]);

  // team params
  const [impressions, setImpressions] = useState<string[]>([]);
  const [teamReference, setTeamReference] = useState('');
  const [teamDeleteIndex, setTeamDeleteIndex] = useState(-1);

  // upload params
  const [logoUrl, setLogoUrl] = useState('');
  const [teamUploadUrl, setTeamUploadUrl] = useState('');
  const [investorUploadUrl, setInvestorUploadUrl] = useState('');
  const [distributionUrl, setDistributionUrl] = useState('');
  const [tokenMetricsUrl, setTokenMetricsUrl] = useState('');
  const [whaleHoldUrl, setWhaleHoldUrl] = useState('');
  const [bigEventUrl, setBigEventUrl] = useState('');
  const [growthUrl, setGrowthUrl] = useState('');
  const [topProjectUrl, setTopProjectUrl] = useState('');
  const [statementUrl, setStatementUrl] = useState('');

  // investor params
  const [investors, setInvestors] = useState<investorDetail[]>([]);
  const [investorFileList, setInvestorFileList] = useState<UploadFile[]>([]);
  const [investorName, setInvestorName] = useState('');
  const [investorNameError, setInvestorNameError] = useState(false);
  const [investorSubject, setInvestorSubject] = useState(2);
  const [investorType, setInvestorType] = useState<number | undefined>();
  const [isInvestorModify, setIsInvestorModify] = useState(false);
  const [investorModifyIndex, setInvestorModifyIndex] = useState(-1);
  const [allInvestors, setAllInvestors] = useState<investorOption[]>([]);
  const [investorDeleteIndex, setInvestorDeleteIndex] = useState(-1);

  // round params
  const [rounds, setRounds] = useState<fundingDetailsParams[]>([]);
  const [round, setRound] = useState<string | null>(null);
  const [otherRound, setOtherRound] = useState('');
  const [roundDateValue, setRoundDateValue] = useState<any>(undefined);
  const [roundDate, setRoundDate] = useState('');
  const [roundDateMode, setRoundDateMode] = useState<PickerMode>('date');
  const [roundAmount, setRoundAmount] = useState<number | null>(null);
  const [roundValuation, setRoundValuation] = useState<number | null>(null);
  const [roundInvestors, setRoundInevstors] = useState('');
  const [leadInvestors, setLeadInvestors] = useState('');
  const [fundingReference, setFundingReference] = useState('');
  const [isRoundModify, setIsRoundModify] = useState(false);
  const [roundModifyIndex, setRoundModifyIndex] = useState(-1);
  const [roundDeleteIndex, setRoundDeleteIndex] = useState(-1);

  // tokenomics params
  const [tokenIssuance, setTokenIssuance] = useState(1);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDate, setTokenDate] = useState('');
  const [tokenDateMode, setTokenDateMode] = useState<PickerMode>('date');
  const [tokenPanel, setTokenPanel] = useState<any>(undefined);
  const [tokenDistributionMode, setTokenDistributionMode] = useState(1);
  const [distributions, setDistributions] = useState<distributionItem[]>([]);
  const [tokenLink, setTokenLink] = useState('');
  const [tokenDesc, setTokenDesc] = useState('');
  const [tokenMetricsLink, setTokenMetricsLink] = useState('');
  const [tokenHoldersLink, setTokenHoldersLink] = useState('');
  const [tokenBigEvents, setTokenBigEvents] = useState('');
  const [tokenReference, setTokenReference] = useState('');
  const [distributionFileList, setDistributionFileList] = useState<
    UploadFile[]
  >([]);

  // eco params
  const [ecoAmount, setEcoAmount] = useState('');
  const [ecoLink, setEcoLink] = useState('');
  const [ecoProjects, setEcoProjects] = useState<topProjectItem[]>([]);
  const [ecoWebsite, setEcoWebsite] = useState('');
  const [ecoWebsiteError, setEcoWebsiteError] = useState(false);
  const [ecoProjectName, setEcoProjectName] = useState('');
  const [ecoProjectNameError, setEcoProjectNameError] = useState(false);
  const [ecoProjectDesc, setEcoProjectDesc] = useState('');
  const [ecoProjectDescError, setEcoProjectDescError] = useState(false);
  const [ecoReference, setEcoReference] = useState('');
  const [isEcoProjectModify, setIsEcoProjectModify] = useState(false);
  const [ecoProjectModifyIndex, setEcoProjectModifyIndex] = useState(-1);
  const [topProjectOptions, setTopProjectOptions] = useState([]);

  // profitability params
  const [models, setModels] = useState<businessModelParams[]>([]);
  const [modelName, setModelName] = useState('');
  const [modelNameError, setModelNameError] = useState(false);
  const [modelAnnual, setModelAnnual] = useState('');
  const [modelAnnualError, setModelAnnualError] = useState(false);
  const [modelDesc, setModelDesc] = useState('');
  const [modelDescError, setModelDescError] = useState(false);
  const [statementLink, setStatementLink] = useState('');
  const [profitReference, setProfitReference] = useState('');
  const [isModelModify, setIsModelModify] = useState(false);
  const [modelModifyIndex, setModelModifyIndex] = useState(-1);

  // team member args
  const [teamMembers, setTeamMembers] = useState<teamMemberItem[]>([]);
  const [teamFileList, setTeamFileList] = useState<UploadFile[]>([]);
  const [tempPreview, setTempPreview] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberTitle, setMemberTitle] = useState('');
  const [isDeparted, setIsDeparted] = useState(2);
  const [memberDescription, setMemberDescription] = useState('');
  const [isTwitter, setIsTwitter] = useState(false);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [twitterLink, setTwitterLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [isTeamModify, setIsTeamModify] = useState(false);
  const [teamModifyIndex, setTeamModifyIndex] = useState(-1);

  // modal params
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isAddTopProjectModalOpen, setIsAddTopProjectModalOpen] =
    useState(false);
  const [isAddModelsOpen, setIsAddModelsOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamDeleteModalOpen, setIsTeamDeleteModalOpen] = useState(false);
  const [isRoundDeleteModalOpen, setIsRoundDeleteModalOpen] = useState(false);

  // all options
  const [chainsOptions, setChainOptions] = useState([]);
  const [trackOptions, setTrackOptions] = useState<trackRenderItem[]>([]);
  const [tagOptions, setTagOptions] = useState<tagRenderItem[]>([]);
  const [impressionOptions, setImpressionOptions] = useState<
    impressionRenderItem[]
  >([]);
  const [investorOptions, setInvestorOptions] = useState<tagRenderItem[]>([]);

  // pic display
  const [statementDisplay, setStatementDisplay] = useState(true);
  const [bigEventDisplay, setBigEventDisplay] = useState(true);
  const [whaleHoldDisplay, setWhaleHoldDisplay] = useState(true);
  const [tokenMetricsDisplay, setTokenMetricsDisplay] = useState(true);

  const [selectTag, setSelectTag] = useState(undefined);
  const [tagInput, setTagInput] = useState(undefined);
  const [editStatus, setEditStatus] = useState(0);

  const openNotification = () => {
    api.open({
      message: (
        <div className="flex bg-green-50">
          <div className="w-1.5 h-14 bg-green-400" />
          <div className="text-base font-bold text-green-700 ml-6 mt-4">
            Successfully Saved
          </div>
        </div>
      ),
      className: 'p-0 border-0 w-52',
      closeIcon: false,
    });
  };

  const openFailNotification = () => {
    api.open({
      message: (
        <div className="flex bg-red-50">
          <div className="w-1.5 h-14 bg-red-400" />
          <div className="text-base font-bold text-red-700 ml-6 mt-4">
            Save Failed
          </div>
        </div>
      ),
      className: 'p-0 border-0 w-52',
      closeIcon: false,
    });
  };

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

  const onChangeLogo: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const changeOpenSource = (e: RadioChangeEvent) => {
    setIsOpenSource(e.target.value);
  };

  const onLogoCrop = async (file: void | boolean | string | Blob | File) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setLogoUrl(uploadResult.data.url);
    }
  };

  const onTeamAvatar = async (file: void | boolean | string | Blob | File) => {
    const uploadResult = await uploadFile(file as RcFile);
    console.log(uploadResult);
    if (uploadResult.code === 0) {
      setTeamUploadUrl(uploadResult.data.url);
    }
  };

  const onInvestorAvatar = async (
    file: void | boolean | string | Blob | File,
  ) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setInvestorUploadUrl(uploadResult.data.url);
    }
  };

  const onTokenMetrics = async (
    file: void | boolean | string | Blob | File,
  ) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setTokenMetricsUrl(uploadResult.data.url);
    }
  };

  const onWhaleHold = async (file: void | boolean | string | Blob | File) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setTokenMetricsUrl(uploadResult.data.url);
    }
  };

  const onBigEvent = async (file: void | boolean | string | Blob | File) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setBigEventDisplay(false);
      setBigEventUrl(uploadResult.data.url);
    }
  };

  const onTopProject = async (file: void | boolean | string | Blob | File) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setTopProjectUrl(uploadResult.data.url);
    }
  };

  const onFinancialStatement = async (
    file: void | boolean | string | Blob | File,
  ) => {
    const uploadResult = await uploadFile(file as RcFile);
    if (uploadResult.code === 0) {
      setStatementUrl(uploadResult.data.url);
    }
  };

  const onChangeDepart = (e: RadioChangeEvent) => {
    setIsDeparted(e.target.value);
  };

  const onChangeSubject = (e: RadioChangeEvent) => {
    setInvestorSubject(e.target.value);
  };

  const onChangeInvestor: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    // setInvestorFileList(newFileList);
  };

  const onChangeTeamMember: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    // setTeamFileList(newFileList);
  };

  const updateInfo = async () => {
    const data: updateProjectParams = {
      id: location.query.id as string,
      completion_status: editStatus,
      basic: {
        name: basicName,
        logo_url: logoUrl,
        description,
        chains,
        tracks: trackOptions
          .filter((track) => {
            return track.isSelected;
          })
          .map((track) => {
            return track.value;
          }),
        tags: tagValue,
        influences: [
          { type: 1, detail: kolHoldDetail, link: kolHoldLink },
          { type: 2, detail: kolSupportDetail, link: kolSupportLink },
        ],
        founded_date: foundDate,
        launch_date: launchDate,
        is_open_source: isOpenSource === 1,
        reference: basicReference,
      },
      related_links: [
        { type: 'Official Website', link: officialLink },
        ...linkGroups,
      ],
      team: {
        impressions: impressions,
        members: teamMembers.map((member: teamMemberItem) => {
          return {
            name: member.name ?? '',
            avatar_url: member.avatar ?? '',
            title: member.title ?? '',
            is_departed: member.isDeparted === 1,
            description: member.desc ?? '',
            social_media_links: [
              { type: 'Twitter', link: member.twitterLink ?? '' },
              { type: 'LinkedIn', link: member.linkedinLink ?? '' },
            ],
          };
        }),
        reference: teamReference,
      },
      funding: {
        top_investors: investors.map((investor) => investor.id),
        funding_details: rounds,
        reference: fundingReference,
      },
      tokenomics: {
        token_issuance: tokenIssuance === 1,
        token_name: '',
        token_symbol: tokenSymbol,
        token_issuance_date: tokenDate,
        initial_distribution_picture_url: distributionUrl,
        initial_distribution: distributions,
        initial_distribution_source_link: tokenLink,
        description: tokenDesc,
        metrics_link: tokenMetricsLink,
        metrics_link_logo_url: tokenMetricsUrl,
        holders_link: tokenHoldersLink,
        holders_link_logo_url: whaleHoldUrl,
        big_events_link: tokenBigEvents,
        big_events_link_logo_url: bigEventUrl,
        reference: tokenReference,
      },
      ecosystem: {
        total_amount: parseInt(ecoAmount),
        growth_curve_picture_url: growthUrl,
        growth_curve_source_link: ecoLink,
        top_projects: ecoProjects.map((project) => project.id),
        reference: ecoReference,
      },
      profitability: {
        business_models: models,
        financial_statement_link_logo_url: statementUrl,
        financial_statement_link: statementLink,
        reference: profitReference,
      },
    };
    console.log(data);
    const updateResult = await updateProject(data);
    if (updateResult.code === 0) {
      console.log('show notification');
      openNotification();
    } else {
      openFailNotification();
    }
  };

  const publishInfo = async () => {
    const publishResult = await publishProject(location.query.id as string);
    console.log(publishResult);
    if (publishResult.code === 0) {
      openPublishNotification();
    } else {
      openFailNotification();
    }
  };

  const restoreInfo = (data: restoreProjectParams) => {
    setBasicName(data.basic.name);
    setLogoUrl(data.basic.logo_url);
    setEditStatus(data.completion_status);
    setDescription(data.basic.description);
    setChains(
      data.basic.chains?.map((chain) => {
        return chain.id;
      }),
    );
    if (trackOptions && trackOptions.length !== 0) {
      for (let i = 0; i < data.basic.tracks?.length; i++) {
        for (let j = 0; j < trackOptions.length; j++) {
          if (trackOptions[j].value === data.basic.tracks[i].id) {
            trackOptions[j].isSelected = true;
          }
        }
      }
      setTrackOptions([...trackOptions]);
    }
    if (tagOptions && tagOptions.length !== 0) {
      const selectedTags = [];
      for (let i = 0; i < data.basic.tags?.length; i++) {
        for (let j = 0; j < tagOptions.length; j++) {
          if (tagOptions[j].value === data.basic.tags[i].id) {
            selectedTags.push(tagOptions[j].value);
          }
        }
      }
      setTagValue(selectedTags);
    }
    if (data.basic.influences && data.basic.influences.length > 0) {
      if (
        data.basic.influences[0].detail !== '' ||
        data.basic.influences[0].link !== ''
      ) {
        setIsKolHold(true);
        setKolHoldDetail(data.basic.influences[0].detail);
        setKolHoldLink(data.basic.influences[0].link);
      }
      if (
        data.basic.influences[1].detail !== '' ||
        data.basic.influences[1].link !== ''
      ) {
        setIsKolSupport(true);
        setKolSupportDetail(data.basic.influences[1].detail);
        setKolSupportLink(data.basic.influences[1].link);
      }
    }
    setFoundDate(data.basic.founded_date);
    const dateArrays = data.basic.founded_date.split('-');
    if (dateArrays.length === 1 && dateArrays[0] !== '') {
      setFoundDateMode('year');
      setFoundPanel(dayjs().set('year', parseInt(dateArrays[0])));
    } else if (dateArrays.length === 2) {
      setFoundDateMode('month');
      setFoundPanel(
        dayjs()
          .set('year', parseInt(dateArrays[0]))
          .set('month', parseInt(dateArrays[1]) - 1),
      );
    } else if (dateArrays.length === 3) {
      setFoundDateMode('date');
      setFoundPanel(
        dayjs()
          .set('year', parseInt(dateArrays[0]))
          .set('month', parseInt(dateArrays[1]) - 1)
          .set('date', parseInt(dateArrays[2])),
      );
    }
    setLaunchDate(data.basic.launch_date);
    const dateArrays1 = data.basic.launch_date.split('-');
    if (dateArrays1.length === 1 && dateArrays1[0] !== '') {
      setLaunchDateMode('year');
      setLaunchPanel(dayjs().set('year', parseInt(dateArrays1[0])));
    } else if (dateArrays1.length === 2) {
      setLaunchDateMode('month');
      setLaunchPanel(
        dayjs()
          .set('year', parseInt(dateArrays1[0]))
          .set('month', parseInt(dateArrays1[1]) - 1),
      );
    } else if (dateArrays1.length === 3) {
      setLaunchDateMode('date');
      setLaunchPanel(
        dayjs()
          .set('year', parseInt(dateArrays1[0]))
          .set('month', parseInt(dateArrays1[1]) - 1)
          .set('date', parseInt(dateArrays1[2])),
      );
    }
    setIsOpenSource(data.basic.is_open_source ? 1 : 2);
    setBasicReference(data.basic.reference);
    if (data.related_links?.length > 0) {
      setOfficialLink(data.related_links[0].link);
      setLinkGroups(data.related_links.slice(1));
    }
    if (data.team.impressions) {
      setImpressions(
        data.team.impressions.map((impression) => {
          return impression.id;
        }),
      );
    }
    if (data.team.members) {
      setTeamMembers(
        data.team.members?.map((member) => {
          return {
            name: member.name,
            avatar: member.avatar_url,
            title: member.title,
            isDeparted: member.is_departed ? 1 : 2,
            desc: member.description,
            twitterLink:
              member.social_media_links?.length > 0
                ? member.social_media_links[0].link
                : '',
            linkedinLink:
              member.social_media_links?.length > 1
                ? member.social_media_links[1].link
                : '',
            isTwitter: member.social_media_links?.length > 0,
            isLinkedIn: member.social_media_links?.length > 1,
          };
        }),
      );
    }
    setTeamReference(data.team.reference);
    setInvestors(
      data.funding.top_investors?.map((investor) => {
        return {
          name: investor.name,
          id: investor.id,
          description: investor.description,
          avatar_url: investor.avatar_url,
          subject: investor.subject,
          type: investor.subject,
          social_media_links: investor.social_media_links,
        };
      }),
    );
    setRounds(data.funding.funding_details ?? []);
    setFundingReference(data.funding.reference);
    setTokenIssuance(data.tokenomics.token_issuance ? 1 : 2);
    setTokenSymbol(data.tokenomics.token_symbol);
    setTokenDate(data.tokenomics.token_issuance_date);
    const dateArrays2 = data.tokenomics.token_issuance_date.split('-');
    if (dateArrays2.length === 1 && dateArrays2[0] !== '') {
      setTokenDateMode('year');
      setTokenPanel(dayjs().set('year', parseInt(dateArrays2[0])));
    } else if (dateArrays2.length === 2) {
      setTokenDateMode('month');
      setTokenPanel(
        dayjs()
          .set('year', parseInt(dateArrays2[0]))
          .set('month', parseInt(dateArrays2[1]) - 1),
      );
    } else if (dateArrays2.length === 3) {
      setTokenDateMode('date');
      setTokenPanel(
        dayjs()
          .set('year', parseInt(dateArrays2[0]))
          .set('month', parseInt(dateArrays2[1]) - 1)
          .set('date', parseInt(dateArrays2[2])),
      );
    }
    setDistributionUrl(data.tokenomics.initial_distribution_picture_url);
    setDistributions(data.tokenomics.initial_distribution);
    setTokenLink(data.tokenomics.initial_distribution_source_link);
    setTokenDesc(data.tokenomics.description);
    setTokenMetricsLink(data.tokenomics.metrics_link);
    setTokenMetricsUrl(data.tokenomics.metrics_link_logo_url);
    setTokenHoldersLink(data.tokenomics.holders_link);
    setWhaleHoldUrl(data.tokenomics.holders_link_logo_url);
    setTokenBigEvents(data.tokenomics.big_events_link);
    setBigEventUrl(data.tokenomics.big_events_link_logo_url);
    setTokenReference(data.tokenomics.reference);
    setEcoAmount(data.ecosystem.total_amount.toString());
    setGrowthUrl(data.ecosystem.growth_curve_picture_url);
    setEcoLink(data.ecosystem.growth_curve_source_link);
    setEcoProjects(data.ecosystem.top_projects ?? []);
    setEcoReference(data.ecosystem.reference);
    setModels(data.profitability.business_models ?? []);
    setStatementUrl(data.profitability.financial_statement_link_logo_url);
    setStatementLink(data.profitability.financial_statement_link);
    setProfitReference(data.profitability.reference);
  };

  const getTags = async () => {
    const listTagsResult = await listTags();
    if (listTagsResult.code === 0) {
      setTagOptions(
        listTagsResult.data.list?.map((chain: tagsOption) => {
          return {
            id: chain.id,
            value: chain.name,
            label: chain.name,
          };
        }),
      );
    }
  };
  const getProject = async () => {
    const infoResult = await getProjectInfo(location.query.id as string);
    if (infoResult.code === 0) {
      console.log(infoResult.data);
      restoreInfo(infoResult.data);
      setIsRestor(true);
    }
  };
  const getChains = async () => {
    const listChainsResult = await listChains();
    if (listChainsResult.code === 0) {
      setChainOptions(
        listChainsResult.data.list?.map((chain: chainsOption) => {
          return {
            value: chain.id,
            label: chain.name,
          };
        }),
      );
    }
  };
  const getTracks = async () => {
    const listTracksResult = await listTracks();
    if (listTracksResult.code === 0) {
      setTrackOptions(
        listTracksResult.data.list?.map((chain: tracksOption) => {
          return {
            value: chain.id,
            label: chain.name,
            isSelected: false,
          };
        }),
      );
    }
  };
  const getImpressions = async () => {
    const listImpressionsResult = await listImpressions();
    console.log(listImpressionsResult);
    if (listImpressionsResult.code === 0) {
      setImpressionOptions(
        listImpressionsResult.data.list?.map(
          (impression: impressionsOption) => {
            return {
              value: impression.id,
              label: impression.name,
            };
          },
        ),
      );
    }
  };
  const getInvestors = async () => {
    const listInvestorResult = await listInvestors();
    console.log(listInvestorResult);
    if (listInvestorResult.code === 0) {
      setInvestorOptions(
        listInvestorResult.data.list?.map((investor: investorOption) => {
          return {
            value: investor.id,
            label: investor.name,
          };
        }),
      );
      setAllInvestors(listInvestorResult.data.list);
    }
  };
  const getProjects = async () => {};

  useEffect(() => {
    const getConstants = () => {
      fetch('/constants.json').then((data) => {
        data.json().then((response) => {
          setConstants(response);
        });
      });
    };
    getConstants();
  }, []);

  useEffect(() => {
    if (chainsOptions.length === 0) {
      getChains();
    }
    if (trackOptions.length === 0) {
      getTracks();
    }
    if (tagOptions.length === 0) {
      getTags();
    }
    if (impressionOptions.length === 0) {
      getImpressions();
    }
    if (investorOptions.length === 0) {
      getInvestors();
    }
    if (!isRestor) {
      getProject();
    }
  });

  useEffect(() => {
    container?.addEventListener('scroll', (event) => {
      const el1 = document.getElementById('basic_info');
      const el2 = document.getElementById('related_links');
      const el3 = document.getElementById('team');
      const el4 = document.getElementById('funding');
      const el5 = document.getElementById('tokenomics');
      const el6 = document.getElementById('ecosystem');
      const el7 = document.getElementById('profitability');
      if (
        container.scrollTop >= (el1?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el1?.offsetTop ?? 206) - 106
      ) {
        setPercent(0);
        setAnchorIndex(1);
      }
      if (
        container.scrollTop >= (el2?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el2?.offsetTop ?? 206) - 106
      ) {
        setPercent(23);
        setAnchorIndex(2);
      }
      if (
        container.scrollTop >= (el3?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el3?.offsetTop ?? 206) - 106
      ) {
        setPercent(38);
        setAnchorIndex(3);
      }
      if (
        container.scrollTop >= (el4?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el4?.offsetTop ?? 206) - 106
      ) {
        setPercent(50);
        setAnchorIndex(4);
      }
      if (
        container.scrollTop >= (el5?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el5?.offsetTop ?? 206) - 106
      ) {
        setPercent(65);
        setAnchorIndex(5);
      }
      if (
        container.scrollTop >= (el6?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el6?.offsetTop ?? 206) - 106
      ) {
        setPercent(80);
        setAnchorIndex(6);
      }
      if (
        container.scrollTop >= (el7?.offsetTop ?? 206) - 206 &&
        container.scrollTop <= (el7?.offsetTop ?? 206) - 106
      ) {
        setPercent(100);
        setAnchorIndex(7);
      }
    });
  });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(logoUrl);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleTeamMemberPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleInvestorPreview = async (file: UploadFile) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj as RcFile);
    // }
    // setPreviewImage(file.url || (file.preview as string));
    // setPreviewOpen(true);
    // setPreviewTitle(
    //   file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    // );
  };

  const rollToElement = (id: string, progress: number) => {
    const element = document.getElementById(id);
    if (element) {
      container?.scrollTo({ top: element.offsetTop - 206, behavior: 'smooth' });
      setPercent(progress);
    }
    return;
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <div
        className={`ml-1 rounded-lg pl-6 pr-4 py-2 my-2 text-white flex ${
          colorGroups[
            tagValue.indexOf(value) % 7 === -1
              ? (tagValue.length - 1) % 7
              : tagValue.indexOf(value) % 7
          ]
        }`}
      >
        {label ?? value}
        <Xicon onClick={onClose} className="ml-1 mt-1 cursor-pointer" />
      </div>
    );
  };

  return (
    <>
      <div className="h-full overflow-auto" ref={setContainer}>
        <div className="p-6 bg-gray-50">
          <div className="font-bold text-2xl mb-4">
            {formatMessage({ id: 'PROJECT_INFO' })}
          </div>
          <Affix offsetTop={0} target={() => container}>
            <div className="bg-white shadow px-6 py-8 w-full">
              <div className="text-grey-700 text-sm font-medium">
                Progressing
              </div>
              <Progress
                className="mt-4"
                percent={percent}
                showInfo={false}
                strokeColor="#8B5CF6"
              />
              <div className="flex mt-2 justify-between">
                <div
                  onClick={() => {
                    rollToElement('basic_info', 0);
                    setAnchorIndex(1);
                  }}
                  className={anchorIndex > 0 ? anchorReached : anchorNotReached}
                >
                  Basic Information
                </div>
                <div
                  onClick={() => {
                    rollToElement('related_links', 23);
                    setAnchorIndex(2);
                  }}
                  className={anchorIndex > 1 ? anchorReached : anchorNotReached}
                >
                  Related Links
                </div>
                <div
                  onClick={() => {
                    rollToElement('team', 38);
                    setAnchorIndex(3);
                  }}
                  className={anchorIndex > 2 ? anchorReached : anchorNotReached}
                >
                  Team
                </div>
                <div
                  onClick={() => {
                    rollToElement('funding', 50);
                    setAnchorIndex(4);
                  }}
                  className={anchorIndex > 3 ? anchorReached : anchorNotReached}
                >
                  Funding
                </div>
                <div
                  onClick={() => {
                    rollToElement('tokenomics', 65);
                    setAnchorIndex(5);
                  }}
                  className={anchorIndex > 4 ? anchorReached : anchorNotReached}
                >
                  Tokenomics
                </div>
                <div
                  onClick={() => {
                    rollToElement('ecosystem', 80);
                    setAnchorIndex(6);
                  }}
                  className={anchorIndex > 5 ? anchorReached : anchorNotReached}
                >
                  Ecosystem
                </div>
                <div
                  onClick={() => {
                    rollToElement('profitability', 100);
                    setAnchorIndex(7);
                  }}
                  className={
                    anchorIndex > 6 ? anchorReachedLast : anchorNotReachedLast
                  }
                >
                  Profitability
                </div>
              </div>
            </div>
          </Affix>
          <Form form={form}>
            <div
              id="basic_info"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">
                  Basic Information
                </div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="text-grey-700 text-sm font-medium">
                  Name<span className="text-red-500">*</span>
                </div>
                <Input
                  value={basicName}
                  onChange={(e: BaseSyntheticEvent) => {
                    setBasicName(e.target.value);
                  }}
                  onBlur={() => {
                    setBasicNameError(basicName === '');
                  }}
                  status={basicNameError ? 'error' : ''}
                  className="mt-2 mb-0 py-3 px-2"
                  placeholder="Please enter name"
                />
                {basicNameError && (
                  <div className="text-red-500 font-normal text-sm ml-2 my-1">
                    Please enter name
                  </div>
                )}
                <div className="text-grey-700 text-sm font-medium mt-2">
                  Logo<span className="text-red-500">*</span>
                </div>
                <div className="flex mt-2">
                  {logoUrl === '' && (
                    <Image className="mt-2" src={DefaultAvatar} width={102} />
                  )}
                  {logoUrl !== '' && fileList.length === 0 && (
                    <Image
                      className="mt-2 rounded-full"
                      src={logoUrl}
                      width={102}
                    />
                  )}
                  <Form.Item className="ml-5 mt-2" name="logo">
                    <AntdImgCrop
                      minZoom={0.5}
                      onModalOk={onLogoCrop}
                      cropShape="round"
                    >
                      <Upload
                        maxCount={1}
                        showUploadList={true}
                        method="GET"
                        onChange={onChangeLogo}
                        onPreview={handlePreview}
                        listType="picture-circle"
                      >
                        +Upload
                      </Upload>
                    </AntdImgCrop>
                  </Form.Item>
                </div>
                <div className="text-grey-700 text-sm font-medium">
                  Description<span className="text-red-500">*</span>
                </div>
                <TextArea
                  value={description}
                  onChange={(e: BaseSyntheticEvent) => {
                    setDescription(e.target.value);
                  }}
                  onBlur={() => {
                    setDescriptionError(description === '');
                  }}
                  status={descriptionError ? 'error' : ''}
                  className="mt-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Enter a brief description here"
                />
                {descriptionError && (
                  <div className="text-red-500 font-normal text-sm ml-2 my-1">
                    Please enter description
                  </div>
                )}
                <div className="text-grey-700 text-sm font-medium mt-4">
                  Chains
                </div>
                <Select
                  value={chains}
                  onChange={(value: string[]) => {
                    setChains(value);
                  }}
                  mode="multiple"
                  placeholder="Please choose chains"
                  size="large"
                  className="my-4 w-full hover:border-purple-200 focus:border-purple-200"
                  options={chainsOptions}
                />
                <div className="text-grey-700 text-sm font-medium">
                  Tracks<span className="text-red-500">*</span>
                  <div className="mt-2 flex justify-start flex-wrap">
                    {trackOptions.map((track: trackRenderItem, index) => {
                      return (
                        <>
                          <div
                            onClick={() => {
                              track.isSelected = !track.isSelected;
                              setTrackOptions([
                                ...trackOptions.slice(0, index),
                                track,
                                ...trackOptions.slice(index + 1),
                              ]);
                            }}
                            className={
                              track.isSelected
                                ? selectTrackClass
                                : unSelectTrackClass
                            }
                          >
                            {track.label}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
                <div className="text-grey-700 text-sm font-medium mt-6">
                  Tags<span className="text-red-500">*</span>
                </div>
                {/* <Select
                  mode="tags"
                  options={tagOptions}
                  value={tagValue}
                  tagRender={tagRender}
                  onChange={async (items: string[]) => {
                    console.log(items);
                    if (items.length === 0) {
                      setTagValue(items);
                      return;
                    }
                    const filterTags = tagOptions.filter((tempTag) => {
                      return (
                        tempTag.value === items[items.length - 1] ||
                        tempTag.label === items[items.length - 1]
                      );
                    });
                    if (filterTags.length === 0) {
                      const addResult = await addNewTag(
                        items[items.length - 1],
                      );
                      if (addResult.code === 0) {
                        getTags();
                        setTagValue([...tagValue, addResult.data.id]);
                      }
                    } else {
                      setTagValue(items);
                    }
                  }}
                  onBlur={() => {
                    setTagValueError(tagValue.length === 0);
                  }}
                  status={tagValueError ? 'error' : ''}
                  size="large"
                  className="mt-4 w-full hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please choose tags"
                /> */}
                <Select
                  showSearch
                  options={tagOptions}
                  value={selectTag}
                  size="large"
                  onChange={(items: string) => {
                    console.log(tagOptions);
                    const newId = tagOptions.filter(
                      (tag) => tag.value === items,
                    )[0].id;
                    if (tagValue.filter((v) => v === newId).length === 0) {
                      setTagValue([...tagValue, newId]);
                    }
                  }}
                  onBlur={() => {
                    setTagValueError(tagValue.length === 0);
                  }}
                  className="mt-4 w-full hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please choose tags"
                />
                <div className="flex mt-2">
                  {tagValue.map((t, index) => {
                    return (
                      <div
                        key={t}
                        className={`rounded-lg flex pl-6 pr-4 py-2 mr-2 ${
                          colorGroups[(index + 1) % 8]
                        }`}
                      >
                        <div className="text-xs text-white">
                          {tagOptions.filter((v) => v.id === t).length > 0
                            ? tagOptions.filter((v) => v.id === t)[0].label
                            : ''}
                        </div>
                        <Xicon
                          onClick={() => {
                            setTagValue([
                              ...tagValue.slice(0, index),
                              ...tagValue.slice(index + 1),
                            ]);
                          }}
                          className="ml-1 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex">
                  <Input
                    value={tagInput}
                    placeholder="Please enter tags you want add"
                    size="large"
                    onChange={(e: BaseSyntheticEvent) => {
                      setTagInput(e.target.value);
                    }}
                  />
                  <div
                    onClick={async () => {
                      if (tagInput) {
                        const addResult = await addNewTag(tagInput || '');
                        if (addResult.code === 0) {
                          getTags();
                          setTagValue([...tagValue, addResult.data.id]);
                          setTagInput(undefined);
                        }
                      }
                    }}
                    className="rounded-lg border border-gray-300 py-4 px-5 w-24 ml-4 cursor-pointer hover:bg-gray-50 text-sm text-gray-700 hover:text-gray-300 active:bg-gray-50"
                  >
                    + Add
                  </div>
                </div>
                {tagValueError && (
                  <div className="text-red-500 font-normal text-sm ml-2 my-1">
                    Please choose tags
                  </div>
                )}
                <div className="text-grey-700 text-sm font-medium mt-4">
                  Influence
                </div>
                <div className="mt-2 flex justify-start flex-wrap">
                  <div
                    onClick={() => {
                      setIsKolHold(!isKolHold);
                    }}
                    className={
                      isKolHold ? selectTrackClass : unSelectTrackClass
                    }
                  >
                    KOLs Hold
                  </div>
                  <div
                    onClick={() => {
                      setIsKolSupport(!isKolSupport);
                    }}
                    className={
                      isKolSupport ? selectTrackClass : unSelectTrackClass
                    }
                  >
                    KOLs Support
                  </div>
                </div>
                {isKolHold && (
                  <div className="mt-6 flex">
                    <div className="flex-1">
                      <div className="text-grey-700 text-sm font-medium">
                        Detail
                      </div>
                      <Input
                        value={kolHoldDetail}
                        onChange={(e: BaseSyntheticEvent) => {
                          setKolHoldDetail(e.target.value);
                        }}
                        className="py-3 px-2 my-4 hover:border-purple-200 focus:border-purple-200"
                        placeholder="Enter detail of KoLs Hold"
                      />
                    </div>
                    <div className="flex-1 ml-6">
                      <div className="text-grey-700 text-sm font-medium">
                        Link
                      </div>
                      <Input
                        value={kolHoldLink}
                        onChange={(e: BaseSyntheticEvent) => {
                          setKolHoldLink(e.target.value);
                        }}
                        className="py-3 px-2 my-4 hover:border-purple-200 focus:border-purple-200"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                )}
                {isKolSupport && (
                  <div className="mt-6 flex">
                    <div className="flex-1">
                      <div className="text-grey-700 text-sm font-medium">
                        Detail
                      </div>
                      <Input
                        value={kolSupportDetail}
                        onChange={(e: BaseSyntheticEvent) => {
                          setKolSupportDetail(e.target.value);
                        }}
                        className="py-3 px-2 my-4 hover:border-purple-200 focus:border-purple-200"
                        placeholder="Enter detail of KoLs Support"
                      />
                    </div>
                    <div className="flex-1 ml-6">
                      <div className="text-grey-700 text-sm font-medium">
                        Link
                      </div>
                      <Input
                        value={kolSupportLink}
                        onChange={(e: BaseSyntheticEvent) => {
                          setKolSupportLink(e.target.value);
                        }}
                        className="py-3 px-2 my-4 hover:border-purple-200 focus:border-purple-200"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-6 text-grey-700 text-sm font-medium">
                  Founded Date<span className="text-red-500">*</span>
                </div>
                <DatePicker
                  className="mt-4 w-full h-12"
                  value={foundPanel}
                  onChange={(panel, date: string) => {
                    setFoundPanel(panel);
                    setFoundDate(date);
                  }}
                  renderExtraFooter={() => (
                    <div className="flex">
                      <div
                        onClick={() => {
                          setFoundDateMode('date');
                        }}
                        className={`ml-auto border my-2 text-sm px-2 rounded-l pt-0 hover:cursor-pointer ${
                          foundDateMode === 'date'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Day
                      </div>
                      <div
                        onClick={() => {
                          setFoundDateMode('month');
                        }}
                        className={`my-2 text-sm px-2 pt-0 border-t border-b hover:cursor-pointer ${
                          foundDateMode === 'month'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Month
                      </div>
                      <div
                        onClick={() => {
                          setFoundDateMode('year');
                        }}
                        className={`mr-auto border my-2 text-sm px-2 rounded-r pt-0 hover:cursor-pointer ${
                          foundDateMode === 'year'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Year
                      </div>
                    </div>
                  )}
                  showToday={false}
                  picker={foundDateMode}
                  status={foundDateError ? 'error' : ''}
                  onBlur={() => {
                    setFoundDateError(foundDate === '');
                  }}
                />
                {foundDateError && (
                  <div className="text-red-500 font-normal text-sm ml-2 my-1">
                    Please choose founded date
                  </div>
                )}
                <div className="text-grey-700 text-sm font-medium mt-4">
                  Launch Date<span className="text-red-500">*</span>
                </div>
                <DatePicker
                  className="w-full h-12 mt-4"
                  value={launchPanel}
                  onChange={(panel, date: string) => {
                    setLaunchPanel(panel);
                    setLaunchDate(date);
                  }}
                  renderExtraFooter={() => (
                    <div className="flex">
                      <div
                        onClick={() => {
                          setLaunchDateMode('date');
                        }}
                        className={`ml-auto border my-2 text-sm px-2 rounded-l pt-0 hover:cursor-pointer ${
                          launchDateMode === 'date'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Day
                      </div>
                      <div
                        onClick={() => {
                          setLaunchDateMode('month');
                        }}
                        className={`my-2 text-sm px-2 pt-0 border-t border-b hover:cursor-pointer ${
                          launchDateMode === 'month'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Month
                      </div>
                      <div
                        onClick={() => {
                          setLaunchDateMode('year');
                        }}
                        className={`mr-auto border my-2 text-sm px-2 rounded-r pt-0 hover:cursor-pointer ${
                          launchDateMode === 'year'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Year
                      </div>
                    </div>
                  )}
                  showToday={false}
                  picker={launchDateMode}
                  status={launchDateError ? 'error' : ''}
                  onBlur={() => {
                    setLaunchDateError(foundDate === '');
                  }}
                />
                {launchDateError && (
                  <div className="text-red-500 font-normal text-sm ml-2 my-1">
                    Please choose launch date
                  </div>
                )}
                <div className="text-grey-700 text-sm font-medium mt-6">
                  Open source<span className="text-red-500">*</span>
                </div>
                <Radio.Group
                  className="my-4"
                  value={isOpenSource}
                  onChange={changeOpenSource}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Yes</Radio>
                    <Radio value={2}>No</Radio>
                  </Space>
                </Radio.Group>
                <div className="text-grey-700 text-sm font-medium">
                  Reference
                </div>
                <TextArea
                  value={basicReference}
                  onChange={(e: BaseSyntheticEvent) => {
                    setBasicReference(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Please enter references here, including links and description."
                />
              </div>
            </div>
            <div
              id="related_links"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">
                  Related Links
                </div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="flex">
                  <div className="flex-1">
                    <div className="text-grey-700 text-sm font-medium">
                      Type
                    </div>
                    <Select
                      disabled
                      className="w-full mt-2"
                      size="large"
                      defaultValue="Official Website"
                      options={linkOptions}
                    />
                    {linkGroups.map((links, index) => (
                      <Select
                        key={`link-select-${index}`}
                        className="w-full mt-2"
                        size="large"
                        placeholder="Please select link type"
                        value={links.type === '' ? undefined : links.type}
                        onChange={(value: string) => {
                          links.type = value;
                          setLinkGroups([
                            ...linkGroups.slice(0, index),
                            links,
                            ...linkGroups.slice(index + 1),
                          ]);
                        }}
                        options={linkOptions}
                      />
                    ))}
                  </div>
                  <div className="flex-1 ml-6">
                    <div className="text-grey-700 text-sm font-medium">
                      Link
                    </div>
                    <Input
                      value={officialLink}
                      onChange={(e: BaseSyntheticEvent) => {
                        setOfficialLink(e.target.value);
                      }}
                      placeholder="https://"
                      className="w-full mt-2"
                      size="large"
                    />
                    {linkGroups.map((links, index) => (
                      <Input
                        value={links.link}
                        onChange={(e: BaseSyntheticEvent) => {
                          links.link = e.target.value;
                          setLinkGroups([
                            ...linkGroups.slice(0, index),
                            links,
                            ...linkGroups.slice(index + 1),
                          ]);
                        }}
                        placeholder="https://"
                        key={`link-input-${index}`}
                        className="w-full mt-2"
                        size="large"
                      />
                    ))}
                  </div>
                  <div className="flex-none ml-6">
                    <div className={linkRemoveDisabledClass}>- Remove</div>
                    {linkGroups.map((links, index) => (
                      <div
                        onClick={() => {
                          const temp = [
                            ...linkGroups.slice(0, index),
                            ...linkGroups.slice(index + 1),
                          ];
                          console.log(temp);
                          setLinkGroups([
                            ...linkGroups.slice(0, index),
                            ...linkGroups.slice(index + 1),
                          ]);
                        }}
                        key={`link-remove-${index}`}
                        className={linkRemoveClass}
                      >
                        - Remove
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  onClick={() => {
                    setLinkGroups([...linkGroups, { type: '', link: '' }]);
                  }}
                  className="hover:bg-gray-50 hover:text-gray-300 border text-sm text-gray-700 cursor-pointer rounded-lg text-center py-3 mt-6 active:bg-gray-50 active:text-gray-700"
                >
                  + Add
                </div>
                {/* <div className="text-grey-700 text-sm font-medium mt-6">
                  Reference<span className="text-red-500">*</span>
                </div>
                <Form.Item className="mt-2" name="related_reference">
                  <TextArea
                    className="text-sm hover:border-purple-200 focus:border-purple-200"
                    showCount
                    rows={4}
                    maxLength={500}
                    placeholder="Please enter references here, including links and description."
                  />
                </Form.Item> */}
              </div>
            </div>
            <div
              id="team"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">Team</div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="text-grey-700 text-sm font-medium">
                  Team Impression
                </div>
                <Select
                  value={impressions}
                  onChange={async (value: string[]) => {
                    if (
                      value.length > 0 &&
                      impressionOptions.filter((impression) => {
                        return impression.value === value[value.length - 1];
                      }).length === 0
                    ) {
                      const addImpressionRes = await addImpressions(
                        value[value.length - 1],
                      );
                      console.log(addImpressionRes);
                      if (addImpressionRes.code === 0) {
                        getImpressions();
                        setImpressions([
                          ...impressions,
                          addImpressionRes.data.id,
                        ]);
                      }
                    } else {
                      setImpressions(value);
                    }
                  }}
                  mode="tags"
                  placeholder="Please choose team impression"
                  size="large"
                  className="my-4 w-full hover:border-purple-200 focus:border-purple-200"
                  options={impressionOptions}
                />
                <div className="text-grey-700 text-sm font-medium">
                  Team member<span className="text-red-500">*</span>
                </div>
                {teamMembers.map((member, index) => (
                  <div
                    key={`teammember-${index}`}
                    className="mt-2 border rounded-md p-4"
                  >
                    <div className="flex">
                      <Image
                        src={member.avatar}
                        width={56}
                        className=" rounded-full"
                        preview={false}
                      />
                      <div className="ml-4">
                        <div className="text-gray-700 font-bold text-base">
                          {member.name}
                        </div>
                        <div className="mt-1 text-gray-500 text-sm font-normal">
                          {member.title}
                        </div>
                      </div>
                      {member.isDeparted === 1 && (
                        <div className="px-2 border bg-gray-100 font-medium text-gray-700 text-sm h-6 ml-3 rounded-full">
                          Departed
                        </div>
                      )}
                      {member.isDeparted === 2 && (
                        <div className="px-2 border bg-green-100 font-medium text-green-700 text-sm h-6 ml-3 rounded-full">
                          Active
                        </div>
                      )}
                      <Delete
                        onClick={() => {
                          setTeamDeleteIndex(index);
                          setIsTeamDeleteModalOpen(true);
                        }}
                        className="ml-auto cursor-pointer"
                      />
                      <Edit
                        onClick={() => {
                          setIsMemberModalOpen(true);
                          setTeamModifyIndex(index);
                          setIsTeamModify(true);
                          setMemberName(member.name ?? '');
                          setMemberTitle(member.title ?? '');
                          setTeamUploadUrl(member.avatar ?? '');
                          setIsDeparted(member.isDeparted);
                          setMemberDescription(member.desc ?? '');
                          setIsTwitter(member.isTwitter);
                          setIsLinkedIn(member.isLinkedIn);
                          setTwitterLink(member.twitterLink ?? '');
                          setLinkedinLink(member.linkedinLink ?? '');
                        }}
                        className="ml-4 cursor-pointer"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500 font-normal">
                      {member.desc}
                    </div>
                    <div className="mt-2 text-sm text-gray-300 font-normal">
                      {member.twitterLink}
                    </div>
                    <div className="mt-2 text-sm text-gray-300 font-normal">
                      {member.linkedinLink}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setIsMemberModalOpen(true);
                  }}
                  className="w-full h-10 my-4"
                >
                  + Add Team Member
                </Button>
                <div className="text-grey-700 text-sm font-medium">
                  Reference
                </div>
                <TextArea
                  value={teamReference}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTeamReference(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Please enter references here, including links and description."
                />
              </div>
            </div>
            <div
              id="funding"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">Funding</div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="text-grey-700 text-sm font-medium">
                  Top Investors & KOLs
                </div>
                <Select
                  mode="multiple"
                  value={investors.map((investor) => investor.id)}
                  removeIcon={null}
                  tagRender={(investorProps) => {
                    console.log(investorProps);
                    return (
                      <Tag>
                        {investors.filter(
                          (investor) => investor.id === investorProps.value,
                        ) ?? [0].name}
                      </Tag>
                    );
                  }}
                  onChange={(value: string[]) => {
                    const updateValues = [];
                    for (let i = 0; i < value.length; i++) {
                      let isIn = false;
                      for (let j = 0; j < investors.length; j++) {
                        if (investors[j].id === value[i]) {
                          isIn = true;
                          break;
                        }
                      }
                      if (!isIn) {
                        updateValues.push(value[i]);
                      }
                    }
                    for (let i = 0; i < updateValues.length; i++) {
                      for (let j = 0; j < allInvestors.length; j++) {
                        if (updateValues[i] === allInvestors[j].id) {
                          investors.push({
                            name: allInvestors[j].name,
                            id: allInvestors[j].id,
                            description: allInvestors[j].description,
                            avatar_url: allInvestors[j].avatar_url,
                            subject: allInvestors[j].subject,
                            type: allInvestors[j].subject,
                            social_media_links:
                              allInvestors[j].social_media_links,
                          });
                          break;
                        }
                      }
                    }
                    setInvestors([...investors]);
                  }}
                  placeholder="Please choose top investors & KOLs"
                  size="large"
                  className="mt-4 w-full hover:border-purple-200 focus:border-purple-200"
                  options={investorOptions}
                />
                {investors.map((investor, index) => {
                  return (
                    <div
                      key={`investor-${index}`}
                      className="mt-2 border border-gray-300 rounded-md w-full flex p-4"
                    >
                      <div className="flex flex-row">
                        <Image
                          src={investor.avatar_url}
                          width={56}
                          className="rounded-full mt-auto mb-auto"
                          preview={false}
                        />
                      </div>
                      <div className="ml-4 w-full">
                        <div className="flex">
                          <div className="text-gray-700 text-base font-bold">
                            {investor.name}
                          </div>
                          <Delete
                            onClick={() => {
                              setInvestorDeleteIndex(index);
                              setIsDeleteModalOpen(true);
                            }}
                            className="ml-auto cursor-pointer"
                          />
                          <Edit
                            onClick={() => {
                              setIsInvestorModify(true);
                              setInvestorModifyIndex(index);
                              setInvestorName(investor.name);
                              setInvestorSubject(investor.subject);
                              setInvestorType(investor.type);
                              setInvestorUploadUrl(investor.avatar_url);
                              setIsInvestorModalOpen(true);
                            }}
                            className="ml-4 cursor-pointer"
                          />
                        </div>
                        <div className="mt-1 text-gray-500 text-sm font-normal">
                          {`${
                            investor.subject === 2
                              ? ''
                              : investor.subject === 1
                              ? 'Individual'
                              : 'Institution'
                          }、${
                            investor.type === 2
                              ? ''
                              : investor.type === 1
                              ? 'Top Investor'
                              : 'KOL'
                          }`}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button
                  onClick={() => {
                    setIsInvestorModalOpen(true);
                  }}
                  className="w-full h-10 mt-2"
                >
                  + Add
                </Button>
                <div className="mt-4 text-grey-700 text-sm font-medium">
                  Round
                </div>
                {rounds.map((tempRound, index) => {
                  return (
                    <>
                      <div className="mt-2 border border-gray-300 p-4 w-full">
                        <div className="flex w-full">
                          <div className="text-gray-700 font-bold text-base rounded-md">
                            {tempRound.round}
                          </div>
                          <Delete
                            onClick={() => {
                              setIsRoundDeleteModalOpen(true);
                              setRoundDeleteIndex(index);
                            }}
                            className="ml-auto cursor-pointer"
                          />
                          <Edit
                            onClick={() => {
                              setRound(tempRound.round);
                              setRoundDate(tempRound.date);
                              setRoundAmount(tempRound.amount);
                              setRoundValuation(tempRound.valuation);
                              setRoundInevstors(tempRound.investors);
                              setLeadInvestors(tempRound.lead_investors);
                              setIsRoundModify(true);
                              setRoundModifyIndex(index);
                              setIsRoundModalOpen(true);
                            }}
                            className="ml-4 cursor-pointer"
                          />
                        </div>
                        <div className="text-gray-500 text-sm font-normal">
                          {tempRound.date}
                        </div>
                        <div className="flex">
                          <div>
                            <div className="text-gray-700 text-sm font-medium mt-2">
                              Amount
                            </div>
                            <div className="text-gray-700 text-sm font-medium mt-2">
                              Valuation
                            </div>
                            <div className="text-gray-700 text-sm font-medium mt-2">
                              Investor
                            </div>
                            <div className="text-gray-700 text-sm font-medium mt-2">
                              Lead Investor
                            </div>
                          </div>
                          <div className="ml-8">
                            <div className="text-gray-500 text-sm font-normal mt-2">
                              {tempRound.amount === 0
                                ? '-'
                                : `$ ${showBriefAmount(tempRound.amount)}`}
                            </div>
                            <div className="text-gray-500 text-sm font-normal mt-2">
                              {tempRound.valuation === 0
                                ? '-'
                                : `$ ${showBriefAmount(tempRound.valuation)}`}
                            </div>
                            <div className="text-gray-500 text-sm font-normal mt-2">
                              {tempRound.investors}
                            </div>
                            <div className="text-gray-500 text-sm font-normal mt-2">
                              {tempRound.lead_investors}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <Form.Item className="mt-2" name="related_reference">
                  <Button
                    onClick={() => {
                      setIsRoundModalOpen(true);
                    }}
                    className="w-full h-10"
                  >
                    + Add
                  </Button>
                </Form.Item>
                <div className="text-grey-700 text-sm font-medium">
                  Reference
                </div>
                <TextArea
                  value={fundingReference}
                  onChange={(e: BaseSyntheticEvent) => {
                    setFundingReference(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Please enter references here, including links and description."
                />
              </div>
            </div>
            <div
              id="tokenomics"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">
                  Tokenomics
                </div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="text-grey-700 text-sm font-medium">
                  Token Issuance
                </div>
                <Radio.Group
                  className="mt-2"
                  defaultValue={1}
                  value={tokenIssuance}
                  onChange={(e: RadioChangeEvent) => {
                    setTokenIssuance(e.target.value);
                  }}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Yes</Radio>
                    <Radio value={2}>No</Radio>
                  </Space>
                </Radio.Group>
                <div className="mt-4 text-grey-700 text-sm font-medium">
                  Team Token Symbol
                </div>
                <Input
                  value={tokenSymbol}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenSymbol(e.target.value);
                  }}
                  className="my-2 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please enter token symbol"
                />
                <div className="mt-2 text-grey-700 text-sm font-medium">
                  Token Issuance Date
                </div>
                <DatePicker
                  className="my-2 w-full h-12"
                  onChange={(panel, date: string) => {
                    setTokenPanel(panel);
                    setTokenDate(date);
                  }}
                  renderExtraFooter={() => (
                    <div className="flex">
                      <div
                        onClick={() => {
                          setTokenDateMode('date');
                        }}
                        className={`ml-auto border my-2 text-sm px-2 rounded-l pt-0 hover:cursor-pointer ${
                          tokenDateMode === 'date'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Day
                      </div>
                      <div
                        onClick={() => {
                          setTokenDateMode('month');
                        }}
                        className={`my-2 text-sm px-2 pt-0 hover:cursor-pointer ${
                          tokenDateMode === 'month'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Month
                      </div>
                      <div
                        onClick={() => {
                          setTokenDateMode('year');
                        }}
                        className={`mr-auto border my-2 text-sm px-2 rounded-r pt-0 hover:cursor-pointer ${
                          tokenDateMode === 'year'
                            ? 'bg-purple-700 text-white'
                            : ''
                        }`}
                      >
                        Year
                      </div>
                    </div>
                  )}
                  showToday={false}
                  value={tokenPanel}
                  picker={tokenDateMode}
                />
                <div className="mt-2 text-grey-700 text-sm font-medium">
                  Initial Distribution
                </div>
                <Form.Item className="mt-2" name="initial_distribution">
                  <Radio.Group
                    defaultValue={1}
                    value={tokenDistributionMode}
                    onChange={(e: RadioChangeEvent) => {
                      setTokenDistributionMode(e.target.value);
                    }}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>Upload</Radio>
                      <Radio value={2}>Enter</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                {tokenDistributionMode === 1 && (
                  <>
                    <div className="text-grey-700 text-sm font-medium">
                      Upload Figure
                    </div>
                    <Form.Item className="mt-2" name="initial_distribution">
                      <Upload.Dragger
                        maxCount={1}
                        method="GET"
                        onChange={({ fileList: newFileList }) => {
                          if (newFileList.length === 0) {
                            setDistributionUrl('');
                          }
                        }}
                        beforeUpload={async (file: RcFile) => {
                          const uploadResult = await uploadFile(file);
                          if (uploadResult.code === 0) {
                            setDistributionUrl(uploadResult.data.url);
                          }
                        }}
                        className="bg-white"
                      >
                        {distributionUrl === '' && (
                          <>
                            <p className="mt-6">
                              <Image
                                preview={false}
                                src={UploadPng}
                                width={36}
                              />
                            </p>
                            <p className="ant-upload-text">
                              <span className="text-indigo-600 mr-1">
                                Upload a file
                              </span>
                              or drag and drop
                            </p>
                            <p className="ant-upload-hint mb-6">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                        {distributionUrl !== '' && (
                          <Image
                            preview={false}
                            src={distributionUrl}
                            width={500}
                          />
                        )}
                      </Upload.Dragger>
                    </Form.Item>
                  </>
                )}
                {tokenDistributionMode === 2 && (
                  <>
                    <div className="flex">
                      <div className="flex-1">
                        <div className="text-grey-700 text-sm font-medium">
                          Slice<span className="text-red-500">*</span>
                        </div>
                        {distributions?.map((distribution, index) => (
                          <Input
                            key={`link-select-${index}`}
                            className="w-full mt-2"
                            size="large"
                            placeholder="Please enter slice"
                            value={distribution.slice}
                            onChange={(e: BaseSyntheticEvent) => {
                              distribution.slice = e.target.value;
                              setDistributions([
                                ...distributions.slice(0, index),
                                distribution,
                                ...distributions.slice(index + 1),
                              ]);
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex-1 ml-6">
                        <div className="text-grey-700 text-sm font-medium">
                          Percentage<span className="text-red-500">*</span>
                        </div>
                        {distributions?.map((distribution, index) => (
                          <Input
                            value={distribution.percentage}
                            onChange={(e: BaseSyntheticEvent) => {
                              distribution.percentage = parseFloat(
                                e.target.value,
                              );
                              setDistributions([
                                ...distributions.slice(0, index),
                                distribution,
                                ...distributions.slice(index + 1),
                              ]);
                            }}
                            onBlur={() => {
                              distribution.percentage = Math.floor(
                                distribution.percentage,
                              );
                              setDistributions([
                                ...distributions.slice(0, index),
                                distribution,
                                ...distributions.slice(index + 1),
                              ]);
                            }}
                            key={`link-input-${index}`}
                            className="w-full mt-2"
                            size="large"
                            type="number"
                            placeholder="Please enter percentage"
                            suffix="%"
                          />
                        ))}
                      </div>
                      <div className="flex-none mt-5 ml-6">
                        {distributions?.map((links, index) => (
                          <div
                            onClick={() => {
                              const temp = [
                                ...distributions.slice(0, index),
                                ...distributions.slice(index + 1),
                              ];
                              setDistributions([
                                ...distributions.slice(0, index),
                                ...distributions.slice(index + 1),
                              ]);
                            }}
                            key={`link-remove-${index}`}
                            className={linkRemoveClass}
                          >
                            - Remove
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        console.log(distributions);
                        if (distributions) {
                          setDistributions([
                            ...distributions,
                            { slice: '', percentage: 0 },
                          ]);
                        } else {
                          setDistributions([{ slice: '', percentage: 0 }]);
                        }
                      }}
                      className="border text-sm text-gray-700 cursor-pointer rounded-lg text-center py-3 my-2 hover:bg-gray-50 hover:text-gray-300 active:bg-gray-50 active:text-gray-300"
                    >
                      + Add
                    </div>
                  </>
                )}
                <div className="text-grey-700 text-sm font-medium">Link</div>
                <Input
                  value={tokenLink}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenLink(e.target.value);
                  }}
                  className="my-4 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please enter link"
                />
                <div className="text-grey-700 text-sm font-medium">
                  Tokenomics Description
                </div>
                <TextArea
                  value={tokenDesc}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenDesc(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  placeholder="Please enter tokenomics description."
                />
                <div className="text-grey-700 text-sm font-medium">
                  More Token Metrics
                </div>
                <div className="flex mt-2">
                  {tokenMetricsUrl !== '' && tokenMetricsDisplay && (
                    <Image
                      className="mt-2 rounded-full"
                      src={tokenMetricsUrl}
                      width={102}
                    />
                  )}
                  <Form.Item className="my-2" name="token_logo">
                    <AntdImgCrop onModalOk={onTokenMetrics} cropShape="round">
                      <Upload
                        maxCount={1}
                        method="GET"
                        onChange={() => setTokenMetricsDisplay(false)}
                        onPreview={handlePreview}
                        listType="picture-circle"
                      >
                        <Image preview={false} src={UploadPng} width={24} />
                      </Upload>
                    </AntdImgCrop>
                  </Form.Item>
                </div>
                <Input
                  value={tokenMetricsLink}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenMetricsLink(e.target.value);
                  }}
                  className="my-4 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please Enter reference link"
                />
                <div className="text-grey-700 text-sm font-medium">
                  Whale&KOL Hold
                </div>
                <div className="flex mt-2">
                  {whaleHoldUrl !== '' && whaleHoldDisplay && (
                    <Image
                      className="mt-2 rounded-full"
                      src={whaleHoldUrl}
                      width={102}
                    />
                  )}
                  <Form.Item className="my-2" name="whale_kol_hold">
                    <AntdImgCrop onModalOk={onWhaleHold} cropShape="round">
                      <Upload
                        maxCount={1}
                        method="GET"
                        onChange={() => setWhaleHoldDisplay(false)}
                        onPreview={handlePreview}
                        listType="picture-circle"
                      >
                        <Image preview={false} src={UploadPng} width={24} />
                      </Upload>
                    </AntdImgCrop>
                  </Form.Item>
                </div>
                <Input
                  value={tokenHoldersLink}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenHoldersLink(e.target.value);
                  }}
                  className="my-4 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please Enter reference link"
                />
                <div className="text-grey-700 text-sm font-medium">
                  Big Events
                </div>
                <div className="flex mt-2">
                  {bigEventUrl !== '' && bigEventDisplay && (
                    <Image
                      className="mt-2 rounded-full"
                      src={bigEventUrl}
                      width={102}
                    />
                  )}
                  <Form.Item className="my-2 ml-2" name="big_events">
                    <AntdImgCrop onModalOk={onBigEvent} cropShape="round">
                      <Upload
                        maxCount={1}
                        method="GET"
                        onChange={() => {
                          setBigEventDisplay(false);
                        }}
                        onPreview={handlePreview}
                        listType="picture-circle"
                      >
                        <Image preview={false} src={UploadPng} width={24} />
                      </Upload>
                    </AntdImgCrop>
                  </Form.Item>
                </div>
                <Input
                  value={tokenBigEvents}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenBigEvents(e.target.value);
                  }}
                  className="my-4 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please Enter reference link"
                />
                <div className="text-grey-700 text-sm font-medium">
                  Reference
                </div>
                <TextArea
                  value={tokenReference}
                  onChange={(e: BaseSyntheticEvent) => {
                    setTokenReference(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Please enter references here, including links and description.."
                />
              </div>
            </div>
            <div
              id="ecosystem"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">
                  Ecosystem
                </div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="text-grey-700 text-sm font-medium">
                  Total amount
                </div>
                <Input
                  type="number"
                  value={ecoAmount === '0' ? '' : ecoAmount}
                  onChange={(e: BaseSyntheticEvent) => {
                    setEcoAmount(e.target.value);
                  }}
                  className="my-4 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please enter total amount"
                />
                <div className="flex">
                  <div className="flex-1">
                    <div className="text-grey-700 text-sm font-medium">
                      Ecological Growth Curve
                    </div>
                    <Form.Item className="mt-2" name="growth_curve">
                      <Upload.Dragger
                        maxCount={1}
                        method="GET"
                        onChange={({ fileList: newFileList }) => {
                          if (newFileList.length === 0) {
                            setGrowthUrl('');
                          }
                        }}
                        beforeUpload={async (file: RcFile) => {
                          const uploadResult = await uploadFile(file);
                          if (uploadResult.code === 0) {
                            setGrowthUrl(uploadResult.data.url);
                          }
                        }}
                        className="bg-white"
                      >
                        {growthUrl === '' && (
                          <>
                            <p className="mt-6">
                              <Image
                                preview={false}
                                src={UploadPng}
                                width={36}
                              />
                            </p>
                            <p className="ant-upload-text">
                              <span className="text-indigo-600">
                                Upload a file
                              </span>
                              or drag and drop
                            </p>
                            <p className="ant-upload-hint mb-6">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                        {growthUrl !== '' && (
                          <Image preview={false} src={growthUrl} width={300} />
                        )}
                      </Upload.Dragger>
                    </Form.Item>
                  </div>
                  <div className="flex-1 ml-6">
                    <div className="text-grey-700 text-sm font-medium">
                      Link
                    </div>
                    <Input
                      value={ecoLink}
                      onChange={(e: BaseSyntheticEvent) => {
                        setEcoLink(e.target.value);
                      }}
                      className="my-4 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                      placeholder="Please enter total amount"
                    />
                  </div>
                </div>
                <div className="text-grey-700 text-sm font-medium">
                  Top5 in the Ecosystem
                </div>
                <Select
                  mode="multiple"
                  removeIcon={null}
                  onChange={async (value: string[]) => {
                    if (
                      value.length > 0 &&
                      ecoProjects.filter((ecoProject) => {
                        return ecoProject.id === value[value.length - 1];
                      }).length === 0
                    ) {
                      const getBriefProjectResult = await getBriefProject(
                        value[value.length - 1],
                      );
                      if (getBriefProjectResult.code === 0) {
                        setEcoProjects([
                          ...ecoProjects,
                          {
                            id: value[value.length - 1],
                            name: getBriefProjectResult.data.name,
                            description: getBriefProjectResult.data.description,
                            logo_url: getBriefProjectResult.data.logo_url,
                            official_website:
                              getBriefProjectResult.data.official_website,
                          },
                        ]);
                      }
                    }
                  }}
                  placeholder="Please enter top5 in the ecosystem"
                  size="large"
                  className="my-2 hover:border-purple-200 focus:border-purple-200 w-full"
                  onFocus={async () => {
                    const queryParmas = {
                      page: 1,
                      query: '',
                      status: 0,
                      sort_field: 'create_time',
                      is_asc: true,
                    };
                    const listResult = await listProjects(queryParmas);
                    if (listResult.code === 0) {
                      const currentList = listResult.data.list?.map(
                        (item: any) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        },
                      );
                      setTopProjectOptions(currentList);
                    }
                  }}
                  options={topProjectOptions}
                />
                {ecoProjects.map((project, index) => {
                  return (
                    <div
                      key={`project-${index}`}
                      className="border border-gray-300 rounded-md p-4 flex mt-2"
                    >
                      <Image
                        src={project.logo_url}
                        width={56}
                        className="rounded-full mt-auto mb-auto"
                        preview={false}
                      />
                      <div className="ml-4 w-full">
                        <div className="flex">
                          <div className="font-bold text-base text-gray-700">
                            {project.name}
                          </div>
                          <Delete
                            onClick={() => {
                              setEcoProjects([
                                ...ecoProjects.slice(0, index),
                                ...ecoProjects.slice(index + 1),
                              ]);
                            }}
                            className="ml-auto cursor-pointer"
                          />
                          <Edit
                            onClick={() => {
                              setEcoProjectName(project.name);
                              setEcoProjectDesc(project.description);
                              setEcoWebsite(project.official_website);
                              setIsAddTopProjectModalOpen(true);
                              setIsEcoProjectModify(true);
                              setEcoProjectModifyIndex(index);
                            }}
                            className="ml-4 cursor-pointer"
                          />
                        </div>
                        <div className="text-gray-500 font-normal text-sm">
                          {project.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button
                  onClick={() => {
                    setIsAddTopProjectModalOpen(true);
                    // const addResult = await addProject();
                    // if (addResult.code === 0) {
                    //   window.open(
                    //     `./edit_project?id=${addResult.data.id}`,
                    //     '_blank',
                    //   );
                    // }
                  }}
                  className="w-full h-10 mt-2 mb-4"
                >
                  + Add
                </Button>
                <div className="text-grey-700 text-sm font-medium">
                  Reference
                </div>
                <TextArea
                  value={ecoReference}
                  onChange={(e: BaseSyntheticEvent) => {
                    setEcoReference(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Please enter references here, including links and description."
                />
              </div>
            </div>
            <div
              id="profitability"
              className="bg-white mt-4 shadow px-6 py-10 w-full flex"
            >
              <div className="flex-none">
                <div className="text-grey-700 font-bold text-base">
                  Profitability
                </div>
                <div className="text-grey-500 font-medium text-sm mt-1">
                  This is basic Information of this project
                </div>
              </div>
              <div className="flex-auto ml-9">
                <div className="text-grey-700 text-sm font-medium">
                  Business Model
                </div>
                {models.map((model, index) => {
                  return (
                    <>
                      <div className="mt-2 border border-gray-300 p-4 rounded-md">
                        <div className="flex">
                          <div className="text-gray-700 font-bold text-base">
                            {model.model}
                          </div>
                          <Delete
                            onClick={() => {
                              setModels([
                                ...models.slice(0, index),
                                ...models.slice(index + 1),
                              ]);
                            }}
                            className="ml-auto cursor-pointer"
                          />
                          <Edit
                            onClick={() => {
                              setIsAddModelsOpen(true);
                              setIsModelModify(true);
                              setModelModifyIndex(index);
                              setModelName(model.model);
                              setModelAnnual(model.annual_income.toString());
                              setModelDesc(model.description);
                            }}
                            className="ml-4 cursor-pointer"
                          />
                        </div>
                        <div className="flex">
                          <div>
                            <div className="mt-2 text-gray-700 text-sm font-medium">
                              Revenue Income
                            </div>
                            <div className="mt-2 text-gray-700 text-sm font-medium">
                              Description
                            </div>
                          </div>
                          <div className="ml-8">
                            <div className="mt-2 text-gray-500 text-sm font-normal">
                              {`$ ${model.annual_income} million`}
                            </div>
                            <div className="mt-2 text-gray-500 text-sm font-normal">
                              {model.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <Form.Item className="mt-2" name="business_model">
                  <Button
                    onClick={() => {
                      setIsAddModelsOpen(true);
                    }}
                    className="w-full h-10 mt-2"
                  >
                    + Add
                  </Button>
                </Form.Item>
                <div className="text-grey-700 text-sm font-medium">
                  Financial Statement
                </div>
                <div className="flex mt-2">
                  {statementUrl !== '' && statementDisplay && (
                    <Image
                      className="mt-2 rounded-full mr-2"
                      src={statementUrl}
                      width={102}
                    />
                  )}
                  <Form.Item className="my-2 ml-2" name="financial_statement">
                    <AntdImgCrop
                      onModalOk={onFinancialStatement}
                      cropShape="round"
                    >
                      <Upload
                        maxCount={1}
                        method="GET"
                        onChange={() => {
                          setStatementDisplay(false);
                        }}
                        onPreview={handlePreview}
                        listType="picture-circle"
                      >
                        <Image preview={false} src={UploadPng} width={24} />
                      </Upload>
                    </AntdImgCrop>
                  </Form.Item>
                </div>
                <Input
                  value={statementLink}
                  onChange={(e: BaseSyntheticEvent) => {
                    setStatementLink(e.target.value);
                  }}
                  className="my-2 py-3 px-2 hover:border-purple-200 focus:border-purple-200"
                  placeholder="Please Enter reference link"
                />
                <div className="mt-2 text-grey-700 text-sm font-medium">
                  Reference
                </div>
                <TextArea
                  value={profitReference}
                  onChange={(e: BaseSyntheticEvent) => {
                    setProfitReference(e.target.value);
                  }}
                  className="my-4 text-sm hover:border-purple-200 focus:border-purple-200"
                  showCount
                  rows={4}
                  maxLength={500}
                  placeholder="Please enter references here, including links and description."
                />
              </div>
            </div>
          </Form>
        </div>
        <div className="h-28 w-20" />
        <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 fixed bottom-0 left-60 right-0 flex">
          <div
            onClick={() => {
              setIsLeaveModalOpen(true);
            }}
            className="border border-red-500 text-red-500 active:text-red-700 px-4 py-1 rounded-xl cursor-pointer hover:bg-red-50"
          >
            Cancel
          </div>
          <Select
            defaultValue={0}
            value={editStatus}
            onChange={(value) => {
              setEditStatus(value);
            }}
            className="ml-auto rounded-xl"
            style={{ width: 160 }}
            options={[
              { value: 0, label: 'Incomplete' },
              { value: 1, label: 'Core Data Complete' },
              { value: 2, label: 'Complete' },
            ]}
          />
          <div
            onClick={() => {
              updateInfo();
            }}
            className="ml-3 border border-purple-500 text-purple-500 active:text-purple-500 px-4 py-1 rounded-xl cursor-pointer hover:bg-purple-50 hover:text-purple-300"
          >
            Save
          </div>
          <div
            onClick={() => {
              if (editStatus === 0) {
                return;
              }
              publishInfo();
            }}
            className={`ml-2 text-white px-4 py-1 rounded-xl ${
              editStatus === 0
                ? 'bg-purple-100 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-300 cursor-pointer  active:bg-purple-700'
            }`}
          >
            Publish
          </div>
        </div>
      </div>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Modal
        closable={false}
        title="Add a Business Model"
        open={isAddModelsOpen}
        okText={isModelModify ? 'Edit' : 'Add'}
        onCancel={() => {
          setIsAddModelsOpen(false);
          setModelName('');
          setModelAnnual('');
          setModelDesc('');
          setIsModelModify(false);
          setModelModifyIndex(-1);
          setModelNameError(false);
          setModelAnnualError(false);
          setModelDescError(false);
        }}
        onOk={() => {
          let checkField = false;
          if (modelName === '') {
            setModelNameError(true);
            checkField = true;
          }
          // if (modelAnnual === '') {
          //   setModelAnnualError(true);
          //   checkField = true;
          // }
          // if (modelDesc === '') {
          //   setModelDescError(true);
          //   checkField = true;
          // }
          if (checkField) {
            return;
          }
          if (isModelModify) {
            setModels([
              ...models.slice(0, modelModifyIndex),
              {
                model: modelName,
                annual_income: parseFloat(modelAnnual) * 1000000,
                description: modelDesc,
              },
              ...models.slice(modelModifyIndex + 1),
            ]);
          } else {
            setModels([
              ...models,
              {
                model: modelName,
                annual_income: parseFloat(modelAnnual) * 1000000,
                description: modelDesc,
              },
            ]);
          }
          setIsAddModelsOpen(false);
          setModelName('');
          setModelAnnual('');
          setModelDesc('');
          setIsModelModify(false);
          setModelModifyIndex(-1);
          setModelNameError(false);
          setModelAnnualError(false);
          setModelDescError(false);
        }}
      >
        <div className="mt-2.5 text-gray-700 font-medium">
          Business Model
          <span className="text-red-500">*</span>
        </div>
        <Input
          value={modelName}
          onChange={(e: BaseSyntheticEvent) => {
            setModelName(e.target.value);
          }}
          onBlur={() => {
            setModelNameError(modelName === '');
          }}
          status={modelNameError ? 'error' : ''}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter business model"
        />
        {modelNameError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter model name
          </div>
        )}
        <div className="mt-2.5 text-gray-700 font-medium">
          Annual Income
          {/* <span className="text-red-500">*</span> */}
        </div>
        <Input
          prefix="$"
          suffix="million"
          type="number"
          value={modelAnnual}
          onChange={(e: BaseSyntheticEvent) => {
            setModelAnnual(e.target.value);
          }}
          onBlur={() => {
            if (modelAnnual === '') {
              // setModelAnnualError(true);
            } else {
              // setModelAnnualError(false);
              setModelAnnual(parseFloat(modelAnnual).toFixed(2));
            }
          }}
          status={modelAnnualError ? 'error' : ''}
          className="w-full mt-2"
          size="large"
          placeholder="0.00"
        />
        {/* {modelAnnualError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter annual income
          </div>
        )} */}
        <div className="mt-2.5 text-gray-700 font-medium">
          Description
          {/* <span className="text-red-500">*</span> */}
        </div>
        <TextArea
          value={modelDesc}
          onChange={(e: BaseSyntheticEvent) => {
            setModelDesc(e.target.value);
          }}
          onBlur={() => {
            // setModelDescError(modelDesc === '');
          }}
          status={modelDescError ? 'error' : ''}
          showCount
          rows={4}
          maxLength={500}
          className={`w-full mt-2 ${modelDescError ? '' : 'mb-8'}`}
          size="large"
          placeholder="Please enter description"
        />
        {/* {modelDescError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter model description
          </div>
        )} */}
      </Modal>
      <Modal
        closable={false}
        title="Add a Top Project"
        okText="Add"
        open={isAddTopProjectModalOpen}
        onOk={async () => {
          let checkField = false;
          if (ecoProjectName === '') {
            setEcoProjectNameError(true);
            checkField = true;
          }
          if (ecoWebsite === '') {
            setEcoWebsiteError(true);
            checkField = true;
          }
          if (ecoProjectDesc === '') {
            setEcoProjectDescError(true);
            checkField = true;
          }
          if (checkField) {
            return;
          }
          if (isEcoProjectModify) {
            const data: topProjectItem = {
              id: ecoProjects[ecoProjectModifyIndex].id,
              name: ecoProjectName,
              description: ecoProjectDesc,
              logo_url:
                topProjectUrl === ''
                  ? ecoProjects[ecoProjectModifyIndex].logo_url
                  : topProjectUrl,
              official_website: ecoWebsite,
            };
            const updateBriefProjectResult = await updateBriefProject(data);
            if (updateBriefProjectResult.code === 0) {
              setEcoProjects([
                ...ecoProjects.slice(0, ecoProjectModifyIndex),
                {
                  logo_url:
                    topProjectUrl === ''
                      ? ecoProjects[ecoProjectModifyIndex].logo_url
                      : topProjectUrl,
                  id: ecoProjects[ecoProjectModifyIndex].id,
                  name: ecoProjectName,
                  description: ecoProjectDesc,
                  official_website: ecoWebsite,
                },
                ...ecoProjects.slice(ecoProjectModifyIndex + 1),
              ]);
            }
          } else {
            const data = {
              basic: {
                name: ecoProjectName,
                logo_url: topProjectUrl,
                description: ecoProjectDesc,
              },
              related_links: [{ type: 'Official Website', link: ecoWebsite }],
            };
            const addBriefProjectResult = await addBriefProject(data);
            if (addBriefProjectResult.code === 0) {
              setEcoProjects([
                ...ecoProjects,
                {
                  id: addBriefProjectResult.data.id,
                  name: ecoProjectName,
                  description: ecoProjectDesc,
                  logo_url: topProjectUrl,
                  official_website: ecoWebsite,
                },
              ]);
            }
          }
          setIsAddTopProjectModalOpen(false);
          setEcoWebsite('');
          setEcoProjectName('');
          setEcoProjectDesc('');
          setEcoProjectModifyIndex(-1);
          setIsEcoProjectModify(false);
          setTopProjectUrl('');
          setInvestorFileList([]);
          setEcoProjectDescError(false);
          setEcoWebsiteError(false);
          setEcoProjectNameError(false);
        }}
        onCancel={() => {
          setIsAddTopProjectModalOpen(false);
          setEcoWebsite('');
          setEcoProjectName('');
          setEcoProjectDesc('');
          setEcoProjectModifyIndex(-1);
          setIsEcoProjectModify(false);
          setTopProjectUrl('');
          setInvestorFileList([]);
          setEcoProjectDescError(false);
          setEcoWebsiteError(false);
          setEcoProjectNameError(false);
        }}
      >
        <div className="mt-6 text-gray-700 font-medium">Logo</div>
        <AntdImgCrop onModalOk={onTopProject} cropShape="round">
          <Upload
            className="mt-2"
            maxCount={1}
            method="GET"
            fileList={investorFileList}
            onChange={onChangeInvestor}
            onPreview={handleInvestorPreview}
            listType="picture-circle"
          >
            +Upload
          </Upload>
        </AntdImgCrop>
        <div className="mt-2.5 text-gray-700 font-medium">
          Official Website<span className="text-red-500">*</span>
        </div>
        <Input
          prefix="http://"
          value={ecoWebsite}
          onChange={(e: BaseSyntheticEvent) => {
            setEcoWebsite(e.target.value);
          }}
          onBlur={() => {
            setEcoWebsiteError(ecoWebsite === '');
          }}
          status={ecoWebsiteError ? 'error' : ''}
          className="w-full mt-2"
          size="large"
        />
        {ecoWebsiteError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter official website
          </div>
        )}
        <div className="mt-2.5 text-gray-700 font-medium">
          Name<span className="text-red-500">*</span>
        </div>
        <Input
          value={ecoProjectName}
          onChange={(e: BaseSyntheticEvent) => {
            setEcoProjectName(e.target.value);
          }}
          onBlur={() => {
            setEcoProjectNameError(ecoProjectName === '');
          }}
          status={ecoProjectNameError ? 'error' : ''}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter name"
        />
        {ecoProjectNameError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter project name
          </div>
        )}
        <div className="mt-2.5 text-gray-700 font-medium">
          Description<span className="text-red-500">*</span>
        </div>
        <TextArea
          value={ecoProjectDesc}
          onChange={(e: BaseSyntheticEvent) => {
            setEcoProjectDesc(e.target.value);
          }}
          onBlur={() => {
            setEcoProjectDescError(ecoProjectDesc === '');
          }}
          status={ecoProjectDescError ? 'error' : ''}
          showCount
          rows={4}
          maxLength={500}
          className={`w-full mt-2 ${ecoProjectDescError ? '' : 'mb-8'}`}
          size="large"
          placeholder="Please enter name"
        />
        {ecoProjectDescError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter project description
          </div>
        )}
      </Modal>
      <Modal
        closable={false}
        title="Add Round Info"
        okText={isRoundModify ? 'Edit' : 'Add'}
        open={isRoundModalOpen}
        onCancel={() => {
          setIsRoundModalOpen(false);
          setRound(null);
          setRoundDate('');
          setRoundAmount(null);
          setRoundValuation(null);
          setRoundInevstors('');
          setLeadInvestors('');
          setIsRoundModify(false);
          setRoundModifyIndex(-1);
          setRoundDateValue(undefined);
        }}
        onOk={() => {
          let roundName = round ?? '';
          if (roundName === 'Others') {
            roundName = otherRound;
          }
          if (isRoundModify) {
            setRounds([
              ...rounds.slice(0, roundModifyIndex),
              {
                round: roundName,
                date: roundDate,
                amount: roundAmount ? roundAmount * 1000000 : 0,
                valuation: roundValuation ? roundValuation * 1000000 : 0,
                investors: roundInvestors,
                lead_investors: leadInvestors,
              },
              ...rounds.slice(roundModifyIndex + 1),
            ]);
          } else {
            setRounds([
              ...rounds,
              {
                round: roundName,
                date: roundDate,
                amount: roundAmount ? roundAmount * 1000000 : 0,
                valuation: roundValuation ? roundValuation * 1000000 : 0,
                investors: roundInvestors,
                lead_investors: leadInvestors,
              },
            ]);
          }
          setIsRoundModalOpen(false);
          setRoundDateValue(undefined);
          setRound(null);
          setRoundDate('');
          setRoundAmount(null);
          setRoundValuation(null);
          setRoundInevstors('');
          setLeadInvestors('');
          setIsRoundModify(false);
          setRoundModifyIndex(-1);
        }}
      >
        <div className="mt-2.5 text-gray-700 font-medium">Round</div>
        <Select
          value={round}
          onChange={(value: string) => {
            console.log(value);
            setRound(value);
          }}
          className="mt-2 w-full"
          size="large"
          placeholder="Please choose round"
          options={[
            { value: 'Others' },
            { value: 'IEO/ICO' },
            { value: 'A' },
            { value: 'B' },
            { value: 'C' },
            { value: 'D' },
            { value: 'E' },
          ]}
        />
        {round === 'Others' && (
          <Input
            value={otherRound}
            onChange={(e: BaseSyntheticEvent) => {
              setOtherRound(e.target.value);
            }}
            className="w-full mt-2"
            size="large"
            placeholder="Please enter investors"
          />
        )}
        <div className="mt-2.5 text-gray-700 font-medium">Date</div>
        <DatePicker
          className="w-full h-12 mt-2"
          value={roundDateValue}
          onChange={(day, date: string) => {
            setRoundDateValue(day);
            setRoundDate(date);
          }}
          renderExtraFooter={() => (
            <div className="flex">
              <div
                onClick={() => {
                  setRoundDateMode('date');
                }}
                className={`ml-auto border my-2 text-sm px-2 rounded-l pt-0 hover:cursor-pointer ${
                  roundDateMode === 'date' ? 'bg-purple-700 text-white' : ''
                }`}
              >
                Day
              </div>
              <div
                onClick={() => {
                  setRoundDateMode('month');
                }}
                className={`my-2 text-sm px-2 pt-0 hover:cursor-pointer ${
                  roundDateMode === 'month' ? 'bg-purple-700 text-white' : ''
                }`}
              >
                Month
              </div>
              <div
                onClick={() => {
                  setRoundDateMode('year');
                }}
                className={`mr-auto border my-2 text-sm px-2 rounded-r pt-0 hover:cursor-pointer ${
                  roundDateMode === 'year' ? 'bg-purple-700 text-white' : ''
                }`}
              >
                Year
              </div>
            </div>
          )}
          showToday={false}
          picker={roundDateMode}
        />
        <div className="mt-2.5 text-gray-700 font-medium">Amount</div>
        <Input
          value={roundAmount === 0 ? undefined : roundAmount ?? undefined}
          onChange={(e: BaseSyntheticEvent) => {
            setRoundAmount(parseFloat(parseFloat(e.target.value).toFixed(1)));
          }}
          prefix="$"
          suffix="million"
          type="number"
          className="w-full mt-2"
          size="large"
          placeholder="Please enter amount"
        />
        <div className="mt-2.5 text-gray-700 font-medium">Valuation</div>
        <Input
          value={roundValuation === 0 ? undefined : roundValuation ?? undefined}
          onChange={(e: BaseSyntheticEvent) => {
            setRoundValuation(
              parseFloat(parseFloat(e.target.value).toFixed(1)),
            );
          }}
          prefix="$"
          suffix="million"
          type="number"
          className="w-full mt-2"
          size="large"
          placeholder="Please enter amount"
        />
        <div className="mt-2.5 text-gray-700 font-medium">Investors</div>
        <Input
          value={roundInvestors}
          onChange={(e: BaseSyntheticEvent) => {
            setRoundInevstors(e.target.value);
          }}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter investors"
        />
        <div className="mt-2.5 text-gray-700 font-medium">Lead Investor</div>
        <Input
          value={leadInvestors}
          onChange={(e: BaseSyntheticEvent) => {
            setLeadInvestors(e.target.value);
          }}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter lead investor"
        />
      </Modal>
      <Modal
        closable={false}
        title="Add a Investor"
        okText={isInvestorModify ? 'Edit' : 'Add'}
        open={isInvestorModalOpen}
        onOk={async () => {
          if (investorName === '') {
            setInvestorNameError(true);
            return;
          }
          if (isInvestorModify) {
            const updateInvestorResult = await updateInvestor({
              id: investors[investorModifyIndex].id,
              name: investorName,
              description: '',
              avatar_url: investorUploadUrl,
              subject: investorSubject,
              type: investorType || 2,
              social_media_links: [],
            });
            if (updateInvestorResult.code === 0) {
              setInvestors([
                ...investors.slice(0, investorModifyIndex),
                {
                  id: investors[investorModifyIndex].id,
                  name: investorName,
                  avatar_url:
                    investorUploadUrl === ''
                      ? constants.DEFAULT_PROJECT_LOGO_URL
                      : investorUploadUrl,
                  subject: investorSubject,
                  type: investorType || 2,
                  description: '',
                  social_media_links: [],
                },
                ...investors.slice(investorModifyIndex + 1),
              ]);
            }
          } else {
            const addInvestorResult = await addNewInvestor({
              name: investorName,
              description: '',
              avatar_url: investorUploadUrl,
              subject: investorSubject,
              type: investorType || 2,
              social_media_links: [],
            });
            if (addInvestorResult.code === 0) {
              setInvestors([
                ...investors,
                {
                  id: addInvestorResult.data.id,
                  name: investorName,
                  avatar_url:
                    investorUploadUrl === ''
                      ? constants.DEFAULT_PROJECT_LOGO_URL
                      : investorUploadUrl,
                  subject: investorSubject,
                  type: investorType || 2,
                  description: '',
                  social_media_links: [],
                },
              ]);
            }
          }
          getInvestors();
          setIsInvestorModalOpen(false);
          setInvestorName('');
          setInvestorSubject(2);
          setInvestorType(undefined);
          setIsInvestorModify(false);
          setInvestorFileList([]);
          setInvestorModifyIndex(-1);
          setInvestorUploadUrl('');
          setInvestorNameError(false);
        }}
        onCancel={() => {
          setIsInvestorModalOpen(false);
          setInvestorName('');
          setInvestorSubject(2);
          setInvestorType(undefined);
          setInvestorFileList([]);
          setIsInvestorModify(false);
          setInvestorModifyIndex(-1);
          setInvestorUploadUrl('');
          setInvestorNameError(false);
        }}
      >
        <div className="mt-6 text-gray-700 font-medium">Avatar</div>
        <div className="flex">
          <Image
            preview={false}
            src={investorUploadUrl}
            width={102}
            className="rounded-full mt-4 mr-4"
          />
          <AntdImgCrop onModalOk={onInvestorAvatar} cropShape="round">
            <Upload
              className="mt-2 ml-2.5"
              maxCount={1}
              method="GET"
              onChange={onChangeInvestor}
              onPreview={handleInvestorPreview}
              listType="picture-circle"
              fileList={investorFileList}
            >
              +Upload
            </Upload>
          </AntdImgCrop>
        </div>
        <div className="mt-2.5 text-gray-700 font-medium">
          Investor Name<span className="text-red-500">*</span>
        </div>
        <Input
          value={investorName}
          onChange={(e: BaseSyntheticEvent) => {
            setInvestorName(e.target.value);
          }}
          onBlur={() => {
            setInvestorNameError(investorName === '');
          }}
          status={investorNameError ? 'error' : ''}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter investor name"
        />
        {investorNameError && (
          <div className="text-red-500 font-normal text-sm ml-2 my-1">
            Please enter investor name
          </div>
        )}
        <div className="mt-2.5 text-gray-700 font-medium">Subject</div>
        <Radio.Group
          onChange={onChangeSubject}
          value={investorSubject}
          className="mt-2"
        >
          <Space direction="vertical">
            <Radio value={0}>institution</Radio>
            <Radio value={1}>individual</Radio>
          </Space>
        </Radio.Group>
        <div className="mt-2.5 text-gray-700 font-medium">Type</div>
        <Select
          value={investorType}
          onChange={(value: number) => {
            setInvestorType(value);
          }}
          defaultValue={2}
          className="mt-2 w-full"
          size="large"
          placeholder="Please choose type"
          options={[
            { value: 0, label: 'Top Investor' },
            { value: 1, label: 'KOL' },
          ]}
        />
      </Modal>
      <Modal
        closable={false}
        title="Add Team Member"
        okText="Add"
        open={isMemberModalOpen}
        onCancel={() => {
          setIsMemberModalOpen(false);
          setTeamFileList([]);
          setTempPreview('');
          setMemberName('');
          setMemberTitle('');
          setIsDeparted(1);
          setMemberDescription('');
          setIsTwitter(false);
          setIsLinkedIn(false);
          setTwitterLink('');
          setLinkedinLink('');
          setIsTeamModify(false);
          setTeamModifyIndex(-1);
          setTeamUploadUrl('');
        }}
        onOk={() => {
          if (isTeamModify) {
            setTeamMembers([
              ...teamMembers.slice(0, teamModifyIndex),
              {
                avatar:
                  teamUploadUrl === ''
                    ? constants.DEFAULT_AVATAR_URL
                    : teamUploadUrl,
                name: memberName,
                title: memberTitle,
                isDeparted,
                desc: memberDescription,
                isTwitter,
                isLinkedIn,
                twitterLink,
                linkedinLink,
              },
              ...teamMembers.slice(teamModifyIndex + 1),
            ]);
          } else {
            setTeamMembers([
              ...teamMembers,
              {
                avatar:
                  teamUploadUrl === ''
                    ? constants.DEFAULT_AVATAR_URL
                    : teamUploadUrl,
                name: memberName,
                title: memberTitle,
                isDeparted,
                desc: memberDescription,
                isTwitter,
                isLinkedIn,
                twitterLink,
                linkedinLink,
              },
            ]);
          }
          setTeamFileList([]);
          setTempPreview('');
          setMemberName('');
          setMemberTitle('');
          setIsDeparted(1);
          setMemberDescription('');
          setIsTwitter(false);
          setIsLinkedIn(false);
          setTwitterLink('');
          setLinkedinLink('');
          setIsMemberModalOpen(false);
          setIsTeamModify(false);
          setTeamModifyIndex(-1);
          setTeamUploadUrl('');
        }}
      >
        <div className="mt-6 text-gray-700 font-medium">Avatar</div>
        <div className="flex">
          <Image
            preview={false}
            src={teamUploadUrl}
            width={102}
            className="rounded-full mt-4 mr-4"
          />
          <AntdImgCrop onModalOk={onTeamAvatar} cropShape="round">
            <Upload
              className="mt-2 ml-2.5"
              maxCount={1}
              method="GET"
              fileList={teamFileList}
              onChange={onChangeTeamMember}
              onPreview={handleTeamMemberPreview}
              listType="picture-circle"
            >
              +Upload
            </Upload>
          </AntdImgCrop>
        </div>
        <div className="mt-2.5 text-gray-700 font-medium">
          Member Name<span className="text-red-500">*</span>
        </div>
        <Input
          value={memberName}
          onChange={(e: BaseSyntheticEvent) => {
            setMemberName(e.target.value);
          }}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter member name"
        />
        <div className="mt-2.5 text-gray-700 font-medium">Title</div>
        <Input
          value={memberTitle}
          onChange={(e: BaseSyntheticEvent) => {
            setMemberTitle(e.target.value);
          }}
          className="w-full mt-2"
          size="large"
          placeholder="Please enter title"
        />
        <div className="mt-2.5 text-gray-700 font-medium">Departed</div>
        <Radio.Group
          onChange={onChangeDepart}
          value={isDeparted}
          className="mt-2"
        >
          <Space direction="vertical">
            <Radio value={1}>Yes</Radio>
            <Radio value={2}>No</Radio>
          </Space>
        </Radio.Group>
        <div className="mt-2.5 text-gray-700 font-medium">
          Description<span className="text-red-500">*</span>
        </div>
        <TextArea
          value={memberDescription}
          onChange={(e: BaseSyntheticEvent) => {
            setMemberDescription(e.target.value);
          }}
          className="text-sm mt-2 hover:border-purple-200 focus:border-purple-200"
          showCount
          rows={4}
          maxLength={500}
          placeholder="Please enter description"
        />
        <div className="mt-4 text-gray-700 font-medium">Social Media</div>
        <div className="flex mt-2">
          <div
            onClick={() => {
              setIsTwitter(!isTwitter);
            }}
            className={isTwitter ? selectTrackClass : unSelectTrackClass}
          >
            Twitter
          </div>
          <div
            onClick={() => {
              setIsLinkedIn(!isLinkedIn);
            }}
            className={isLinkedIn ? selectTrackClass : unSelectTrackClass}
          >
            Linkedin
          </div>
        </div>
        {isTwitter && (
          <>
            <div className="mt-4 text-gray-700 font-medium">Twitter link</div>
            <Input
              value={twitterLink}
              onChange={(e: BaseSyntheticEvent) => {
                setTwitterLink(e.target.value);
              }}
              className="w-full mt-2"
              size="large"
              placeholder="Please enter Twitter link"
            />
          </>
        )}
        {isLinkedIn && (
          <>
            <div className="mt-4 text-gray-700 font-medium">LinkedIn link</div>
            <Input
              value={linkedinLink}
              onChange={(e: BaseSyntheticEvent) => {
                setLinkedinLink(e.target.value);
              }}
              className="w-full mt-2"
              size="large"
              placeholder="Please enter Linkedin link"
            />
          </>
        )}
      </Modal>
      <Modal
        open={isLeaveModalOpen}
        closable={false}
        okText="Leave"
        onOk={() => {
          history.push('project_manager');
        }}
        onCancel={() => {
          setIsLeaveModalOpen(false);
        }}
      >
        <div className="flex">
          <Warning />
          <div className="ml-4">
            <div className="text-gray-900 font-medium text-lg">
              Confirm leave page
            </div>
            <div className="mt-2 text-gray-500 font-normal text-sm">
              All changes are not saved
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isDeleteModalOpen}
        closable={false}
        okText="Delete"
        onOk={() => {
          setInvestors([
            ...investors.slice(0, investorDeleteIndex),
            ...investors.slice(investorDeleteIndex + 1),
          ]);
          setInvestorDeleteIndex(-1);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setInvestorDeleteIndex(-1);
        }}
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ danger: true }}
      >
        <div className="flex">
          <Warning />
          <div className="ml-4">
            <div className="text-gray-900 font-medium text-lg">
              Confirm delete member
            </div>
            <div className="mt-2 text-gray-500 font-normal text-sm">
              this action could not be canceled
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isTeamDeleteModalOpen}
        closable={false}
        okText="Delete"
        onOk={() => {
          setTeamMembers([
            ...teamMembers.slice(0, teamDeleteIndex),
            ...teamMembers.slice(teamDeleteIndex + 1),
          ]);
          setTeamDeleteIndex(-1);
          setIsRoundDeleteModalOpen(false);
        }}
        onCancel={() => {
          setTeamDeleteIndex(-1);
          setIsRoundDeleteModalOpen(false);
        }}
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ danger: true }}
      >
        <div className="flex">
          <Warning />
          <div className="ml-4">
            <div className="text-gray-900 font-medium text-lg">
              Confirm delete member
            </div>
            <div className="mt-2 text-gray-500 font-normal text-sm">
              this action could not be canceled
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isRoundDeleteModalOpen}
        closable={false}
        okText="Delete"
        onOk={() => {
          setRounds([
            ...rounds.slice(0, roundDeleteIndex),
            ...rounds.slice(roundDeleteIndex + 1),
          ]);
          setRoundDeleteIndex(-1);
          setIsRoundDeleteModalOpen(false);
        }}
        onCancel={() => {
          setRoundDeleteIndex(-1);
          setIsRoundDeleteModalOpen(false);
        }}
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ danger: true }}
      >
        <div className="flex">
          <Warning />
          <div className="ml-4">
            <div className="text-gray-900 font-medium text-lg">
              Confirm delete round
            </div>
            <div className="mt-2 text-gray-500 font-normal text-sm">
              this action could not be canceled
            </div>
          </div>
        </div>
      </Modal>
      {contextHolder}
    </>
  );
};

export default EditProject;
