# pv-solar-energy-tracking-system

This repository contains BE part of DAPP for renewable energy trading platform on Polkadot ecosystem.

# Idea

Using our project it is possible to connect individual power generation source (e.g. solar panel) to [Robonomics](https://robonomics.network/) network (one of [Polkadot](https://polkadot.network/) parachain). Information about produced power will be added to Robonomics parachain and shared with Westmint(from [Westend](https://polkadot.network/blog/westend-introducing-a-new-testnet-for-polkadot-and-kusama/) test newtork) parachain. Also we can use Statemine or Statemint parachains for the same purpouse.

Generated energy will be tracked using special NFT collection (ID [482](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwestmint-rpc.dwellir.com#/nfts) on Westmint parachain). In this case NFT item is used to represent some amount of energy which provider want to sell.

# Use cases

For example, individual solar panel which was connected to Robonomics network produced 1MW of PV soalr energy and write this data to Robonomics blockchain. After that, automatically, new NFT item will be created. This item will contain information about amount of generated energy, owner account address on Westend networks where owner wants to receive tokens after this energy will be sold to other users and price in [PVSE tokens](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwestmint-rpc.dwellir.com#/assets) (ID 482) for that produced energy.
As a token, we use custom PVSE token on Westmint parachain. So, when energy which is represented by NFT item will be sold, owner will receive reward in PVSE tokens on account address which was added to NFT metadata.

So, usage scenario is very simple:
1. Connect device which produve renewable energy to Robonomics networks;
2. Provice address where you want to receive reward for generated energy;
3. NFT will be generated automatically and send to specified owner account;
4. After energy will be sold, owner will receive PVSE tokens to his/her account on Westmint parachain;

# Repository structure

This repository contains two parts:

* Power generator simulator (hardware device which is connected to Robonomics networks and sends data about generated energy for sale). See `plug_device.py` and `config/config_service.template.yaml` config file;
* Service part which gather data from Digital twin and connected devices to Robonomics networks and track amount of produced energy for sale. This part takes care of NFTs creation and paying tokens to providers for generated energy when it will be sold on auction. See  `service.py` and `config_station_.template.yaml` config file;

Also there is some common model class `pv_station.py` which represents data which is used during power generation/selling information exchange.

# How to run

To make it work we need to conect both components togeter.

## Robonomics and Westmint connection

For now there is no way to get some tokens for testing on Robonomics network, so we running Robonomics node locally.

**Note**: after we have tokens for Robonomics networks, we will configure it and it will be much easier to run it.

To run Robonomics node locally please check this [tutorial](https://wiki.robonomics.network/docs/en/run-dev-node/).

After you have local node runing you need to proceed with next steps to connect power device. To simulate data from real hardware we use `plug_device.py` script, which works as simulator for power generation data.

So, to be simple with device plug part:
1. Run robonomics node locally;
2. Create `service` account on robonomics node (connect to it using [Polkadot js extension](https://polkadot.js.org/apps));
3. Using created account (do not forget to send XRT tokens to it from predefined test accounts) create DigitalTwin using extrinsics (see this [tutorial](https://wiki.robonomics.network/docs/en/digital-twins/));
3. Fill in all the details into `config/config_station_.template.yaml`;
4. For power simulation data you need to use one of file under `test/` folder. Use existing config or create your own with the same structure;
5. Start `service.py` (default ocnfiguration file `config/config_service.yaml`, do not forget to fill in required data and create account for plugged device on Westmint oarachain where reward for sold energy will be transfered, also to mint new NFT you need to use our admin account which is the owner of NFT collection)
```
python service.py
```
6. Start `plug_device.py` with parameters (e.g.):
```
python plug.py --yaml-station-data test/station_1.yaml --station-config config/config_station_1.yaml
```
- **Note** If you didn't provide seed phrase new account will be created, in log messages you will find it address and messages that tokens are required. To proceed, send tokens from predefined account to that address, after that program execution will continue.

## Flow

> Part 1

When `plug_device` will add some data (about generated energy, it's price and owner address to receive reward) to datalogs on Robonomics networks, `service part` will get them and create new NFT item from collection (ID 482) with information (as metadata) which was send by `plug_device`. NFT will be minted to address (on Westmint parachain) which `plug_device` sent.

> Part 2

On next steps we expect that another part of the whole decentralized trading paltform will parse data about existing NFT items (in general, NFT item represent amount of generated energy which is ready to be sold and contains information how it costs and how to pay to owner of generated energy). After energy sold,  Part 1 will received information about it and NFT item will be burned and PVSE tokens will be transfered to owner account.

# Future development

This application will be a bridge which connects decentrlized platform for energy trading. Another part of the whole application - it is a DApp auction for energy trading (includeing web part for providers/consumers) on NEAR blockchain. So, we creating bridge between NEAR and Polkadot ecosystem for decentralized energy trading.
