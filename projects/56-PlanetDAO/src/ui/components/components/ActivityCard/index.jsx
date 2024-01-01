import { formatDuration, intervalToDuration, isValid } from 'date-fns';
import Card from '../Card';
import { Activity } from '../../../data-model/activity';
import { Avatar, IconButton } from '@heathmont/moon-core-tw';
import { GenericHeart, GenericIdea, GenericPending, GenericUser, ShopWallet, SportDarts, SportSpecials } from '@heathmont/moon-icons-tw';
import IdeaCard from '../IdeaCard';
import GoalCard from '../GoalCard';
import { enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import useContract from '../../../services/useContract';



const JoinActivity = ({ data }) => (
  <div className="flex gap-4 w-full items-center">
    <Avatar size="lg" className="rounded-full bg-goku shrink-0">
      <GenericUser className="text-moon-32" />
    </Avatar>
    <p>
      <span className="text-piccolo">{data.name}</span> just joined this community
    </p>
  </div>
);

const BadgeActivity = ({ data }) => (
  <div className="flex gap-4 w-full items-center">
    <Avatar size="lg" className="rounded-full bg-krillin shrink-0">
      <SportSpecials className="text-moon-32" />
    </Avatar>
    <p>
      <span className="text-piccolo">{data.name}</span> just achieved his first badge for <span className="font-semibold">{data.badge}</span>
    </p>
  </div>
);

function VoteActivity ({ data }) {
  
  const { contract } = useContract();

  const [ideaURI, setIdeaURI] = useState({
    ideasId: 0,
    Title: "",
    donation: 0,
    votes: 0,
    logo: "",
    isVoted: false,
    isOwner: false,
  });


  async function fetchContractData() {
    if (contract) {
      const ideaURI = await contract.ideas_uri(Number(data.ideasid)); //Getting ideas uri
      let Goalid = await contract.get_goal_id_from_ideas_uri(ideaURI);
      const object = JSON.parse(ideaURI).properties; //Getting ideas uri
      let isvoted = false;
      const Allvotes = await contract.get_ideas_votes_from_goal(Number(Goalid), Number(data.ideasid)); //Getting all votes

      for (let i = 0; i < Allvotes.length; i++) {
        const element = Allvotes[i];
        if (element == Number(window.userid)) isvoted = true;
      }



      setIdeaURI({
        ideasId: Number(data.ideasid),
        Title: object.Title.description,
        logo: object.logo.description?.url,
        donation: Number((await contract._ideas_uris(Number(data.ideasid))).donation) / 1e18,
        votes: Object.keys(Allvotes).filter((item, idx) => item !== '').length,
        isVoted: isvoted,
        isOwner: object.user_id.description == Number(window.userid) ? true : false,
      });
    }
  }

  useEffect(() => {
    fetchContractData()
  }, [contract]);

  return <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-dodoria-60 text-bulma shrink-0">
        <GenericHeart className="text-moon-32" />
      </Avatar>
      <p>
        <span className="font-bold">{data.votesAmount} people voted</span> on an idea for the goal <span className="font-bold">{data.goalTitle}</span>
      </p>
    </div>
    <IdeaCard item={ideaURI} preview />
  </div>
};

function GoalActivity({ data }) {
  const { contract } = useContract();

  const [goalURI, setGoalURI] = useState({
    goalId: 0,
    Title: "",
    Description: "",
    Budget: "",
    End_Date: new Date(),
    logo: "",
    ideasCount: 0,
    reached:0
  });


  async function fetchContractData() {
    if (contract) {
      const goalURIFull = await contract._goal_uris(Number(data.goalid));
      const goalURI = JSON.parse(goalURIFull.goal_uri).properties;
      const totalIdeasWithEmpty = await contract.get_all_ideas_by_goal_id(Number(data.goalid)); //Getting total goal (Number)

      let totalIdeas = totalIdeasWithEmpty.filter((e) => e !== '');

      let total_reached = 0;
      for (let i = 0; i < totalIdeas.length; i++) {
        const element = totalIdeas[i];

        const ideasId = await contract.get_ideas_id_by_ideas_uri(element);
        let donation = Number((await contract._ideas_uris(Number(ideasId))).donation) / 1e18;
        total_reached += donation;
     
      }


      setGoalURI({
        goalId: Number(data.goalid),
        Title: goalURI.Title.description,
        logo: goalURI.logo.description?.url,
        Budget: goalURI.Budget.description,
        ideasCount: Object.keys(totalIdeas).filter((item, idx) => item !== '').length,
        reached:total_reached
      });
    }
  }

  useEffect(() => {
    fetchContractData()
  }, [contract])

  return <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-jiren text-bulma shrink-0">
        <SportDarts className="text-moon-32" />
      </Avatar>
      <p>
        <span className="text-piccolo">{data.name}</span> just created a goal
      </p>
    </div>
    <GoalCard item={goalURI} preview />
  </div>
};

function DonationActivity({ data }) {
  const { contract } = useContract();

  const [ideaURI, setIdeaURI] = useState({
    ideasId: 0,
    Title: "",
    donation: 0,
    votes: 0,
    logo: "",
    isVoted: false,
    isOwner: false,
  });


  async function fetchContractData() {
    if (contract) {
      const ideaURI = await contract.ideas_uri(Number(data.ideasid)); //Getting ideas uri
      let Goalid = await contract.get_goal_id_from_ideas_uri(ideaURI);
      const object = JSON.parse(ideaURI).properties; //Getting ideas uri
      let isvoted = false;
      const Allvotes = await contract.get_ideas_votes_from_goal(Number(Goalid), Number(data.ideasid)); //Getting all votes

      for (let i = 0; i < Allvotes.length; i++) {
        const element = Allvotes[i];
        if (element == Number(window.userid)) isvoted = true;
      }
    

      setIdeaURI({
        ideasId: Number(data.ideasid),
        Title: object.Title.description,
        logo: object.logo.description?.url,
        donation: Number((await contract._ideas_uris(Number(data.ideasid))).donation) / 1e18,
        votes: Object.keys(Allvotes).filter((item, idx) => item !== '').length,
        isVoted: isvoted,
        isOwner: object.user_id.description == Number(window.userid) ? true : false,
      });
    }
  }

  useEffect(() => {
    fetchContractData()
  }, [contract]);

  return <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-cell text-bulma shrink-0">
        <ShopWallet className="text-moon-32" />
      </Avatar>
      <p>
        <span className="font-bold">DEV {data.donated} donated</span> on an idea for the goal <span className="font-bold">{data.goalTitle}</span>
      </p>
    </div>
    <IdeaCard item={ideaURI} preview />
  </div>

}

function IdeaActivity({ data, hideGoToButton }) {
  const { contract } = useContract();

  const [ideaURI, setIdeaURI] = useState({
    ideasId: 0,
    Title: "",
    donation: 0,
    votes: 0,
    logo: "",
    isVoted: false,
    isOwner: false,
  });


  async function fetchContractData() {
    if (contract) {
      const ideaURI = await contract.ideas_uri(Number(data.ideasid)); //Getting ideas uri
      let Goalid = await contract.get_goal_id_from_ideas_uri(ideaURI);
      const object = JSON.parse(ideaURI).properties; //Getting ideas uri
      let isvoted = false;
      const Allvotes = await contract.get_ideas_votes_from_goal(Number(Goalid), Number(data.ideasid)); //Getting all votes

      for (let i = 0; i < Allvotes.length; i++) {
        const element = Allvotes[i];
        if (element == Number(window.userid)) isvoted = true;
      }



      setIdeaURI({
        ideasId: Number(data.ideasid),
        Title: object.Title.description,
        logo: object.logo.description?.url,
        donation: Number((await contract._ideas_uris(Number(data.ideasid))).donation) / 1e18,
        votes: Object.keys(Allvotes).filter((item, idx) => item !== '').length,
        isVoted: isvoted,
        isOwner: object.user_id.description == Number(window.userid) ? true : false,
      });
    }
  }

  useEffect(() => {
    fetchContractData()
  }, [contract])

  return <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-krillin-60 text-bulma shrink-0">
        <GenericIdea className="text-moon-32" />
      </Avatar>
      <p>
        <span className="text-piccolo">{data.name}</span> just created an idea for the goal <span className="font-bold">{data.goalTitle}</span>
      </p>
    </div>
    <IdeaCard item={ideaURI} hideGoToButton={hideGoToButton} preview />
  </div>
};

const ActivityCard = ({ old_date, type, data, className, hideGoToButton }) => {
  const [formattedDuration, SetformattedDuration] = useState("")

  useEffect(() => {
    if (isValid(old_date)) {
      var date = new Date()
      var now_utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds()));
      const duration = intervalToDuration({ start: now_utc, end: old_date });
      // Format the duration

      SetformattedDuration(`${formatDuration(duration, { format: ['days', 'minutes'], zero: false })} ago`);

    } else {
      SetformattedDuration(``);

    }


  }, [])

  return (
    <Card className={`max-w-[540px] flex flex-col !p-4 relative ${className}`}>
      <div className="w-full text-trunks flex justify-between">
        <p className="text-moon-14">{formattedDuration} </p>
        <IconButton variant="ghost" icon={<GenericPending className="text-moon-32 text-trunks" />}></IconButton>
      </div>
      {type === 'join' && <JoinActivity data={data} />}
      {type === 'badge' && <BadgeActivity data={data} />}
      {type === 'vote' && <VoteActivity data={data} />}
      {type === 'goal' && <GoalActivity data={data} />}
      {type === 'donation' && <DonationActivity data={data} />}
      {type === 'idea' && <IdeaActivity data={data} hideGoToButton={hideGoToButton} />}
    </Card>
  );
};

export default ActivityCard;
