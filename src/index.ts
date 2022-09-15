import { AuthData, Environment, ItemService, UserService } from "@meeco/sdk";
import configuration from "../config.json";

// configureFetch(window.fetch);
function getConfig(
  vaultUrl: string,
  keystoreUrl: string,
  subscriptionKey: string
) {
  return new Environment({
    vault: {
      url: vaultUrl,
      subscription_key: subscriptionKey,
    },
    keystore: {
      url: keystoreUrl,
      subscription_key: subscriptionKey,
      provider_api_key: "",
    },
  });
}

async function getAuthData(
  config: Environment,
  passphrase: string,
  secret: string
) {
  return new UserService(config).getAuthData(passphrase, secret);
}

async function getItems(config: Environment, authData: AuthData) {
  try {
    const items = await new ItemService(config).listDecrypted(authData);

    type slot = {
      attribute: string;
      value: string;
      type: string;
    };

    type item = {
      label: string;
      tags: string[];
      slots: slot[];
    };

    const result: item[] = items.items.map((item) => {
      return {
        label: item.label,
        tags: item.classification_nodes.map((cn) => cn.name),
        slots: item.slots.map((s) => {
          return {
            attribute: s.label,
            value: s.value || "",
            type: s.slot_type_name.toString(),
          };
        }),
      };
    });

    return result;
  } catch (error) {
    console.error(error);
  }
}

// configure and get items
const vaultUrl = configuration.vaultUrl;
const keystoreUrl = configuration.keystoreUrl;
const subscriptionKey = configuration.subscriptionKey;
const config = getConfig(vaultUrl, keystoreUrl, subscriptionKey);

const passphrase = configuration.passphrase;
const secret = configuration.secret;

const IS_NODE =
  typeof global === "object" &&
  "[object global]" === global.toString.call(global);
const IS_BROWSER =
  typeof window === "object" &&
  "[object Window]" === window.toString.call(window);

getAuthData(config, passphrase, secret).then((authData) => {
  getItems(config, authData).then((result) => {
    if (IS_NODE) {
      console.log(JSON.stringify(result, null, 4));
    } else if (IS_BROWSER) {
      document!.getElementById("items")!.innerText = JSON.stringify(
        result,
        null,
        2
      );
    }
  });
});
