## Basic Info

Project Name：W3OS

Date of project initiation: 2023/11

GitHub: https://github.com/ff13dfly/W3OS/

Live on:
- http://w3os.net/
- http://os.metanchor.net
- http://sayingfree.net

Demo Video: https://www.bilibili.com/video/BV1He411r7QJ/
## Project Introduction
W3OS: Web3.0 Operating System Based on Anchor Network

### Background
**What Problems Does W3OS Solve?**
- Users without any cryptocurrency cannot use Web3.0, which poses a significant barrier to Web3.0 adoption.
- On W3OS, there is no token requirement for users to access Dapps. 

### Overview
- W3OS is a Dapp store and an on-chain operating system. Similar to WeChat Mini Programs, which are hosted on Tencent's servers, W3OS operates on Anchor Network, backed by the Polkadot blockchain.
- W3OS is built upon Anchor Network, storing all Dapp code and data on-chain. Even W3OS itself is stored on the blockchain.
- Importantly, you can benefit from Web3.0 even without any cryptocurrency. Web3.0 accounts can be likened to mobile numbers, allowing you to connect with other users with just their SS58 account information.

For more detailed information, please visit the [W3OS PPT](docs/W3OS_Overview.pdf).

### Demo
Live on: http://w3os.net/

### What is Anchor Network?
- In this hackathon, We build W3OS from scratch, and it is a fresh new project built upon an existing pallet Anchor Network.
- Anchor Network is on-chain Linked List pallet and Name Service on Polkadot/Substrate, designed to facilitate developers in creating Dapps and enable regular users to seamlessly enter the Web3.0 ecosystem.
- Essentially, it operates as a Key-Value decentralized storage system. Developers can easily build Dapps on the network with just one day of learning.
- Anchor Network has received a W3F Grant; you can find more details [here](https://github.com/w3f/Grants-Program/pull/1528).

### Architecture
W3OS comprises four main components: **System**, **Account**, **Storage**, and **Dapps**.

1. The **System** of W3OS serves as the fundamental part for managing all functions, including APIs and services. APIs play a crucial role by providing stable version APIs for various networks.

2. **Account** is the cornerstone of the blockchain network on W3OS, and it offers some interesting features. Users can maintain anonymity through their SS58 accounts, and they can also manage their accounts as usual.

3. **Storage** functions are designed to assist both developers and customers in saving data on the Anchor network.

4. **Dapps**, or decentralized applications, are the end result. With the support of the components mentioned above, there are numerous ways to develop your fully on-chain applications, particularly colorful non-financial applications.

Thanks to the immutable features of blockchain, the entire W3OS can be deployed on the Anchor Network, even in a private setting.

![Architecture](docs/architecture.png)

### Initial Commit
https://github.com/ff13dfly/W3OS/ Starting from the first commit

## Tasks Planned for the Hackathon

### Account  

- New Account function. Create accounts with default Polkadot Mnemonic, encrypt account JSON locally. Easy login by selecting file and entering password.  

### Talking (IMGC)  

- Improves UX by auto-reconnecting on network issues  

#### Instant Messaging

- Basic W3OS function - click contacts to chat immediately. Unread message counts shown on avatars.
  
- Can chat to any SS58 account, strangers are listed separately from friends.

#### Group Chat  

- Create group by selecting members from contacts - can add forgotten people later.
  
- Chat by typing messages which get sent to all online group members. Offline messages held by server.
  
- Change group name - members get notified automatically.
  
- Change members - IMGC service handles notifications.  

- Transfer group manager role.

- Any member can leave voluntarily - others notified.  

- Manager can destroy group, removing data.

#### Payment Verification  

- SS58 accounts can be spoofed so verify via payment - IMGC requests specific payment then confirms transaction.
  
- Details stored on Anchor Network, services identify verified accounts. (Not implemented yet)

### Payment  

- Contacts have a "Pay to" button to send coins and see transaction history (not in official portals). 

- Verification payments also recorded.

### Contact  

- Add by SS58 address - [https://robohash.org](https://robohash.org) used for default avatars.

- Strangers messaging you get listed separately - can add them.

- Remove contacts in edit mode.

- Set custom names for contacts.
  
### Trend

- Major coin prices from [https://coincap.io/](https://coincap.io/) - entry point to future market functions.

### DApps  

- Input Anchor Names like `home`, `acala`, `playground` to load DApps.

### Bounties
**We develop all bounties**, since W3OS allows loading arbitary DApps.

- Acala: LDOT Token Dashboard https://github.com/doutv/lst-dashboard
- Bifrost & Moonbeam: https://github.com/doutv/lst-dashboard
- CESS: https://github.com/ff13dfly/cessphoto
- Gear Foundation: https://github.com/doutv/Gear-Five-in-a-Row
- Moonbeam: https://github.com/doutv/zk-sudoku
- Tanssi: https://github.com/doutv/anchor-tanssi

## 黑客松期间所完成的事项 (2023年12月22日上午11:59初审前提交)

- 2023年12月22日上午11:59前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间完成的开发工作及代码结构。我们将对这些目录/档案作重点技术评审。
- Demo 视频，ppt等大文件不要提交。可以在readme中存放它们的链接地址

## Team Info
傅忠强 (Fu Zhongqiang):
= Leader & Full-stack Developer, experienced in blockchain development.
- Author of Anchor Network.
- https://github.com/ff13dfly

Backdoor:
- Full-stack Developer with expertise in substrate and frontend development.
- https://github.com/doutv

