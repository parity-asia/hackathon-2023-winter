import React, { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { ethers } from 'ethers';
import { useUtilsContext } from '../../contexts/UtilsContext';
import { usePolkadotContext} from '../../contexts/PolkadotContext';
import vTokenAbi from '../../services/json/vTokenABI.json';
import useContract, { getChain } from '../../services/useContract';

import { sendTransfer } from '../../services/wormhole/useSwap';
import { Button, Dropdown, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import UseFormInput from '../../components/components/UseFormInput';

export default function DonateCoin({ ideasid,show, onHide, address }) {
  const [Balance, setBalance] = useState('');
  const {userInfo} = usePolkadotContext();
  const [CurrentChain, setCurrentChain] = useState('');
  const [CurrentChainNetwork, setCurrentChainNetwork] = useState(0);
  const [CurrentAddress, setCurrentAddress] = useState('');
  const [Coin, setCoin] = useState('DEV');
  const [isLoading, setisLoading] = useState(false);
  const [isSent, setisSent] = useState(false);
  const { sendTransaction } = useContract();

  let alertBox = null;
  const [transaction, setTransaction] = useState({
    link: '',
    token: ''
  });

  const { BatchDonate } = useUtilsContext();

  const [Amount, AmountInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: '0.00',
    id: 'amount'
  });

  function ShowAlert(type = 'default', message) {
    const pendingAlert = alertBox.children['pendingAlert'];
    const successAlert = alertBox.children['successAlert'];
    const errorAlert = alertBox.children['errorAlert'];

    alertBox.style.display = 'block';
    pendingAlert.style.display = 'none';
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    switch (type) {
      case 'pending':
        pendingAlert.querySelector('.MuiAlert-message').innerText = message;
        pendingAlert.style.display = 'flex';
        break;
      case 'success':
        successAlert.querySelector('.MuiAlert-message').innerText = message;
        successAlert.style.display = 'flex';
        break;
      case 'error':
        errorAlert.querySelector('.MuiAlert-message').innerText = message;
        errorAlert.style.display = 'flex';
        break;
    }
  }

  async function DonateCoinSubmission(e) {
    e.preventDefault();
    console.clear();
    setisSent(false);
    alertBox = e.target.querySelector('[name=alertbox]');
    setisLoading(true);
    let feed1 = JSON.stringify( {
      name: userInfo?.fullName?.toString(),
      badge: 'First Donation'
    })

    const ideaURI = await contract.ideas_uri(Number(ideasid)); //Getting ideas uri
    let Goalid = await contract.get_goal_id_from_ideas_uri(ideaURI);
    const goalURIFull = await contract._goal_uris(Number(Goalid)); //Getting total goal (Number)
    const goalURI = JSON.parse(goalURIFull.goal_uri);
  

    let feed2 = JSON.stringify( {
      donated: Amount,
      goalTitle: goalURI.properties.Title.description,
      ideasid:  Number(ideasid)
    })
    if (Number(window.ethereum.networkVersion) === 1287) {
      //If it is sending from Moonbase so it will use batch precompiles
      ShowAlert('pending', 'Sending Batch Transaction....');
      await BatchDonate(Amount, address, Number(ideasid), Coin,feed1,feed2);

      ShowAlert('success', 'Donation success!');
   
    } else {
     
      let output = await sendTransfer(Number(window.ethereum.networkVersion), Amount, address, ShowAlert);
      setTransaction({
        link: output.transaction,
        token: output?.wrappedAsset
      });
      // Saving Donation count on smart contract
      await sendTransaction(await window.contract.populateTransaction.add_donation(Number(ideasid), `${Amount * 1e18}`, Number(window.userid),feed1,feed2));
    }
    window.location.reload();
    LoadData();
    setisLoading(false);
    setisSent(true);
    
    onHide();
    
  }

  async function LoadData() {
    const Web3 = require('web3');
    const web3 = new Web3(window.ethereum);
    let Balance = await web3.eth.getBalance(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
    let token = ' ' + Coin;
    if (Coin !== 'DEV') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const tokenInst = new ethers.Contract(vTokenAbi.address, vTokenAbi.abi, provider);

      Balance = await tokenInst.balanceOf(window?.ethereum?.selectedAddress);
    }

    setBalance((Balance / 1000000000000000000).toFixed(5) + token);
    setCurrentChain(getChain(Number(window.ethereum.networkVersion)).name);
    setCurrentChainNetwork(Number(window.ethereum.networkVersion));
    setCurrentAddress(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
  }

  useEffect(() => {
    LoadData();
  }, [show, Coin]);

  return (
    <Modal open={show} onClose={onHide}>
      <Modal.Backdrop />
      <Modal.Panel className="min-w-[480px] bg-gohan">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Donate to idea</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onHide} />
          </div>
          <div className="flex flex-col gap-6 w-full max-h-[calc(90vh-162px)] overflow-auto">
            <form id="doanteForm" onSubmit={DonateCoinSubmission} autoComplete="off">
              <div name="alertbox" hidden>
                <Alert variant="filled" sx={{ my: 1 }} name="pendingAlert" severity="info">
                  Pending....
                </Alert>
                <Alert variant="filled" sx={{ my: 1 }} name="successAlert" severity="success">
                  Success....
                </Alert>
                <Alert variant="filled" sx={{ my: 1 }} name="errorAlert" severity="error">
                  Error....
                </Alert>
              </div>

              <div className="flex flex-col gap-2 p-6 pb-3">
                <Dropdown value={Coin} onChange={setCoin}>
                  <Dropdown.Select label="Coin" placeholder="Choose an option">
                    {Coin}
                  </Dropdown.Select>
                  <Dropdown.Options className="bg-gohan w-48 min-w-0 w-full">
                    <Dropdown.Option value="DEV">
                      <MenuItem>DEV</MenuItem>
                    </Dropdown.Option>
                    <Dropdown.Option value="xcvGLMR">
                      <MenuItem>xcvGLMR</MenuItem>
                    </Dropdown.Option>
                  </Dropdown.Options>
                </Dropdown>
              </div>

              <div className="flex flex-col gap-2 p-6 pt-3">
                <h6>Amount</h6>
                {AmountInput}
                <p className="text-moon-12">Your balance is {Balance} </p>
              </div>

              <div className="flex justify-between border-t border-beerus w-full p-6">
                <Button variant="ghost" onClick={onHide}>
                  Cancel
                </Button>
                <Button animation={isLoading && 'progress'} disabled={isLoading}  type="submit" id="CreateGoalBTN">
                  Donate
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
