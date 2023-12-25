export const chains = {
  KSM: {
    rpc: 'wss://kusama-rpc.polkadot.io',
    icon: 'https://polkadot.js.org/apps/static/kusama-128.e5f13822..gif',
  },
  DOT: {
    rpc: 'wss://polkadot-rpc.dwellir.com',
    icon: 'https://polkadot.js.org/apps/static/polkadot-circle.1eea41b2..svg',
  },
  SOON: {
    rpc: 'wss://rco-para.subsocial.network',
    icon: 'https://polkadot.js.org/apps/static/subsocialX.a4cdc4e5..svg',
  },
  SUB: {
    rpc: 'wss://para.subsocial.network',
    icon: 'https://polkadot.js.org/apps/static/subsocialX.a4cdc4e5..svg',
  },
  KAR: {
    rpc: 'wss://karura-rpc-0.aca-api.network',
    icon: 'https://polkadot.js.org/apps/static/karura.6540c949..svg',
  },
  ACA: {
    rpc: 'wss://acala.polkawallet.io',
    icon: 'https://polkadot.js.org/apps/static/acala.696aa448..svg',
  },
  KILT: {
    rpc: 'wss://kilt-rpc.dwellir.com',
    icon: 'https://polkadot.js.org/apps/static/kilt.de41d252..png',
  },
  AIR: {
    rpc: 'wss://fullnode.altair.centrifuge.io',
    icon: 'https://polkadot.js.org/apps/static/altair.6f2c8a06..svg',
  },
}

export type TokenTickers = keyof typeof chains
