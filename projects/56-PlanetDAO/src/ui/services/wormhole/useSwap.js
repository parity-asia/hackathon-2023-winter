import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { getEmitterAddressEth, parseSequenceFromLogEth, attestFromEth, tryNativeToHexString, getIsTransferCompletedEth } from "@certusone/wormhole-sdk";
import config from "./json/config.json";
import TokenBridgeApi from "./json/TokenBridgeABI.json";
export async function sendTransfer(chainid, amount, Recipient, ShowAlert) {
	let FromNetwork = config.networks[chainid];
	const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
	if (Number(window.ethereum.networkVersion) === 1287) {
		//If it is sending from Moonbase then it will not use bridge
		const tx = {
			from: window?.ethereum?.selectedAddress?.toLocaleLowerCase(),
			to: Recipient,
			value: ethers.utils.parseEther(amount),
			gasPrice: 6_000_000_000
		};
		const reciept = await (await signer.sendTransaction(tx)).wait();
		return {
			transaction: `https://moonbase.moonscan.io/tx/${reciept.transactionHash}`
		};
	}

	//From Transferring Chain
	const FromContract = new ethers.Contract(FromNetwork.tokenBridgeAddress, TokenBridgeApi.abi, signer);

	const targetNetwork = config.networks["1287"]; //Moonbase

	let targetProvider = new ethers.providers.JsonRpcProvider(targetNetwork.rpc);
	const targetTokenBridgeWithoutSigner = new ethers.Contract(targetNetwork.tokenBridgeAddress, TokenBridgeApi.abi, targetProvider);

	const bridgeAmt = `${Number(amount) * 1e18}`;
	const targetRecepient = Buffer.from(tryNativeToHexString(Recipient, "ethereum"), "hex");

	let wrappedTokenAddress = await targetTokenBridgeWithoutSigner.wrappedAsset(FromNetwork.wormholeChainId, Buffer.from(tryNativeToHexString(FromNetwork.testToken, "ethereum"), "hex"));
	let targetTokenBridge;
	let targetSigner;
	if (wrappedTokenAddress === null || (wrappedTokenAddress === "0x0000000000000000000000000000000000000000") || (wrappedTokenAddress === undefined)) {
		ShowAlert("error", `Found no Wrapped Token Address. Creating a new wrapped Token...`);
		const CreateTokentx = await attestFromEth(
			FromNetwork.tokenBridgeAddress,
			signer,
			FromNetwork.testToken //Default Test Token Address
		);
		ShowAlert("success", `Attested a new Wrapped Token!`);

		const emitterAddrToken = getEmitterAddressEth(FromNetwork.tokenBridgeAddress);
		const seqToken = parseSequenceFromLogEth(CreateTokentx, FromNetwork.bridgeAddress); //Core Bridge
		const vaaURLToken = `${config.wormhole.restAddress}/v1/signed_vaa/${FromNetwork.wormholeChainId}/${emitterAddrToken}/${seqToken}`;
		let vaaBytesToken = await (await fetch(vaaURLToken)).json();
		console.log({
			type: "Token",
			emitterAddr: emitterAddrToken,
			seq: seqToken,
			link: vaaURLToken,
			vaaBytes: vaaBytesToken
		});
		ShowAlert("pending", `Creating a Wrapped Token on Moonbase Alpha Chain...`);

		while (!vaaBytesToken.vaaBytes) {
			console.log("VAA not found, retrying in 5s!");
			await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
			vaaBytesToken = await (await fetch(vaaURLToken)).json();
		}
		ShowAlert("pending", `Please confirm on Metamask popup...`);

		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "0x507" }] //1287
		});

		targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
		targetTokenBridge = new ethers.Contract(targetNetwork.tokenBridgeAddress, TokenBridgeApi.abi, targetSigner);

		await (await targetTokenBridge.createWrapped(Buffer.from(vaaBytesToken.vaaBytes, "base64"))).wait();
		wrappedTokenAddress = await targetTokenBridge.wrappedAsset(FromNetwork.wormholeChainId, Buffer.from(tryNativeToHexString(FromNetwork.testToken, "ethereum"), "hex"));
		ShowAlert("success", `Created a Wrapped Token. Address: ${wrappedTokenAddress}`);
	} else {
		ShowAlert("success", `Using Wrapped Token Address: ${wrappedTokenAddress}`);
	}

	// ShowAlert("pending", `Please Confirm on Metamask Popup for Approve and Allownece...`)
	// const Approvetx1 = await USDTtoken.approve(network.tokenBridgeAddress, bridgeAmt)
	// await Approvetx1.wait()
	// const Allowencetx1 = await USDTtoken.increaseAllowance(network.tokenBridgeAddress, ethers.utils.parseUnits("1000", "18"))
	// await Allowencetx1.wait()
	// ShowAlert("success", `Aprroved Aprroving and Allowence!`)

	await window.ethereum.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: FromNetwork.hex.toString() }] //From Chain
	});
	ShowAlert("pending", `Wrapping and Sending amount to Moonbase Token Bridge...`);
	const tx = await (
		await FromContract.wrapAndTransferETH(targetNetwork.wormholeChainId, targetRecepient, 0, Math.floor(Math.random() * 1000000), {
			value: bridgeAmt
		})
	).wait();

	const emitterAddr = getEmitterAddressEth(FromNetwork.tokenBridgeAddress);
	const seq = parseSequenceFromLogEth(tx, FromNetwork.bridgeAddress); //Core Bridge
	const vaaURL = `${config.wormhole.restAddress}/v1/signed_vaa/${FromNetwork.wormholeChainId}/${emitterAddr}/${seq}`;
	let vaaBytes = {}
	try {
		vaaBytes = await (await fetch(vaaURL)).json();

	} catch (e) { }
	while (!vaaBytes.vaaBytes) {
		try {
			console.log("VAA not found, retrying in 5s!");
			await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
			vaaBytes = await (await fetch(vaaURL)).json();
		} catch (e) { }

	}
	ShowAlert("success", `Wrapped and Sent to Moonbase Token Bridge!`);

	targetSigner = new ethers.Wallet(targetNetwork.privateKey).connect(new ethers.providers.JsonRpcProvider(targetNetwork.rpc));
	targetTokenBridge = new ethers.Contract(targetNetwork.tokenBridgeAddress, TokenBridgeApi.abi, targetSigner);

	ShowAlert("pending", `Completing Transfer...`);
	const completeTransferTx = await (await targetTokenBridge.completeTransfer(Buffer.from(vaaBytes.vaaBytes, "base64"))).wait();
	ShowAlert("success", `Successfully sent ${amount} ${FromNetwork.nativeCurrency.symbol} to ${Recipient}! `);

	return {
		transaction: `https://moonbase.moonscan.io/tx/${completeTransferTx.transactionHash}`,
		wrappedAsset: wrappedTokenAddress
	};
}