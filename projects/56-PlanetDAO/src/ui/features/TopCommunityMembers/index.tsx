import { Dropdown, MenuItem } from '@heathmont/moon-core-tw';
import Card from '../../components/components/Card';
import { useState } from 'react';

const options = [{ id: 'most_donations_received', label: 'Received donations' }];

const topDonators = [
  { name: 'Thomas', amount: 5300 },
  { name: 'Steve', amount: 4750 },
  { name: 'Baha', amount: 2306 },
  { name: 'Arjen', amount: 1774 },
  { name: 'Franco', amount: 800.34 }
];

const MostDonationsList = () => (
  <div className="flex flex-col gap-1">
    {topDonators.map((donator, index) => (
      <div className="flex justify-between items-center border-b pb-1 border-goku last-of-type:border-0" key={index}>
        <div className="flex flex-col gap-1">
          <div className="text-piccolo">{donator.name}</div>
          <div className="text-moon-12">DEV {donator.amount}</div>
        </div>
        <div>{index + 1}</div>
      </div>
    ))}
  </div>
);

export const TopCommunityMembers = () => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

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

      {selectedOption.id === 'most_donations_received' && <MostDonationsList />}
    </Card>
  );
};

export default TopCommunityMembers;
