# Polka Finance

# Project Description

Polka Finance is a pioneering endeavor that redefines the landscape of sustainable finance by seamlessly integrating robotics and decentralized finance (DeFi). Inspired by the need for an epistemological shift in the post-industrial era, the project envisions building economic and financial systems grounded in a sustainability-oriented approach. As a facet of the larger Robonomics initiative, it demonstrates the potential of establishing a digital trustless environment for economic interactions among robots.

The project focuses on two service robots, Robot Werther and Robot Alice, engaging in diverse commercial services, from delivery to repair and charging. Robot Werther, with its solar power plant, not only provides services but also generates clean electricity, subsequently tokenized as Energy Attribute Certificates (EACs) on the Polkadot parachain. These certificates are traded on the EAC marketplace, operating on the NEAR protocol.

It's intricate architecture comprises four key components: data collection from power suppliers, tokenization of electricity, an NEAR-based marketplace for EAC trading, and a custom bridge linking Polkadot and NEAR. The team faced challenges, notably the absence of existing bridges, leading to the development of a custom HTTP API service for data synchronization.

Amidst these challenges, Polka Finance accomplished significant milestones, creating custom tokens and NFT collections, illustrating blockchain's potential in digitizing real-world electricity data. Practical application included connecting a solar panel at the Singapore Institute of Technology to the Robonomics parachain for live data collection.

Engaging with the Polkadot ecosystem provided invaluable insights, with workshops covering general overviews, Substrate, Robonomics, and Subxt, offering an enriched understanding of decentralized application development.

Looking ahead, Polka Finance plans to submit the project for a Polkadot-NEAR cross-chain bridge under the Web3 grant program. Future iterations involve migrating to support the Statemint Parachain for tokenizing green assets and enhancing collaborations with the Singapore Institute of Technology for advanced data management services in the energy sector. Mid-term goals include implementing it in the commercial E-Mobility domain, where electric vehicles act as autonomous economic agents, offsetting carbon footprints through tokenized green assets like I-RECs and Carbon Credits. The project is built with various technologies, including MQTT, Polkadot, Python, Robonomics, Rust, Substrate, Subxt, and Westmint.

# [Demo Video Link](https://youtu.be/OXekuUa1b98)

# [Project Submission](https://dorahacks.io/buidl/8318)

API REST Server for energy NFTs (ID 482) access (part of trading system) using Rocket.rs
--------------------------------

---
## Table of Contents

- [Table of Contents](#table-of-contents)
- [Compile](#compile)
- [Starting the server](#starting-the-server)
- [Available endpoints](#available-endpoints)
- [GET Response for `get NFTs for sale`](#get-response-for-get-nfts-for-sale)
- [POST Request for `notify NFT sell`](#post-request-for-notify-nft-sell)
- [Data storage](#data-storage)
- [Configs (Optional)](#configs-optional)
- [Contribution](#contribution)

---
## Compile

```bash
cargo build --release
```

- Sample config file is available at `config.yml`. This file contains server configuration options (ip, port, etc..). This file should be modified when deploying server.

## Starting the server
```bash
./target/release/energy_trading_api --config config.sample.yml
```

## Available endpoints

- Index/User management endpoint

| Description | Endpoint | Method |
| --- | --- | --- |
| Get NFTs for sale | `/nft/for_sale` | GET |
| Notify NFT sell | `/nft/sell` | POST |

### GET Response for `get NFTs for sale`
The below example shows response example of GET request after getting information about NFT items for sell. 
```
[
    {
        "metadata": {
            "owner_addr": "5HeU86WzssYJADnsyoPuBBVHXtbXi5hs3Cy3AT6cdmFUXBaA",
            "power_mw": 1.0,
            "price_pvse": 1
        },
        "storage_key": "5e8a19e3cd1b7c148b33880c479c02819a8dc5b2c03b70e90784d1e13305014605ee68f3e1f6ace547e5190191b46e33e2010000b8cdf6bb17b1d4fd3930f69805cb84ddae000000"
    },
    {
        "metadata": {
            "owner_addr": "5HeU86WzssYJADnsyoPuBBVHXtbXi5hs3Cy3AT6cdmFUXBaA",
            "power_mw": 1.0,
            "price_pvse": 1
        },
        "storage_key": "5e8a19e3cd1b7c148b33880c479c02819a8dc5b2c03b70e90784d1e13305014605ee68f3e1f6ace547e5190191b46e33e2010000e0b95d33f605e3191432da30759e96b357020000"
    },
    {
        "metadata": {
            "owner_addr": "5HeU86WzssYJADnsyoPuBBVHXtbXi5hs3Cy3AT6cdmFUXBaA",
            "power_mw": 3.0,
            "price_pvse": 3
        },
        "storage_key": "5e8a19e3cd1b7c148b33880c479c02819a8dc5b2c03b70e90784d1e13305014605ee68f3e1f6ace547e5190191b46e33e20100001f5567485266c630261fd69d4509f64f8a020000"
    }
]
```

### POST Request for `notify NFT sell`
The below example goes into json body of POST request while sending information about NFT sell. 
```
{
  "storage_key": "<existing NFT storage_key>"
}
```
## Data storage

Under the hood we use [subxt](https://github.com/paritytech/subxt) libraru to communicate with Westmint parachain. Information about available NFT items for sell is stored under `data` folder.

- `data/fetched` - information about NFTs which was fetched from Westming;
- `data/processed` - information about NFTs which was received by some endpoint using GET request;

Once endpoint get data using GET request - items from `fetched` folder will be moved to `processed`. Also we will not load NFT items to `fetched` folder if they have alredy been processed (exists in `processed folder`).


## Configs (Optional)

The `configs` folder has configurations to start the server as a service and nginx config to server this energy_trading_api server in reverse proxy mode.
- Start the energy_trading_api server as a service
```text
1) copy the configs/energy_trading_api.service to /etc/systemd/system folder
2) systemctl enable energy_trading_api
3) systemctl start energy_trading_api
```

- Then you can copy the `configs/nginx.vhost` to `/etc/nginx/sites-enabled` to access the energy_trading_api server via nginx.

---

