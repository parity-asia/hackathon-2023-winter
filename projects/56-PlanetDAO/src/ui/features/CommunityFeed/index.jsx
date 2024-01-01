import ActivityCard from '../../components/components/ActivityCard';
import { Activity } from '../../data-model/activity';
import { useEffect, useState } from 'react';
import useContract from '../../services/useContract';
import { sortDateDesc } from '../../utils/sort-date';

const mockItems = [
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'join',
    data: {
      name: '@arjenvgaal'
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'badge',
    data: {
      name: '@stevethijssen',
      badge: 'First Donation'
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'vote',
    data: {
      votesAmount: 250,
      goalTitle: 'Improve student lives',
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'goal',
    data: {
      name: '@stevethijssen',
      goal: {
        Title: 'Improve student lives',
        budget: 120
      }
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'donation',
    data: {
      donated: 100,
      goalTitle: 'Improve student lives',
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'idea',
    data: {
      name: '@stevethijssen',
      goalTitle: 'Improve student lives',
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  }
] ;

const CommunityFeed = () => {
  const [loading, setLoading] = useState(false);
  const [Items, setItems] = useState([]);
  const { contract } = useContract();


  async function fetchContractData() {
    setLoading(true);

    try {
      if (contract ) {
        const totalFeeds = await contract._feed_ids();
        const arr = [];
    
        for (let i = 0; i < Number(totalFeeds); i++) {
          const feed = await contract._feeds(i);
          arr.push({
            date: new Date(Number(feed.date) * 1000),
            type: feed.Type,
            data: JSON.parse( feed.data)
          })         

        }


        setItems( sortDateDesc(arr, 'date'));
       
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
    
  }

  useEffect(()=>{fetchContractData()},[contract])
  
  return (
    <div className="flex flex-col gap-2 w-full items-center pb-10 w-[540px] min-w-[540px]">
      {Items.map((item, index) => (
        <ActivityCard key={index} old_date={item.date} type={item.type} data={item.data}></ActivityCard>
      ))}
    </div>
  );
};

export default CommunityFeed;
