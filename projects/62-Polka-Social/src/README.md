# Polka Social

# Team Member

Shivam Agarwal

# Project Description

Polka Social is a decentralized forum built on the Substrate framework, aiming to connect Substrate developers and facilitate collaboration. The platform stores all posts, replies, and answers on IPFS and the Subsocial Parachain, ensuring that connections made within the platform are portable to other social apps built on top of Subsocial. Additionally, Polka Social enables easy tipping of helpful individuals within the community. The project was developed using Next.js with TypeScript, with web3 interactions facilitated by the Subsocial SDK and wallet connections established through Talisman Connect. Furthermore, an indexing service provided by Subquery was utilized for the reputation system. Throughout the development process, the team encountered challenges, particularly in connecting to parachains and learning the Subsocial SDK and wallet connections. Additionally, running the indexing service presented difficulties due to limited experience with infrastructure like AWS, EC2, and Docker. Despite these challenges, the team achieved significant milestones, including successfully connecting the Subsocial SDK and Polkadot API within React Query with full TypeScript support. This allowed for efficient development in terms of caching, data retrieval, mutation, and query invalidation. Furthermore, the team managed to run an EC2 server for the Subquery indexing service, establishing a functioning reputation system on the main website. The project provided valuable learning experiences, including connecting to the Polkadot API with RPCs, utilizing Talisman for wallet connections, and interacting with the Subsocial chain using the SDK. Additionally, the team gained insights into AWS EC2, Docker, and networking management. Unrelated to web3, the team also learned about Slate, a customizable textarea. Looking ahead, the team envisions implementing several features that were not completed due to time constraints, such as server-side rendering for improved SEO, a more robust reputation system, and enhanced content filtering through connections to Subsocial offchain. Additionally, the team plans to expand the tipping list, improve responsive design, and enhance text area customization and features. The project was built with Next.js, Polkadot-js, Subquery, Subsocial, Subsocial-sdk, Talisman, and TypeScript.

# [Demo Video Link](https://youtu.be/3k8KESo68CI)

# [Demo Link](https://substrate-stackexchange.vercel.app/)

## Summary

This project is a forum for developers Q&A regarding substrate development.
The fact that this one uses Subsocial SDK, making it decentralized and all the posts and interactions are saved in blockchain and IPFS.


# Try it out

This project is served at [Live](https://substrate-stackexchange.vercel.app/)
The indexing service is served at [https://108.136.47.177/](https://108.136.47.177/)
Note: to enable the reputation feature, as the indexing service is served with self-signed certificate, you need to allow it in your browser by enabling [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost).

## How to Run

1. Setup Env Variables.
2. Run script below.

```zsh
$ npm run dev
```

## Env Variables

1. ANALYZE = true/false
   Acts as bundle visualizer to detect large sizes in build.
2. NEXT_PUBLIC_USE_TESTNET = true/false
   To toggle between mainnet and testnet RPCs
3. NEXT_PUBLIC_SPACE_ID = number
   This is the `space id` used for the project. All posts are made to that specific space.
   If you didn't have any space before, you can create one in /devs/space page after you run the project.
4. NEXT_PUBLIC_ADDRESS_PREFIX = number
   This is the address prefix that is needed for polkadot based address. Each parachain has their own address prefix.
   This prefix is what made your polkadot address in each parachain different, while having the same private key.
   e.g. Subsocial has prefix of 28.
