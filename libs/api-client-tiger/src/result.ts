// (C) 2023 GoodData Corporation
import { AxiosInstance } from "axios";
import {
    ActionsApi,
    ActionsApiInterface,
    ActionsApiGetStagingUploadLocationRequest,
    StagingUploadLocation,
    ActionsApiAnalyzeCsvRequest,
    AnalyzeCsvResponse,
    AnalyzeCsvRequest,
    AnalyzeCsvRequestItem,
    AnalyzeCsvRequestItemConfig,
    ActionsApiImportCsvRequest,
    ImportCsvRequestTable,
    ImportCsvRequestTableSource,
    ImportCsvRequestTableSourceConfig,
} from "./generated/result-json-api/index.js";

export const tigerResultClientFactory = (axios: AxiosInstance): ActionsApiInterface =>
    new ActionsApi(undefined, "", axios);

export {
    ActionsApiInterface as ResultActionsApiInterface,
    ActionsApiGetStagingUploadLocationRequest,
    StagingUploadLocation,
    ActionsApiAnalyzeCsvRequest,
    AnalyzeCsvResponse,
    AnalyzeCsvRequest,
    AnalyzeCsvRequestItem,
    AnalyzeCsvRequestItemConfig,
    ActionsApiImportCsvRequest,
    ImportCsvRequestTable,
    ImportCsvRequestTableSource,
    ImportCsvRequestTableSourceConfig,
};
