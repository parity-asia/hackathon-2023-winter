import { Button, Tabs } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericEdit, GenericIdea } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import IdeaCard from '../../../../components/components/IdeaCard';
import Loader from '../../../../components/components/Loader';
import useContract from '../../../../services/useContract';
import CreateIdeaModal from '../../../../features/CreateIdeaModal';
import EmptyState from '../../../../components/components/EmptyState';
import DonateCoinModal from '../../../../features/DonateCoinModal';
import { usePolkadotContext } from '../../../../contexts/PolkadotContext';
import Image from 'next/legacy/image';

export default function Goal() {
  //Variables
  const [list, setList] = useState([]);
  const { api, showToast, getUserInfoById, GetAllDaos, PolkadotLoggedIn } = usePolkadotContext();
  const [GoalURI, setGoalURI] = useState({
    goalId: '',
    Title: '',
    Description: '',
    Budget: '',
    End_Date: '',
    StructureLeft: [],
    StructureRight: [],
    wallet: '',
    logo: '',
    isOwner: true
  });
  const [goalId, setGoalID] = useState(-1);
  const { contract, signerAddress } = useContract();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  const [showCreateIdeaModal, setShowCreateIdeaModal] = useState(false);
  const [DonatemodalShow, setDonatemodalShow] = useState(false);
  const [selectedIdeasId, setSelectedIdeasId] = useState(-1);
  const [selectedIdeasWallet, setSelectedIdeasWallet] = useState('');

  const regex = /\[(.*)\]/g;
  let m;
  let id = ''; //id from url

  useEffect(() => {
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }

    fetchContractData();
  }, [contract, api]);

  async function fetchContractData() {
    setLoading(true);

    try {
      if (contract && id && api) {
        setGoalID(Number(id));

        const goalURIFull = await contract._goal_uris(Number(id)); //Getting total goal (Number)
        const goalURI = JSON.parse(goalURIFull.goal_uri);
        let allDaos = await GetAllDaos();
        let goalDAO = allDaos.filter((e) => (e.daoId = goalURIFull.dao_id))[0];

        let user_info = await getUserInfoById(Number(goalURI.properties?.user_id?.description));
        let isJoined = await contract.is_person_joined(Number( goalDAO.id),Number(window.userid));
        setIsJoined(isJoined);

        const totalIdeasWithEmpty = await contract.get_all_ideas_by_goal_id(Number(id)); //Getting total goal (Number)
        let totalIdeas = totalIdeasWithEmpty.filter((e) => e !== '');
        const arr = [];
        let total_donated = 0;
        for (let i = 0; i < Object.keys(totalIdeas).length; i++) {
          //total goal number Iteration
          const ideasId = await contract.get_ideas_id_by_ideas_uri(totalIdeas[i]);
          const AllvotesWithEmpty = await contract.get_ideas_votes_from_goal(Number(id), Number(id)); //Getting all votes
          const Allvotes = AllvotesWithEmpty.filter((item, idx) => item !== '');
          let isvoted = false;
          for (let i = 0; i < Allvotes.length; i++) {
            const element = Number(Allvotes[i]);
            if (element == Number(window.userid)) isvoted = true;
          }
          if (totalIdeas[i] == '') continue;
          const object = JSON.parse(totalIdeas[i]);
          if (object) {
            let donation = Number((await contract._ideas_uris(Number(ideasId))).donation) / 1e18;
            total_donated += donation;
            arr.push({
              //Pushing all data into array
              ideasId: Number(ideasId),
              Title: object.properties.Title.description,
              Description: object.properties.Description.description,
              wallet: object.properties.wallet.description,
              donation: donation,
              votes: Object.keys(Allvotes).length,
              logo: object.properties.logo.description?.url,
              allfiles: object.properties.allfiles,
              isOwner: object.properties.user_id.description == Number(window.userid) ? true : false,
              isVoted: isvoted
            });
          }
        }
        setList(arr);
        setGoalURI({
          goalId: Number(id),
          Title: goalURI.properties.Title.description,
          Description: goalURI.properties.Description.description,
          Budget: goalURI.properties.Budget.description,
          End_Date: goalURI.properties.End_Date?.description,
          wallet: goalURI.properties.wallet.description,
          logo: goalURI.properties.logo.description?.url,
          total_donated: total_donated,
          Dao: goalDAO,
          user_info: user_info,
          isOwner: goalURI.properties.user_id.description == Number(window.userid) ? true : false
        });

        setLoading(false);

        /** TODO: Fix fetch to get completed ones as well */
        if (document.getElementById('Loading')) document.getElementById('Loading').style = 'display:none';
      }
    } catch (error) {
      setLoading(false);
      console.error('Could not load contract');
    }
  }
  async function DonateToIdeas(ideasId, wallet) {
    setDonatemodalShow(true);
    setSelectedIdeasId(ideasId);
    setSelectedIdeasWallet(wallet);
  }

  function closeCreateIdeaModal(event) {
    if (event) {
      setShowCreateIdeaModal(false);
    }
  }
  function openCreateIdeaModal() {
    setShowCreateIdeaModal(true);
  }

  async function VoteIdea(ideas_id, index) {
    try {
      await sendTransaction(await window.contract.populateTransaction.create_goal_ideas_vote(Number(goalId), Number(ideas_id), Number(window.userid)));
    } catch (error) {
      console.error(error);
      return;
    }
    let idealist = list;
    idealist[index].isVoted = !idealist[index].isVoted;
    idealist[index].votes += 1;
    setList(idealist.reverse());
  }

  return (
    <>
      <Head>
        <title>Goal</title>
        <meta name="description" content="Goal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center flex-col gap-8">
        <div className="gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border">
          <div className="container flex w-full justify-between">
            <div className="flex flex-col gap-1 overflow-hidden">
              <Loader loading={loading} width={300} element={<h5 className="font-semibold">{GoalURI?.Dao?.Title} &gt; Goals</h5>} />
              <Loader loading={loading} width={300} element={<h1 className="text-moon-32 font-bold">{GoalURI.Title}</h1>} />
              <Loader
                loading={loading}
                width={770}
                element={
                  <h3 className="flex gap-2 whitespace-nowrap">
                    <div>
                      <span className="text-hit font-semibold">DEV {GoalURI.total_donated}</span> of DEV {GoalURI.Budget}
                    </div>
                    <div>•</div>
                    <div>{list.length} ideas</div>
                    <div>•</div>
                    <div className="flex">
                      Created by &nbsp;
                      <a href={'/Profile/' + GoalURI?.user_info?.id} className="truncate text-piccolo max-w-[120px]">
                        @{GoalURI?.user_info?.fullName.toString()}
                      </a>
                    </div>
                  </h3>
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              {(GoalURI.isOwner || isJoined) ? (
                <>
                  {' '}
                  <Button iconLeft={<ControlsPlus />} onClick={openCreateIdeaModal}>
                    Create idea
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="container">
            <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
              <Tabs.List>
                <Tabs.Tab>Description</Tabs.Tab>
                <Tabs.Tab>Ideas ({list.length})</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </div>
        {tabIndex === 0 && (
          <div className="container flex flex-col gap-6">
            <p>{GoalURI.Description}</p>
            {GoalURI.logo && (
              <div className="relative w-auto max-[w-720px] h-[480px] object-contain">
                <Image src={GoalURI.logo} alt="" objectFit="cover" layout="fill" className="object-contain" />
              </div>
            )}
          </div>
        )}
        {tabIndex === 1 && (
          <div className="flex flex-col gap-8 container items-center">
            <Loader
              element={
                list.length > 0 ? (
                  list.map((listItem, index) => (
                    <IdeaCard
                      onClickVote={() => {
                        VoteIdea(listItem.ideasId, index);
                      }}
                      onClickDonate={() => {
                        DonateToIdeas(listItem.ideasId, listItem.wallet);
                      }}
                      item={listItem}
                      key={index}
                    />
                  ))
                ) : (
                  <EmptyState icon={<GenericIdea className="text-moon-48" />} label="This goal doesn’t have any ideas yet." />
                )
              }
              width={768}
              height={236}
              many={3}
              loading={loading}
            />{' '}
          </div>
        )}
      </div>
      <CreateIdeaModal show={showCreateIdeaModal} onClose={closeCreateIdeaModal} />
      <DonateCoinModal
        ideasid={selectedIdeasId}
        show={DonatemodalShow}
        onHide={() => {
          setDonatemodalShow(false);
        }}
        address={selectedIdeasWallet}
      />
    </>
  );
}
