var demoData = {
    nodes: [
      { id: "1000", label: "112222333", type: "weixin", style: {} },
      {
        id: "3000",
        label: "6554778",
        type: "douyin",
        properties: { date: "2022-12-10" },
      },
    ],
    links: [
      {
        id: "e-60",
        source: 3000,
        target: 1000,
        type: "vitual",
        label: "授权登录",
        style: { strokeColor: "220,20,20" },
      },
    ],
  };
  
  var ownDemoData2 = {
      nodes: [
          {
              id: "1",
              label: "Metaverse",//eng name
              //color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "A metaverse can be any 3D virtual space powered by technologies – including virtual reality (VR), augmented reality (AR), artificial intelligence (AI), the Internet of Things (IoT), and blockchain – that allows people to interact with each other (and in some cases, with non-human avatars",
          },
           {
              id: "2",
              label: "Web3.0",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              borderWidth:20,
              x: 11,// random
              y: 12,
              content: "Web 3.0 means immersing yourself in the digital experience, and it involves concepts like individual control of personal data, cryptocurrency, and decentralized record keeping on the blockchain.",
          },
           {
              id: "3",
              label: "Blockchain",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              borderWidth:20,
              x: 11,// random
              y: 12,
              content: "A blockchain is a distributed ledger with growing lists of records (blocks) that are securely linked together via cryptographic hashes.",
          },
          {
              id: "4",
              label: "Layer1",//eng name
              // color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "Layer 1 refers to a base network, such as Bitcoin, BNB Chain, or Ethereum, and its underlying infrastructure.",
          },
          {
              id: "5",
              label: "Layer2",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              borderWidth:20,
              x: 11,// random
              y: 12,
              content: "A layer 2 is any off-chain network, system, or technology built on top of a blockchain to help extend its capabilities.",
          },
          {
              id: "6",
              label: "Zero-knowledge Proof",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              borderWidth:20,
              x: 11,// random
              y: 12,
              content: "A zero-knowledge proof is a method by which one party (the prover) can prove to another party (the verifier) that a given statement is true, while avoiding conveying to the verifier any information beyond the mere fact of the statement's truth.",
          },
          {
              id: "7",
              label: "Algebraic structure",//eng name
              //color: "255,153,0",
              x: 11,// random
              y: 12,
              content: "An algebraic structure in a variety may be understood as the quotient algebra of term algebra (also called absolutely free algebra) divided by the equivalence relations generated by a set of identities.",
          },
          {
              id: "8",
              label: "Groth16",//eng name
              // color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "An evergreen from the era of R1CS with extensive and widely used tooling such as bellman, zokrates and circom. ",
          },
          {
              id: "9",
              label: "zk-Snark",//eng name
              // color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "The acronym zk-SNARK stands for Zero-Knowledge Succinct Non-Interactive Argument of Knowledge and refers to a proof construction where one can prove possession of certain information, e.g.",
          },
          {
              id: "10",
              label: "Taiko",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              borderWidth:20,
              x: 11,// random
              y: 12,
              content: "A Type 1 ZK-EVM Decentralized, Ethereum-equivalent ZK-Rollup.",
          },
          {
              id: "11",
              label: "Algebraic structure",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              borderWidth:20,
              x: 11,// random
              y: 12,
              content: "An algebraic structure in a variety may be understood as the quotient algebra of term algebra (also called absolutely free algebra) divided by the equivalence relations generated by a set of identities.",
          },
          {
              id: "12",
              label: "Groth16",//eng name
              borderWidth:20,
              // color: "83,168,255",
              borderColor:"255,153,0",
              x: 11,// random
              y: 12,
              content: "An evergreen from the era of R1CS with extensive and widely used tooling such as bellman, zokrates and circom. ",
          },
          {
              id: "13",
              borderWidth:20,
              label: "zk-Snark",//eng name
              // color: "83,168,255",
              borderColor:"255,153,0",
              x: 11,// random
              y: 12,
              content: "The acronym zk-SNARK stands for Zero-Knowledge Succinct Non-Interactive Argument of Knowledge and refers to a proof construction where one can prove possession of certain information, e.g.",
          },
          {
              id: "14",
              label: "Taiko",//eng name
              // color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "A Type 1 ZK-EVM Decentralized, Ethereum-equivalent ZK-Rollup.",
          },
          {
              id: "15",
              label: "Groth16",//eng name
              // color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "An evergreen from the era of R1CS with extensive and widely used tooling such as bellman, zokrates and circom. ",
          },
          {
              id: "16",
              label: "zk-Snark",//eng name
              // color: "83,168,255",
              x: 11,// random
              y: 12,
              content: "The acronym zk-SNARK stands for Zero-Knowledge Succinct Non-Interactive Argument of Knowledge and refers to a proof construction where one can prove possession of certain information, e.g.",
          },
      ],
      links:[//键和值之间是冒号
          {
              source: "1",// one of id,
              target: "3",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "2",// one of id,
              target: "3",
              color:"255,153,0",
              style: {
                  lineWidth: 10,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "3",// one of id,
              target: "4",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "3",// one of id,
              target: "5",
              color:"255,153,0",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "5",// one of id,
              target: "6",
              lineWidth: 4,//
              color:"255,153,0",
              // lineDash: [1, 800],
              lineType:'hlink',// 没用
              arrowType:'triangle',// 没用
              style: {
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "6",// one of id,
              target: "7",
              style: {
                  lineWidth: 4,//
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "6",// one of id,
              target: "8",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "6",// one of id,
              target: "9",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "6",// one of id,
              target: "10",
              color:"255,153,0",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "7",// one of id,
              target: "15",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "15",// one of id,
              target: "16",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "16",// one of id,
              target: "14",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "10",// one of id,
              target: "13",
              color:"255,153,0",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "13",// one of id,
              target: "12",
              color:"255,153,0",
              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
          {
              source: "12",// one of id,
              target: "11",
              color:"255,153,0",

              style: {
                  lineWidth: 4,//
                  lineDash: [5, 8],
                  fontColor:'250,250,250',//节点字体颜色
                  font:'20px yehei',
              }
  
          },
      ]
  }
  
  export {ownDemoData2}