import { formatDuration, intervalToDuration, isValid } from 'date-fns';
import Card from '../Card';
import { Activity } from '../../../data-model/activity';
import { Avatar, IconButton } from '@heathmont/moon-core-tw';
import { GenericHeart, GenericIdea, GenericPending, GenericUser, ShopWallet, SportDarts, SportSpecials } from '@heathmont/moon-icons-tw';
import IdeaCard from '../IdeaCard';
import GoalCard from '../GoalCard';
import { enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';


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

const VoteActivity = ({ data }) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-dodoria-60 text-bulma shrink-0">
        <GenericHeart className="text-moon-32" />
      </Avatar>
      <p>
        <span className="font-bold">{data.votesAmount} people voted</span> on an idea for the goal <span className="font-bold">{data.goalTitle}</span>
      </p>
    </div>
    <IdeaCard item={data.idea} preview />
  </div>
);

const GoalActivity = ({ data }) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-jiren text-bulma shrink-0">
        <SportDarts className="text-moon-32" />
      </Avatar>
      <p>
        <span className="text-piccolo">{data.name}</span> just created a goal
      </p>
    </div>
    <GoalCard item={data.goal} preview />
  </div>
);

const DonationActivity = ({ data }) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-cell text-bulma shrink-0">
        <ShopWallet className="text-moon-32" />
      </Avatar>
      <p>
        <span className="font-bold">DEV {data.donated} donated</span> on an idea for the goal <span className="font-bold">{data.goalTitle}</span>
      </p>
    </div>
    <IdeaCard item={data.idea} preview />
  </div>
);

const IdeaActivity = ({ data, hideGoToButton }) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-4 w-full items-center">
      <Avatar size="lg" className="rounded-full bg-krillin-60 text-bulma shrink-0">
        <GenericIdea className="text-moon-32" />
      </Avatar>
      <p>
        <span className="text-piccolo">{data.name}</span> just created an idea for the goal <span className="font-bold">{data.goalTitle}</span>
      </p>
    </div>
    <IdeaCard item={data.idea} hideGoToButton={hideGoToButton} preview />
  </div>
);

const ActivityCard = ({ old_date, type, data, className, hideGoToButton }: Activity & { old_date: Date; className?: string; hideGoToButton?: boolean }) => {
  const [formattedDuration, SetformattedDuration] = useState("")

  useEffect(() => {
    if (isValid(old_date)){
      var date = new Date()
      var now_utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds()));
      const duration = intervalToDuration({ start: now_utc, end: old_date });
    // Format the duration
  
    SetformattedDuration( `${formatDuration(duration, { format: ['days', 'minutes'], zero: false })} ago`);

    }else{
      SetformattedDuration( ``);

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
