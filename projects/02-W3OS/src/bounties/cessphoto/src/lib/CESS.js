import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { Keyring } from '@polkadot/keyring';
const { Bucket, Space, InitAPI, Common, File, testnetConfig, wellKnownAcct } = require("cess-js-sdk");
testnetConfig.nodeURL = "wss://testnet-rpc2.cess.cloud/ws/";
const { api, keyring } = await InitAPI();

function getDataIfOk(result) {
    return result.msg === "ok" ? result.data : result;
}

const CESS = {
    getAddress: async () => {
        // this call fires up the authorization popup
        const extensions = await web3Enable('CESS');

        if (extensions.length === 0) {
            // no extension installed, or the user did not accept the authorization
            // in this case we should inform the use and give a link to the extension
            alert("Please install Polkadot.js Extension");
            return wellKnownAcct.addr;
        }

        // we are now informed that the user has at least one extension and that we
        // will be able to show and use accounts
        const accounts = await web3Accounts();
        let addr = accounts[0].address;

        // Transform address to CESS style
        const keyring = new Keyring({ type: "sr25519", ss58Format: 11330 });
        const pair = keyring.addFromAddress(addr);
        addr = pair.address;
        return addr;
    },
    
    getAccountInfo: async () => {
        const addr = await CESS.getAddress();
        const common = new Common(api, keyring);
        const space = new Space(api, keyring);
        console.log("query userOwnedSpace:");
        let result = await space.userOwnedSpace(addr);
        const blockHeight = await common.queryBlockHeight();

        result = common.formatSpaceInfo(result.data, blockHeight);
        result["address"] = addr;
        console.log(result);
        return result;
    },

    // Query bucket list
    listBuckets: async () => {
        const addr = await CESS.getAddress();
        const oss = new Bucket(api, keyring, true);
        console.log("queryBucketList:");
        let bucketList = await oss.queryBucketList(addr).then((res) => {
            console.log(getDataIfOk(res));
            return getDataIfOk(res);
        });
        return bucketList;
        /*
        [
            {
                "objectList": [
                    "f1e3ff049a01e356cc3f03d821c2ff60da5db54d2e0b3490fd1e59c57cfdfad8"
                ],
                "key": "test1-1"
            },
            {
                "objectList": [],
                "key": "test3-31"
            },
        ]
        */
    },

    // list images from bucket
    getBucketItems: async (bucketName) => {
        const addr = await CESS.getAddress();
        const oss = new File(api, keyring, testnetConfig.gatewayURL);
        let result = await oss.queryFileListFull(addr);
        result = getDataIfOk(result);
        return result.filter((item) => item.bucketName === bucketName);
    },

    //get the target file by hash
    download: async (hash, filename) => {
        const oss = new File(api, keyring, testnetConfig.gatewayURL);
        const result = await oss.downloadFile(hash, filename);
        console.log(result.msg === "ok" ? result.data : result);
    },

    //upload new image file to bucket
    upload: async (bucketName, file) => {
        const addr = await CESS.getAddress();
        const oss = new File(api, keyring, testnetConfig.gatewayURL);
        const result = await oss.uploadFile(addr, addr, file, bucketName);
        console.log(getDataIfOk(result));
    },
}

export default CESS;