import { Button, Tabs } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericDelete, GenericEdit, GenericLogOut, GenericPlus, SportDarts } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import useContract from '../../../services/useContract';
import GoalCard from '../../../components/components/GoalCard';
import Loader from '../../../components/components/Loader';
import Link from 'next/link';
import CreateGoalModal from '../../../features/CreateGoalModal';
import CommunityFeed from '../../../features/CommunityFeed';
import TopCommunityMembers from '../../../features/TopCommunityMembers';
import JoinCommunityModal from '../../../features/JoinCommunityModal';
import { usePolkadotContext } from '../../../contexts/PolkadotContext';
import EmptyState from '../../../components/components/EmptyState';

export default function DAO() {
  //Variables
  const [list, setList] = useState([]);
  const { api, showToast, getUserInfoById, PolkadotLoggedIn } = usePolkadotContext();
  const [DaoURI, setDaoURI] = useState({ Title: '', Description: '', SubsPrice: 0, Start_Date: '', End_Date: '', logo: '', wallet: '', typeimg: '', allFiles: [], isOwner: false });
  const [daoIdTxt, setDaoTxtID] = useState('');
  const [daoId, setDaoID] = useState(-1);
  const { contract, signerAddress } = useContract();
  const [JoinmodalShow, setJoinmodalShow] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [JoinedID, setJoinedID] = useState(9999);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aboutTemplate, setAboutTemplate] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [dao_type, setDaoType] = useState('metamask');

  const regex = /\[(.*)\]/g;
  let m;

  useEffect(() => {
    getDaoID();
    fetchData();
  }, [contract, api]);

  async function fetchData() {
    fetchDaoData();
    fetchContractDataFull();
  }

  async function JoinCommunity() {
    setJoinmodalShow(true);
  }

  function getDaoID() {
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let dao_type = m[1].startsWith('m_') ? 'metamask' : 'polkadot';
      setDaoType(dao_type);
      let splitter = dao_type == 'metamask' ? 'm_' : 'p_';
      setDaoID(Number(m[1].split(splitter)[1]));
      setDaoTxtID(m[1]);
    }
  }

 async function leaveCommunity() {
    setLeaving(true)
    try {
      // Leaving Community in Smart contract
      await sendTransaction(await window.contract.populateTransaction.leave_community( Number(JoinedID)));
      toast.update(ToastId, {
        render: 'Successful!',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });
      window.setTimeout(()=>{window.location.reload()},1000)
    } catch (error) {  
    }
    setLeaving(false)

  
  }

  async function UpdateDaoData(dao_uri, template_html) {
    const daoURI = JSON.parse(dao_uri); //Getting dao URI

    setIsOwner(daoURI.properties?.user_id?.description.toString() === window?.userid?.toString() ? true : false);
    let user_info = await getUserInfoById(daoURI.properties?.user_id?.description);
    let isJoined = await contract.is_person_joined(daoId,Number(window.userid));
    setJoinedID(await contract.get_person_joinedID(daoId,Number(window.userid)));
    setIsJoined(isJoined);

    let daoURIShort = {
      Title: daoURI.properties.Title.description,
      Description: daoURI.properties.Description.description,
      Start_Date: daoURI.properties.Start_Date.description,
      logo: daoURI.properties.logo.description,
      user_info: user_info,
      wallet: daoURI.properties.wallet.description,
      typeimg: daoURI.properties.typeimg.description,
      allFiles: daoURI.properties.allFiles.description,
      SubsPrice: daoURI.properties?.SubsPrice?.description,
      isOwner
    };

    setDaoURI(daoURIShort);
    setAboutTemplate(template_html);
  }

  async function fetchDaoData() {
    setLoading(true);


    if (daoId !== undefined && daoId !== null && api && daoId != -1) {
      //Fetching data from Parachain
      if (api && dao_type == 'polkadot') {
        try {
          const element = await api._query.daos.daoById(Number(daoId));
          let daoURI = element['__internal__raw'].daoUri.toString();
          let template_html = (await api._query.daos.templateById(daoId)).toString();
          UpdateDaoData(daoURI, template_html);
        } catch (e) {}
      }
      if (contract && dao_type == 'metamask') {
        //Load everything-----------
        const daoURI = await contract.dao_uri(Number(daoId)); //Getting dao URI
        const template_html = await contract._template_uris(daoId);

        UpdateDaoData(daoURI, template_html);
      }
    }

    setLoading(false);
  }

  async function fetchContractDataFull() {
    setLoading(true);
    //Fetching data from Moonbeam
    try {
      if (contract && daoId !== undefined && daoId !== null) {
        //Load everything-----------

        const totalGoals = await contract.get_all_goals_by_dao_id(daoIdTxt); //Getting all goals by dao id
        const arr = [];
        for (let i = 0; i < Object.keys(totalGoals).length; i++) {
          //total dao number Iteration
          const goalid = Number(await contract.get_goal_id_by_goal_uri(totalGoals[i]));
          let goal = totalGoals[i].toString();
          if (goal == '') continue;
          const object = JSON.parse(goal);

          if (object) {
            const totalIdeasWithEmpty = await contract.get_all_ideas_by_goal_id(Number(goalid)); //Getting total goal (Number)

            let total_reached = 0;
            let totalIdeas = totalIdeasWithEmpty.filter((e) => e !== '');
            for (let i = 0; i < totalIdeas.length; i++) {
              const element = totalIdeas[i];

              const ideasId = await contract.get_ideas_id_by_ideas_uri(element);
              let donation = Number((await contract._ideas_uris(Number(ideasId))).donation) / 1e18;
              total_reached += donation;
           
            }

            arr.push({
              //Pushing all data into array
              goalId: goalid,
              Title: object.properties.Title.description,
              Description: object.properties.Description.description,
              Budget: object.properties.Budget.description,
              reached: total_reached,
              End_Date: object.properties.End_Date.description,
              logo: object.properties.logo.description?.url,
              ideasCount: Object.keys(totalIdeas).filter((item, idx) => item !== '').length
            });
          }
        }

        setLoading(false);
        setList(arr.reverse());
      }
    } catch (error) {}
    setLoading(false);
  }

  function closeCreateGoalModal(event) {
    if (event) {
      setShowCreateGoalModal(false);
    }
  }
  function openCreateGoalModal() {
    setShowCreateGoalModal(true);
  }

  return (
    <>
      <Head>
        <title>DAO</title>
        <meta name="description" content="DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`flex items-center flex-col gap-8`}>
        <div className={`gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border`}>
          <div className="container flex w-full justify-between relative">
            <div className="flex flex-col gap-1">
              <h5 className="font-semibold">Community</h5>
              <h1 className="text-moon-32 font-bold">{DaoURI.Title}</h1>
              <h3 className="flex gap-2 whitespace-nowrap">
                <div className="flex">
                  Managed by &nbsp;
                  <a href={'/Profile/' + DaoURI?.user_info?.id} className="truncate text-piccolo max-w-[120px]">
                    @{DaoURI?.user_info?.fullName.toString()}
                  </a>
                </div>
                <div>•</div>
                <div>
                  <span className="text-hit font-semibold">${DaoURI.SubsPrice}</span> p/month
                </div>
              </h3>
            </div>
            <div className="flex flex-col gap-2 absolute top-0 right-0">
              {(isOwner || isJoined) && (
                <Button iconLeft={<GenericPlus />} onClick={openCreateGoalModal}>
                  Create goal
                </Button>
              )}

              {(isJoined  && !isOwner) && (
                <Button onClick={leaveCommunity} iconLeft={<GenericLogOut />} variant="secondary">
                  Leave
                </Button>
              )}
              {isOwner && (
                <Link href={`/DesignDao?[${daoIdTxt}]`}>
                  <Button iconLeft={<GenericEdit />} variant="secondary" className="w-full">
                    Edit
                  </Button>
                </Link>
              )}
              {/* {isOwner && (
                <Button iconLeft={<GenericDelete />} className="bg-dodoria" onClick={deleteDao}>
                  Delete
                </Button>
              )} */}
              {!isJoined && !isOwner && (
                <Button iconLeft={<ControlsPlus />} onClick={JoinCommunity}>
                  Join
                </Button>
              )}

            </div>
          </div>
          <div className="container">
            <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
              <Tabs.List>
                <Tabs.Tab>Feed</Tabs.Tab>
                <Tabs.Tab>About</Tabs.Tab>
                <Tabs.Tab>Goals ({list.length})</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </div>
        {tabIndex === 0 && (
          <div className="container flex gap-6">
            <CommunityFeed /> <TopCommunityMembers daoid={daoIdTxt} />
          </div>
        )}
        {tabIndex === 1 && <div className="container" dangerouslySetInnerHTML={{ __html: aboutTemplate }}></div>}
        {tabIndex === 2 && (
          <div className="flex flex-col gap-8 container items-center pb-10">
            <Loader element={list.length > 0 ? list.map((listItem, index) => <GoalCard item={listItem} key={index} />) : <EmptyState icon={<SportDarts className="text-moon-48" />} label="This community doesn’t have any goals yet." />} width={768} height={236} many={3} loading={loading} />{' '}
          </div>
        )}
      </div>

      <CreateGoalModal open={showCreateGoalModal} onClose={closeCreateGoalModal} />

      <JoinCommunityModal
        SubsPrice={DaoURI.SubsPrice}
        show={JoinmodalShow}
        onHide={() => {
          setJoinmodalShow(false);
        }}
        address={DaoURI.wallet}
        title={DaoURI.Title}
        dao_id={daoId}
      />
    </>
  );
}
