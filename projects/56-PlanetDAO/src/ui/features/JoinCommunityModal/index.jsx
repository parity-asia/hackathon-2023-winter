import React, { useState, useEffect } from 'react';
import { getChain } from '../../services/useContract';
import Alert from '@mui/material/Alert';
import useContract from '../../services/useContract';
import { useUtilsContext } from '../../contexts/UtilsContext';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import { sendTransfer } from '../../services/wormhole/useSwap';
import { Button, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';

export default function JoinCommunityModal({ SubsPrice, show, onHide, address, title, dao_id }) {
  const [Balance, setBalance] = useState('');
  const [Token, setToken] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isSent, setisSent] = useState(false);
  const [Amount, setAmount] = useState(0);
  const { contract, signerAddress, sendTransaction } = useContract();

  let alertBox = null;
  const [transaction, setTransaction] = useState({
    link: '',
    token: ''
  });

  const { BatchJoin, getUSDPriceForChain } = useUtilsContext();
  const { userInfo} = usePolkadotContext();

  function ShowAlert(type = 'default', message) {
    alertBox = document.querySelector('[name=alertbox]');

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

  async function JoinSubmission(e) {
    e.preventDefault();
    console.clear();
    setisSent(false);

    setisLoading(true);
      let feed = JSON.stringify({
        name: userInfo?.fullName?.toString()
      })
    if (Number(window.ethereum.networkVersion) === 1287) {
      //If it is sending from Moonbase so it will use batch precompiles
      ShowAlert('pending', 'Sending Batch Transaction....');

      await BatchJoin(Amount, address, Number(dao_id),feed);

      ShowAlert('success', 'Purchased Subscription successfully!');
      
    } else {
      let output = await sendTransfer(Number(window.ethereum.networkVersion),`${Number( Amount) }`, address, ShowAlert);
      setTransaction({
        link: output.transaction,
        token: output?.wrappedAsset
      });
      // Saving Joined Person on smart contract
      await sendTransaction(await window.contract.populateTransaction.join_community(dao_id, Number(window.userid),feed));
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
    let token = ' ' + getChain(Number(window.ethereum.networkVersion)).nativeCurrency.symbol;

    setToken(token);
    setBalance(Number((Balance / 1000000000000000000).toPrecision(5)));

    let UsdEchangePrice = await getUSDPriceForChain();
    let amount = SubsPrice / Number(UsdEchangePrice);
    setAmount(amount.toPrecision(5));
  }

  useEffect(() => {
    LoadData();
  }, [show]);

  return (
    <Modal open={show} onClose={onHide} fullWidth aria-labelledby="contained-modal-title-vcenter" centered="true">
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[480px]">
        <div className={`flex items-center justify-center flex-col`}>
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Join community "{title}"</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onHide} />
          </div>
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

          <div className="flex flex-col gap-8 w-full p-8">
            <div className="flex justify-between pt-8">
              <h4 className="font-semibold text-moon-18">Total</h4>
              <h4 className="font-semibold text-moon-18">{Amount} {Token}</h4>
            </div>
            {Amount > Balance ? <p className="pb-8 text-right text-dodoria">Insufficient funds</p> : <p className="pb-8 text-right">Your balance is {Balance} {Token}</p>}
          </div>

          <div className="flex justify-between border-t border-beerus w-full p-6">
            <Button variant="ghost" onClick={onHide}>
              Cancel
            </Button>
            <Button id="CreateGoalBTN" type="submit" onClick={JoinSubmission} animation={isLoading && 'progress'} disabled={Amount > Balance || isLoading}>
              Join
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
