// (C) 2020-2022 GoodData Corporation
import { ILiveFeatures } from "@gooddata/api-client-tiger";
import axios, { AxiosResponse } from "axios";

import { ITigerFeatureFlags } from "../uiFeatures";
import { FeatureDef, FeaturesMap, mapFeatures } from "./feature";

type HubServiceState = Record<
    string,
    {
        etag: string;
        data: FeatureHubResponse;
    }
>;

const state: HubServiceState = {};

export async function getFeatureHubFeatures(
    features: ILiveFeatures["live"],
): Promise<Partial<ITigerFeatureFlags>> {
    const { configuration, context } = features;
    try {
        const data = await loadHubFeatures(configuration, state);
        const featuresMap = data.reduce((prev, item) => ({ ...prev, [item.key]: item }), {} as FeaturesMap);
        return mapFeatures(featuresMap, context);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Loading features from FeatureHub was not successful. Err: " + err);
        return {};
    }
}

//NOTE: Use FeatureHub SDK after we upgrade version of typescript
// - more info in ticket RAIL-4279
async function loadHubFeatures(
    configuration: ILiveFeatures["live"]["configuration"],
    state: HubServiceState,
): Promise<FeatureHubResponse[number]["features"]> {
    const { host, key } = configuration;

    return new Promise((resolve, reject) => {
        function callFailed() {
            delete state[key];
            reject(new Error(`FeatureHub is not ready, is not available or api key is wrong.`));
        }

        const promise = getFeatureHubData(host, key, state[key]);
        promise.then(({ data, headers, status }) => {
            if (status === 304) {
                loadFeatures(state[key].data, resolve, callFailed);
                return;
            }

            state[key] = {
                etag: headers["etag"],
                data: data || [],
            };
            loadFeatures(data, resolve, callFailed);
        });
        promise.catch(callFailed);
    });
}

function loadFeatures(
    data: FeatureHubResponse,
    resolveFn: (features: FeatureHubResponse[number]["features"]) => void,
    errFn: () => void,
) {
    const record = data[data.length - 1];
    if (record) {
        resolveFn(record.features);
        return;
    }
    errFn();
}

//NOTE: Types from https://docs.featurehub.io/featurehub/latest/sdks-development.html
export type FeatureHubResponse = {
    id: string;
    features: FeatureDef[];
}[];

async function getFeatureHubData(
    host: string,
    key: string,
    state?: HubServiceState[string],
): Promise<AxiosResponse<FeatureHubResponse>> {
    return axios.get("/features", {
        method: "GET",
        baseURL: host,
        params: {
            sdkUrl: key,
        },
        headers: {
            "Content-type": "application/json",
            ...(state ? { "if-none-match": state.etag } : {}),
        },
        validateStatus: (status) => {
            return (status >= 200 && status < 300) || status === 304;
        },
    });
}