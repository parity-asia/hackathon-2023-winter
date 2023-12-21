import clearTable from "./clear.handler";

// todo
export type BaseOperation = "add" | "remove" | "reset";

export interface Params {
  operation: string;
  data: {
    [key: string]: object;
  };
  payload: {
    ["id"]: number;
  };
}

export default async function handler({ operation, data = {}, payload }: Params) {
  const table = window.CACHE["messageChannel"];
  if (operation.startsWith("reset")) {
    clearTable("messageChannel");
    return;
  }
  switch (operation) {
    case "addChannelMsg":
    case "removeChannelMsg":
      {
        const { id } = payload;

        await table?.setItem(id + "", data[`${id}`]);
      }
      break;
    case "removeChannelSession":
      {
        const ids = Array.isArray(payload) ? payload : [payload];
        await Promise.all(
          ids.map(async (id) => {
            await table?.removeItem(id + "");
          })
        );
      }
      break;
    default:
      break;
  }
}
