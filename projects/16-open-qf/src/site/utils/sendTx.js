import { noop } from "lodash-es";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "../store/reducers/toastSlice";
import { PROJECT_NAME } from "./constants";

export async function getSigner(signerAddress) {
  const { web3Enable, web3FromAddress } = await import(
    "@polkadot/extension-dapp"
  );

  await web3Enable(PROJECT_NAME);
  const injector = await web3FromAddress(signerAddress);
  return injector.signer;
}

export function getDispatchError(dispatchError) {
  let message = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch (error) {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

export async function sendTx({
  api,
  tx,
  dispatch,
  setLoading = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onClose = noop,
  signerAddress,
  section: sectionName,
  method: methodName,
}) {
  const noWaitForFinalized = onFinalized === noop;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  const signer = await getSigner(signerAddress);
  api?.setSigner(signer);

  try {
    setLoading(true);

    const account = await api.query.system.account(signerAddress);

    let blockHash = null;
    const unsub = await tx.signAndSend(
      signerAddress,
      { nonce: account.nonce },
      ({ events = [], status }) => {
        if (status.isFinalized) {
          dispatch(removeToast(toastId));
          onFinalized(blockHash);
          unsub();
        }

        if (status.isInBlock) {
          setLoading(false);
          blockHash = status.asInBlock.toString();

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section === "proxy" && method === "ProxyExecuted") {
              const [result] = data;
              if (result.isErr) {
                const message = getDispatchError(result.asErr);
                dispatch(removeToast(toastId));
                dispatch(newErrorToast(`Extrinsic failed: ${message}`));
                unsub();
                return;
              }
            }

            if (section === "system" && method === "ExtrinsicFailed") {
              const [dispatchError] = data;
              const message = getDispatchError(dispatchError);
              dispatch(removeToast(toastId));
              dispatch(newErrorToast(`Extrinsic failed: ${message}`));
              unsub();
              return;
            }
          }

          if (noWaitForFinalized) {
            unsub();
            dispatch(removeToast(toastId));
          } else {
            dispatch(
              updatePendingToast(
                toastId,
                `(3/${totalSteps}) Inblock, waiting for finalization...`,
              ),
            );
          }

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section !== sectionName || method !== methodName) {
              continue;
            }
            const eventData = data.toJSON();
            onInBlock(eventData);
            break;
          }

          if (!sectionName || !methodName) {
            onInBlock();
          }
        }
      },
    );

    dispatch(
      updatePendingToast(
        toastId,
        `(2/${totalSteps}) Submitted, waiting for wrapping...`,
      ),
    );
    onSubmitted(signerAddress);
    onClose();
  } catch (e) {
    dispatch(removeToast(toastId));
    setLoading(false);

    dispatch(newErrorToast(e.message));
  }
}
