'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { useSnackbar } from 'notistack';
import { ethers } from 'ethers';
import vTokenAbi from '../services/json/vTokenABI.json';
import MoonbeamSlpx from '../services/json/MoonbeamSlpxABI.json';
import config from './json/config.json';
import datafeeds from './json/datafeeds.json';
import PriceFeedABI from '../contracts/artifacts/contracts/precompiles/PriceFeed.sol/AggregatorV3Interface.json';
import BatchABI from '../contracts/artifacts/contracts/precompiles/Batch.sol/Batch.json';
import PlanetDAO from '../contracts/deployments/moonbase/PlanetDAO.json';
import Web3 from 'web3';
import { ChainId } from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';
import { getChain } from '../services/useContract';
import ConvictionVoting from '../services/json/ConvictionVoting.json';

const AppContext = createContext({
  USDPrice: null,
  BiconomySmartAccount: null,
  LoadSmartAccount: async () => {},
  BatchDonate: async () => {},
  BatchJoin: async () => {},
  BatchVoteConviction: async () => {},
  getUSDPriceForChain: async () => {}
});

export function UtilsProvider({ children }) {
  const { enqueueSnackbar } = useSnackbar();
  const [USDPrice, SetUSDPrice] = useState('');
  const [BiconomySmartAccount, SetBiconomySmartAccount] = useState(null);

  async function loadPrice() {
    const targetNetwork = config.moonbase; //Moonbase

    let targetProvider = new ethers.providers.JsonRpcProvider(targetNetwork.rpc);
    const PriceFeedContract = new ethers.Contract(config.price_feed_address, PriceFeedABI.abi, targetProvider);
    let symbol = await PriceFeedContract.decimals();
    let exchangePriceInfo = await PriceFeedContract.latestRoundData();
    let symoblvalue = 10 ** Number(symbol);
    let exchangePrice = Number(exchangePriceInfo.answer) / symoblvalue;
    SetUSDPrice(exchangePrice.toFixed(2));
  }
  async function getUSDPriceForChain() {
    let token = getChain(Number(window.ethereum.networkVersion)).nativeCurrency.symbol;
    const targetNetwork = datafeeds[token];

    let targetProvider = new ethers.providers.JsonRpcProvider(targetNetwork.rpc);
    const PriceFeedContract = new ethers.Contract(targetNetwork.price_feed_address, PriceFeedABI.abi, targetProvider);
    let symbol = await PriceFeedContract.decimals();
    let exchangePriceInfo = await PriceFeedContract.latestRoundData();
    let symoblvalue = 10 ** Number(symbol);
    let exchangePrice = Number(exchangePriceInfo.answer) / symoblvalue; // 1CELO = 0.001 ETH

    if (targetNetwork.price_feed_address2 != null) {
      const PriceFeedContract2 = new ethers.Contract(targetNetwork.price_feed_address2, PriceFeedABI.abi, targetProvider);
      symbol = await PriceFeedContract2.decimals();
      exchangePriceInfo = await PriceFeedContract2.latestRoundData();
      symoblvalue = 10 ** Number(symbol);
      let exchangePrice2 = Number(exchangePriceInfo.answer) / symoblvalue; // 1 ETH = 4 USD
      return exchangePrice * exchangePrice2;
    }
    return exchangePrice;
  }

  async function LoadSmartAccount() {
    if (typeof window.ethereum === 'undefined' || window?.ethereum?.selectedAddress == null) {
      return;
    }
    const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
    let chainInfo = getChain(Number(window.ethereum.networkVersion));

    let options = {
      activeNetworkId: chainInfo.networkId,
      supportedNetworksIds: [ChainId.GOERLI, ChainId.ARBITRUM_GOERLI_TESTNET, ChainId.BSC_TESTNET],

      networkConfig: [
        {
          chainId: ChainId.ARBITRUM_GOERLI_TESTNET,
          dappAPIKey: '_YKXDggPQ.e2681a7a-504c-4ce6-b889-697ea0f58b06'
        }
      ]
    };

    let smartAccount = new SmartAccount(walletProvider, options);
    smartAccount = await smartAccount.init();

    SetBiconomySmartAccount(smartAccount);
    return smartAccount;
  }

  async function BatchDonate(amount, Recipient, ideas_id, Coin,feed1,feed2) {
    let parsedAmount = `${amount * 1e18}`;

    if (Number(window.ethereum.networkVersion) === 1287 && Coin == 'DEV') {
      //If Coin is DEV then it will use normal batch
      let to = [];
      let value = [];
      let callData = [];
      let gasLimit = [];

      //Adding Sending amount to Batch paramaters:
      to.push(Recipient);
      value.push(parsedAmount);
      callData.push('0x');

      //Adding save information into smart contract
      to.push(PlanetDAO.address);

      let web3 = new Web3(window.ethereum);
      const PlanetDAOContract = new web3.eth.Contract(PlanetDAO.abi, PlanetDAO.address).methods;

      let encodedCallData = PlanetDAOContract.add_donation(ideas_id, parsedAmount, Number(window.userid),feed1,feed2).encodeABI();

      callData.push(encodedCallData);

      //Sending Batch Transaction
      let batchAdd = '0x0000000000000000000000000000000000000808';
      let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

      await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
    }
    if (Number(window.ethereum.networkVersion) === 1287 && Coin == 'xcvGLMR') {
      //If Coin is DEV then it will use normal batch

      let to = [];
      let value = [];
      let callData = [];
      let gasLimit = [];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //Approve the amount first
      const vTokenContract = new ethers.Contract(vTokenAbi.address, vTokenAbi.abi, provider);
      let encodedCallData = await vTokenContract.populateTransaction.approve(MoonbeamSlpx.address, parsedAmount);
      to.push(vTokenAbi.address);
      callData.push(encodedCallData.data);

      //Transfer to recipient address
      const MoonbeamSlpxContract = new ethers.Contract(MoonbeamSlpx.address, MoonbeamSlpx.abi, provider);
      let encodedCallData2 = await MoonbeamSlpxContract.populateTransaction.swapAssetsForExactNativeAssets(vTokenAbi.address, parsedAmount, `${amount * 1e17}`, Recipient);
      to.push(MoonbeamSlpx.address);
      callData.push(encodedCallData2.data);

      //Adding save information into smart contract
      to.push(PlanetDAO.address);

      let web3 = new Web3(window.ethereum);
      const PlanetDAOContract = new web3.eth.Contract(PlanetDAO.abi, PlanetDAO.address).methods;
      let encodedCallData3 = PlanetDAOContract.add_donation(ideas_id, parsedAmount, Number(window.userid),feed1,feed2).encodeABI();
      callData.push(encodedCallData3);

      //Sending Batch Transaction
      let batchAdd = '0x0000000000000000000000000000000000000808';
      let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

      await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
    }
  }

  async function BatchJoin(amount, Recipient, dao_id,feed) {
    if (Number(window.ethereum.networkVersion) === 1287) {
      //If it is sending from Moonbase then it will not use Biconomy Batch Transactions
      let to = [];
      let value = [];
      let callData = [];
      let gasLimit = [];

      //Adding Sending amount to Batch paramaters:
      to.push(Recipient);
      value.push(`${(amount * 1e18).toFixed(0)}`);
      callData.push('0x');

      //Adding save information into smart contract
      to.push(PlanetDAO.address);

      let web3 = new Web3(window.ethereum);
      const PlanetDAOContract = new web3.eth.Contract(PlanetDAO.abi, PlanetDAO.address).methods;

      let encodedCallData = PlanetDAOContract.join_community(dao_id, Number(window.userid),feed).encodeABI();

      callData.push(encodedCallData);

      //Sending Batch Transaction
      let batchAdd = '0x0000000000000000000000000000000000000808';
      let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

      await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
    }
  }

  async function BatchVoteConviction(Goalid, id, voteType, PollIndex, VoteAmount, Conviction, SplitInfo, AbstainInfo) {
    let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
    let ConvictionAddr = '0x0000000000000000000000000000000000000812';
    let ConvictionVotingContract = new ethers.Contract(ConvictionAddr, ConvictionVoting.abi, targetSigner);

    let web3 = new Web3(window.ethereum);
    const PlanetDAOContract = new web3.eth.Contract(PlanetDAO.abi, PlanetDAO.address).methods;

    if (Number(window.ethereum.networkVersion) === 1287) {
      //If it is sending from Moonbase then it will not use Biconomy Batch Transactions
      let to = [];
      let value = [];
      let callData = [];
      let gasLimit = [];

      //Create Goal Ideas into smart contract
      let encodedCallData = PlanetDAOContract.create_goal_ideas_vote(Number(Goalid), Number(id), Number(window.userid)).encodeABI();

      to.push(PlanetDAO.address);
      callData.push(encodedCallData);

      //Conviction Vote

      let encodedCallData2 = null;

      if (voteType == 'aye') {
        encodedCallData2 = await ConvictionVotingContract.populateTransaction.voteYes(Number(PollIndex), Number(VoteAmount), Number(Conviction));
      } else if (voteType == 'nay') {
        encodedCallData2 = await ConvictionVotingContract.populateTransaction.voteNo(Number(PollIndex), Number(VoteAmount), Number(Conviction));
      } else if (voteType == 'split') {
        encodedCallData2 = await ConvictionVotingContract.populateTransaction.voteSplit(Number(PollIndex), Number(SplitInfo[0]), Number(SplitInfo[1]));
      } else if (voteType == 'abstain') {
        encodedCallData2 = await ConvictionVotingContract.populateTransaction.voteSplitAbstain(Number(PollIndex), Number(AbstainInfo[0]), Number(AbstainInfo[1], Number(AbstainInfo[2])));
      }

      to.push(ConvictionAddr);

      callData.push(encodedCallData2.data);

      //Sending Batch Transaction
      let batchAdd = '0x0000000000000000000000000000000000000808';
      let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

      await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
    } else {
      if (voteType == 'aye') {
        await window.sendTransaction(await ConvictionVotingContract.populateTransaction.voteYes(Number(PollIndex), Number(VoteAmount), Number(Conviction)));
      } else if (voteType == 'nay') {
        await window.sendTransaction(await ConvictionVotingContract.populateTransaction.voteNo(Number(PollIndex), Number(VoteAmount), Number(Conviction)));
      } else if (voteType == 'split') {
        await window.sendTransaction(await ConvictionVotingContract.populateTransaction.voteSplit(Number(PollIndex), Number(SplitInfo[0]), Number(SplitInfo[1])));
      } else if (voteType == 'abstain') {
        await window.sendTransaction(await ConvictionVotingContract.populateTransaction.voteSplitAbstain(Number(PollIndex), Number(AbstainInfo[0]), Number(AbstainInfo[1], Number(AbstainInfo[2]))));
      }
      await window.sendTransaction(await PlanetDAOContract.populateTransaction.create_goal_ideas_vote(Number(Goalid), Number(id), Number(window.userid)));
    }
  }

  useEffect(() => {
    setTimeout(() => {
      loadPrice();
      LoadSmartAccount();
    }, 1000);
  }, []);
  return <AppContext.Provider value={{ USDPrice: USDPrice, BatchDonate: BatchDonate, BatchJoin: BatchJoin, BatchVoteConviction: BatchVoteConviction, LoadSmartAccount: LoadSmartAccount, getUSDPriceForChain: getUSDPriceForChain, BiconomySmartAccount: BiconomySmartAccount }}>{children}</AppContext.Provider>;
}

export const useUtilsContext = () => useContext(AppContext);
