import React, { useEffect, useState } from 'react';

import { formatDistance } from 'date-fns';
import Head from 'next/head';
import useContract from '../../services/useContract';
import { Avatar, Button, Tabs } from '@heathmont/moon-core-tw';
import { ChatChat, ChatComment, ChatCommentText, GenericHeart, GenericIdea, GenericUser, GenericUsers, ShopWallet, SoftwareLogOut, SportDarts } from '@heathmont/moon-icons-tw';
import Loader from '../../components/components/Loader';
import Link from 'next/link';
import Card from '../../components/components/Card';
import Badge from '../../components/components/Badge';

import { usePolkadotContext } from '../../contexts/PolkadotContext';

export default function Profile() {
  //Variables
  const { contract, signerAddress } = useContract();

  const { api, getUserInfoById, GetAllDaos, PolkadotLoggedIn } = usePolkadotContext();
  const [Donated, setDonated] = useState([]);
  const [UserBadges, setUserBadges] = useState({
    dao: false,
    joined: false,
    goal: false,
    ideas: false,
    vote: false,
    donation: false,
    comment: false,
    reply: false
  });

  const [TotalRead, setTotalRead] = useState(0);
  const [Replied, setReplied] = useState(0);
  const [UserInfo, setUserInfo] = useState({});
  const [Daos, setDaos] = useState([]);
  const [Ideas, setIdeas] = useState([]);
  const [DontatedIdeas, setDontatedIdeas] = useState([]);
  const [RepliesIdeas, setRepliesIdeas] = useState([]);
  const [AllMessages, setAllMessages] = useState([]);
  const [userid, setUserid] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(false);

  useEffect(() => {
    fetchContractData();
  }, [contract, api]);

  async function fetchContractData() {
    setLoading(true);
    let user_id = Number(window.location.pathname.replace('/Profile/', ''));
    setUserid(user_id);
    if (!contract || !api) return false;
    if (user_id == window.userid) setLoggedUser(true);
    let user_info = await getUserInfoById(user_id);
    setUserInfo(user_info);
    //Fetching data from Smart contract
    let allDaos = await GetAllDaos();
    let allIdeas = await contract.get_all_ideas();
    let donated = Number(await contract._donated(Number(user_id))) / 1e18;
    let allBadges = { ...(await contract._user_badges(user_id)) };

    let total_read = 0;
    let _message_read_ids = await contract._message_read_ids();
    for (let i = 0; i < _message_read_ids; i++) {
      let ReadURI = await contract.all_read_messages(i);
      if (ReadURI.wallet == user_id) {
        total_read += 1;
      }
    }

    allBadges['dao'] = allDaos.filter((e) => e.user_id == user_id).length > 0 ? true : false;

    let founddao = [];
    for (let i = 0; i < allDaos.length; i++) {
      let dao_info = allDaos[i];
      if (dao_info.user_id == user_id) {
        dao_info.id = i;
        let goal = await contract.get_all_goals_by_dao_id(i);
        dao_info.goals = goal.filter((e) => {
          return e !== '';
        });

        founddao.push(dao_info);
      }
    }
    founddao.sort(function (a, b) {
      return b.goals.length - a.goals.length;
    });
    let foundidea = [];

    for (let i = 0; i < allIdeas.length; i++) {
      let idea_uri_json = allIdeas[i];

      let goalid = Number(await contract.get_goal_id_from_ideas_uri(idea_uri_json));
      let idea_uri = JSON.parse(idea_uri_json);
      idea_uri.id = i;

      if (idea_uri.properties.user_id.description == user_id) {
        let votes = await contract.get_ideas_votes_from_goal(goalid, i);
        
        idea_uri.votes = votes.filter((item, idx) => item !== '');

        foundidea.push(idea_uri);
      }
    }

    foundidea.sort(function (a, b) {
      return b.votes.length - a.votes.length;
    });

    let _donations_ids = await contract._donations_ids();
    let ideasURIS = [];
    for (let i = 0; i < _donations_ids; i++) {
      let donationURI = await contract._donations(i);
      if (donationURI.userid == user_id) {
        let existsIdea = ideasURIS.findIndex((e) => e.id == Number(donationURI.ideas_id));
        if (existsIdea != -1) {
          ideasURIS[existsIdea].donation += Number(donationURI.donation) / 1e18;
          continue;
        }
        let ideaURI = JSON.parse((await contract._ideas_uris(Number(donationURI.ideas_id))).ideas_uri);
        ideaURI.donation = Number(donationURI.donation) / 1e18;
        ideaURI.id = Number(donationURI.ideas_id);
        ideasURIS.push(ideaURI);
      }
    }
    let allMessages = [];

    let ideasReplied = 0;
    let MessagesIdeasURIS = [];
    let _message_ids = await window.contract._message_ids();
    for (let i = 0; i < _message_ids; i++) {
      let messageURI = await window.contract.all_messages(i);

      if (JSON.parse(messageURI.message).userid == user_id) {
        ideasReplied += 1;
        let ideaURI = JSON.parse((await window.contract._ideas_uris(Number(messageURI.ideas_id))).ideas_uri);

        let parsed_message = JSON.parse(messageURI.message);
        parsed_message.idea = ideaURI;

        allMessages.push(parsed_message);

        let existsIdea = MessagesIdeasURIS.findIndex((e) => e.id == Number(messageURI.ideas_id));
        if (existsIdea != -1) {
          MessagesIdeasURIS[existsIdea].replied += 1;
          continue;
        }

        ideaURI.replied = 1;
        ideaURI.id = Number(messageURI.ideas_id);
        MessagesIdeasURIS.push(ideaURI);
      }
    }

    // let _reply_ids = await contract._reply_ids();
    // for (let i = 0; i < _reply_ids; i++) {
    // 	let repliesURI = await contract.all_replies(i);
    // 	if (JSON.parse(repliesURI.message).userid == user_id) {
    // 		ideasReplied += 1;
    // 		let ideaURI = JSON.parse((await window.contract._ideas_uris(Number(repliesURI.ideas_id))).ideas_uri);

    // 		let parsed_rplied = JSON.parse(repliesURI.message);
    // 		parsed_rplied.idea = ideaURI;
    // 		allMessages.push(parsed_rplied);

    // 		let existsIdea = MessagesIdeasURIS.findIndex(e => e.id == Number(repliesURI.ideas_id));
    // 		if (existsIdea != -1) {
    // 			MessagesIdeasURIS[existsIdea].replied += 1;
    // 			continue;
    // 		}

    // 		ideaURI.replied = 1;
    // 		ideaURI.id = Number(repliesURI.ideas_id);
    // 		MessagesIdeasURIS.push(ideaURI);
    // 	}
    // }

    setReplied(ideasReplied);
    setDonated(donated);
    setTotalRead(total_read);
    setDaos(founddao);
    setIdeas(foundidea);
    setDontatedIdeas(ideasURIS);
    setRepliesIdeas(MessagesIdeasURIS);
    setUserBadges(allBadges);

    setAllMessages(allMessages);

    setLoading(false);
  }

  function logout() {
    window.localStorage.setItem('loggedin', '');
    window.localStorage.setItem('login-type', '');
    window.location.href = '/';
  }

  const SummaryPanel = () => (
    <div className="flex flex-col w-full gap-8">
      <div className="top-section stats-section">
        <h3 className="stats-title">Stats</h3>
        <Loader
          element={
            <ul className="w-full flex gap-2">
              <li className="stats-topic-count linked-stat">
                <a id="ember1267" className="ember-view">
                  <div id="ember1268" className="user-stat ember-view">
                    <span className="value">
                      <span className="number">{TotalRead}</span>
                    </span>
                    <span className="label">total message read</span>
                  </div>
                </a>
              </li>
              <li className="stats-topic-count linked-stat">
                <a id="ember1267" className="ember-view">
                  <div id="ember1268" className="user-stat ember-view">
                    <span className="value">
                      <span className="number">{Daos.length}</span>
                    </span>
                    <span className="label">dao created</span>
                  </div>
                </a>
              </li>
              <li className="stats-post-count linked-stat">
                <a id="ember1269" className="ember-view">
                  <div id="ember1270" className="user-stat ember-view">
                    <span className="value">
                      <span className="number">{Ideas.length}</span>
                    </span>
                    <span className="label">ideas created</span>
                  </div>
                </a>
              </li>
              <li className="stats-post-count linked-stat">
                <a id="ember1269" className="ember-view">
                  <div id="ember1270" className="user-stat ember-view">
                    <span className="value">
                      <span className="number">{Donated} DEV</span>
                    </span>
                    <span className="label">donated</span>
                  </div>
                </a>
              </li>
              {/* <li className="stats-post-count linked-stat">
                <a id="ember1269" className="ember-view">
                  <div id="ember1270" className="user-stat ember-view">
                    <span className="value">
                      <span className="number">{Replied}</span>
                    </span>
                    <span className="label">ideas replied</span>
                  </div>
                </a>
              </li> */}
            </ul>
          }
          width="100%"
          height={40}
          loading={loading}
        />
      </div>
      <div>
        <div>
          <div id="ember152" className="replies-section pull-left top-sub-section ember-view">
            <h3 className="stats-title">Top Daos</h3>
            <ul>
              {Daos.length < 1 && loading == false ? (
                <>
                  <li
                    style={{
                      border: '0px',
                      color: 'gray',
                      padding: '0'
                    }}
                  >
                    No daos yet.
                  </li>
                </>
              ) : (
                <></>
              )}

              <Loader
                element={Daos.map((item, idx) => {
                  return (
                    <li id="ember154" key={idx} className="ember-view">
                      <span className="topic-info">
                        <span className="like-count">
                          <span className="number">{item.goals.length} Goals</span>
                        </span>
                      </span>
                      <br></br>
                      <a href={'/daos/dao?[' + item.daoId + ']'}>{item.Title}</a>
                    </li>
                  );
                })}
                width="100%"
                height={200}
                loading={loading}
              />
            </ul>
          </div>
          <div id="ember152" className="replies-section pull-left top-sub-section ember-view">
            <h3 className="stats-title">Top Ideas</h3>
            <ul>
              {Ideas.length < 1 && loading == false ? (
                <>
                  <li
                    style={{
                      border: '0px',
                      color: 'gray',
                      padding: '0'
                    }}
                  >
                    No ideas yet.
                  </li>
                </>
              ) : (
                <></>
              )}
              <Loader
                element={Ideas.map((item, idx) => {
                  return (
                    <li id="ember154" key={idx} className="ember-view">
                      <span className="topic-info">
                        <span className="like-count">
                          <span className="number">{item.votes.length} Votes</span>
                        </span>
                      </span>
                      <br></br>
                      <a href={'/daos/dao/goal/ideas?[' + item.id + ']'}>{item.properties.Title.description}</a>
                    </li>
                  );
                })}
                width="100%"
                height={200}
                loading={loading}
              />
            </ul>
          </div>
        </div>
        <div>
          <div id="ember152" className="replies-section pull-left top-sub-section ember-view">
            <h3 className="stats-title">Top Donated Ideas</h3>
            <ul>
              {DontatedIdeas.length < 1 && loading == false ? (
                <>
                  <li
                    style={{
                      border: '0px',
                      color: 'gray',
                      padding: '0'
                    }}
                  >
                    No donate yet.
                  </li>
                </>
              ) : (
                <></>
              )}
              <Loader
                element={DontatedIdeas.map((item, idx) => {
                  return (
                    <li id="ember154" key={idx} className="ember-view">
                      <span className="topic-info">
                        <span className="like-count">
                          <span className="number">{item.donation} DEV</span>
                        </span>
                      </span>
                      <br></br>
                      <a href={'/daos/dao/goal/ideas?[' + item.id + ']'}>{item.properties.Title.description}</a>
                    </li>
                  );
                })}
                width="100%"
                height={200}
                loading={loading}
              />
            </ul>
          </div>
          <div id="ember152" className="replies-section pull-left top-sub-section ember-view">
            <h3 className="stats-title">Top Replies</h3>
            <ul>
              {RepliesIdeas.length < 1 && loading == false ? (
                <>
                  <li
                    style={{
                      border: '0px',
                      color: 'gray',
                      padding: '0'
                    }}
                  >
                    No reply yet.
                  </li>
                </>
              ) : (
                <></>
              )}
              <Loader
                element={RepliesIdeas.map((item, idx) => {
                  return (
                    <li id="ember154" key={idx} className="ember-view">
                      <div className="topic-info" style={{ gap: '0.5rem', display: 'flex' }}>
                        <svg className="fa d-icon d-icon-reply svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z" />
                        </svg>
                        <span className="replies">
                          <span className="number">{item.replied}</span>
                        </span>
                      </div>
                      <a href={'/daos/dao/goal/ideas?[' + item.id + ']'}>{item.properties.Title.description}</a>
                    </li>
                  );
                })}
                width="100%"
                height={200}
                loading={loading}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityPanel = () => (
    <ul className="w-full">
      {AllMessages.length < 1 && <p className="text-trunks text-center w-full mt-20">You don’t have any activity yet.</p>}
      {AllMessages.map((item, idx) => (
        <li key={idx}>
          <div className="row" style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="Comment_topicAvatar__zEU3E">
              <div className="post-avatar">
                <a className="trigger-user-card main-avatar " aria-hidden="true" tabIndex={-1}>
                  <svg width={45} height={45} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459" style={{ fill: 'var(--foreground)' }}>
                    <g>
                      <g>
                        <path d="M229.5,0C102.53,0,0,102.845,0,229.5C0,356.301,102.719,459,229.5,459C356.851,459,459,355.815,459,229.5 C459,102.547,356.079,0,229.5,0z M347.601,364.67C314.887,393.338,273.4,409,229.5,409c-43.892,0-85.372-15.657-118.083-44.314 c-4.425-3.876-6.425-9.834-5.245-15.597c11.3-55.195,46.457-98.725,91.209-113.047C174.028,222.218,158,193.817,158,161 c0-46.392,32.012-84,71.5-84c39.488,0,71.5,37.608,71.5,84c0,32.812-16.023,61.209-39.369,75.035 c44.751,14.319,79.909,57.848,91.213,113.038C354.023,354.828,352.019,360.798,347.601,364.67z" />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
            </div>
            <div className="Comment_clearfix__JMJ_m w-full">
              <div
                role="heading"
                className="Comment_TopicMetaData__PJQS5 w-full"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 52
                }}
              >
                <div className="Comment_TriggerUserCard__fXK8r">
                  <span className="font-bold text-piccolo">
                    <a href={'/daos/dao/goal/ideas?[' + item.idea.id + ']'} style={{ color: 'var(--title-a-text)' }}>
                      {item.idea.properties.Title.description}
                    </a>
                  </span>
                </div>
                <div className="Comment_PostInfos__V99FJ">
                  <div className="post-info post-date" style={{ flex: '0 0 auto', marginRight: 0 }}>
                    <a className="widget-link post-date" title="Post date">
                      <span style={{ whiteSpace: 'nowrap' }}>{formatDistance(new Date(item.date), new Date(), { addSuffix: true })}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="Comment_cooked__PWlQn">
              <p>{item.message}</p>
            </div>
          </div>
          <hr className="mt-4" style={{ marginBottom: '1rem' }} />
        </li>
      ))}
    </ul>
  );

  const BadgesPanel = () => (
    <div className="badge-group-list">
      <Badge icon={<GenericUser />} label="Basic" description="All essential community functions" granted />
      {/* <Badge icon={<ChatChat />} label="First reply" description="Replied to a message" granted={UserBadges.reply} /> */}
      <Badge icon={<GenericUsers />} label="First DAO" description="Created a DAO community" granted={UserBadges.dao} />
      <Badge icon={<GenericUsers />} label="First Community" description="Joined a DAO community" granted={UserBadges.joined} />
      <Badge icon={<GenericIdea />} label="First Idea" description="Created an idea" granted={UserBadges.ideas} />
      <Badge icon={<GenericHeart />} label="First vote" description="Voted on an idea" granted={UserBadges.vote} />
      <Badge icon={<ShopWallet />} label="First donation" description="Donated to an idea" granted={UserBadges.donation} />
      <Badge icon={<SportDarts />} label="First goal" description="Created a goal" granted={UserBadges.goal} />
      <Badge icon={<ChatCommentText />} label="First comment" description="Commented on an idea" granted={UserBadges.comment} />
    </div>
  );

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border`}>
        <div className="container flex w-full justify-between relative">
          <div className="flex gap-2 items-center">
            {UserInfo?.imgIpfs?.toString() !== '' && UserInfo?.imgIpfs !== undefined ? (
              <img src={'https://' + UserInfo?.imgIpfs?.toString() + '.ipfs.nftstorage.link'} alt="" className="rounded-full border-2 w-12 h-12 object-cover border-piccolo" />
            ) : (
              <Avatar size="lg" className="rounded-full border-2 border-piccolo bg-goku">
                <GenericUser className="text-moon-32" />
              </Avatar>
            )}

            <h1 className="font-bold">{UserInfo?.fullName?.toString()}</h1>
          </div>
          <div className="flex flex-col gap-2">
            {loggedUser ? (
              <Button variant="secondary" iconLeft={<SoftwareLogOut />} onClick={logout}>
                Log out
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="container">
          <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
            <Tabs.List>
              <Tabs.Tab>Summary</Tabs.Tab>
              <Tabs.Tab>Activity</Tabs.Tab>
              <Tabs.Tab>Badges</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
      <div className="container py-10">
        <Card className="min-h-[556px]">
          {tabIndex === 0 && SummaryPanel()}
          {tabIndex === 1 && ActivityPanel()}
          {tabIndex === 2 && BadgesPanel()}
        </Card>
      </div>
    </>
  );
}
