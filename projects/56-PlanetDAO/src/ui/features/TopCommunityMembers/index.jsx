import { Dropdown, MenuItem } from '@heathmont/moon-core-tw';
import Card from '../../components/components/Card';
import useContract from '../../services/useContract';
import { useEffect, useState } from 'react';
import { usePolkadotContext } from '../../contexts/PolkadotContext';

const options = [{ id: 'most_donations_received', label: 'Received donations' }];

const topDonators = [
  { name: 'Thomas', amount: 5300 },
  { name: 'Steve', amount: 4750 },
  { name: 'Baha', amount: 2306 },
  { name: 'Arjen', amount: 1774 },
  { name: 'Franco', amount: 800.34 }
];

export const TopCommunityMembers = ({daoid}) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { getUserInfoById } = usePolkadotContext();
  const [items, setItems] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const { contract } = useContract();



  async function fetchContractData() {
    setisLoading(true);

    try {
      if (contract ) {
        const totalDonations = await contract._donations_ids();
        let  alldonations = [];
    
        for (let i = 0; i < Number(totalDonations); i++) {
          const donated = await contract._donations(i);
          let dao_id_of_donated =  ( await contract.get_dao_id_by_ideas_id(Number(donated.ideas_id)));
          if (dao_id_of_donated == daoid){
            let foundUserDonated = alldonations.findIndex((item,idx)=>item.userid == Number(donated.userid));
            if ( foundUserDonated== -1){
              let user_info  = await getUserInfoById(Number(donated.userid))
              alldonations.push({
                userid: Number(donated.userid),
                name:user_info?.fullName?.toString(),
                amount: Number(donated.donation) / 1e18
              })
            }else{
              alldonations[foundUserDonated].amount +=Number(donated.donation) / 1e18
            }            
          }
        }
        setItems(alldonations);
        setisLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
    
  }

  useEffect(()=>{fetchContractData()},[contract])
  
  return (
    <Card className="flex flex-col gap-4 w-[236px] h-fit">
      <h5 className="text-trunks text-moon-14">Top community members by</h5>
      <Dropdown value={selectedOption} onChange={setSelectedOption}>
        {({ open }) => (
          <>
            <Dropdown.Select className="bg-gohan" open={open}>
              {selectedOption?.label}
            </Dropdown.Select>

            <Dropdown.Options>
              {options.map((option, index) => (
                <Dropdown.Option value={option} key={index}>
                  {({ selected, active }) => (
                    <MenuItem isActive={active} isSelected={selected}>
                      <MenuItem.Title>{option.label}</MenuItem.Title>
                    </MenuItem>
                  )}
                </Dropdown.Option>
              ))}
            </Dropdown.Options>
          </>
        )}
      </Dropdown>

      {selectedOption.id === 'most_donations_received' && 
      <> <div className="flex flex-col gap-1">
      {items.map((donator, index) => (
        <div className="flex justify-between items-center border-b pb-1 border-goku last-of-type:border-0" key={index}>
          <div className="flex flex-col gap-1">
            <div className="text-piccolo">{donator.name}</div>
            <div className="text-moon-12">DEV {donator.amount}</div>
          </div>
          <div>{index + 1}</div>
        </div>
      ))}
    </div></>
      }
    </Card>
  );
};

export default TopCommunityMembers;
