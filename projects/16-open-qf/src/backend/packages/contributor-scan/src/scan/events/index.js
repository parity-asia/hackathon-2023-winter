const { handleTransferEvent } = require("./transfer");

async function handleEvents(events = [], extrinsics = [], blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    }

    let extrinsic, extrinsicIndex;
    if (!phase.isNone) {
      extrinsicIndex = phase.value.toNumber();
      indexer = { ...indexer, extrinsicIndex };
      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleTransferEvent(event, indexer);
  }
}

module.exports = {
  handleEvents,
};
