import Image from 'next/legacy/image';
import { Idea } from '../../../data-model/idea';
import Card from '../Card';
import Link from 'next/link';
import { Button } from '@heathmont/moon-core-tw';
import { ArrowsRightShort, GenericHeart, GenericIdea, ShopWallet } from '@heathmont/moon-icons-tw';
import { useState } from 'react';

const IdeaCard = ({ item, onClickVote, onClickDonate, preview, hideGoToButton }: { item: Idea; onClickVote?; onClickDonate?; preview?: boolean; hideGoToButton?: boolean }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <Card className={`max-w-[720px] ${preview && '!bg-goku'}`}>
      <div className="flex w-full">
        <div className="rounded-moon-s-md overflow-hidden flex justify-center items-center border border-beerus" style={{ position: 'relative', width: '188px', minWidth: '188px', height: '188px' }}>
          {<Image layout="fill" objectFit="cover" src={item.logo} onError={() => setShowPlaceholder(true)} alt="" />}
          { showPlaceholder && <GenericIdea className="text-moon-48 text-trunks" />}
        </div>
        <div className="flex flex-1 flex-col gap-2 relative px-5 text-moon-16">
          <p className="font-semibold text-moon-18">{item.Title}</p>
          <div>
            <p className="font-semibold text-moon-20 text-hit">DEV {Number(item.donation)}</p>
            <p>in donations</p>
          </div>
          <div>
            <p className="font-semibold text-moon-20 text-hit">{item.votes}</p>
            <p>Votes</p>
          </div>
          <div className="absolute bottom-0 right-0 flex gap-2">
            {!item.isVoted && !preview && !item.isOwner && (
              <Button variant="secondary" iconLeft={<GenericHeart />} onClick={onClickVote}>
                Vote
              </Button>
            )}

            {!item.isOwner && !preview && (
              <Button variant="secondary" iconLeft={<ShopWallet />} onClick={onClickDonate}>
                Donate
              </Button>
            )}
            {!hideGoToButton && (
              <Link href={`/daos/dao/goal/ideas?[${item.ideasId}]`}>
                <Button iconLeft={<ArrowsRightShort />}>Go to idea</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IdeaCard;
