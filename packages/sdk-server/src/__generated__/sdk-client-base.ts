/* @generated by codegen. DO NOT EDIT BY HAND */

import {
  GrpcStatus,
  TurnkeyRequestError,
  ActivityResponse,
  TurnkeySDKClientConfig,
} from "../__types__/base";

import { VERSION } from "../__generated__/version";

import type * as SdkApiTypes from "./sdk_api_types";

export class TurnkeySDKClientBase {
  config: TurnkeySDKClientConfig;

  constructor(config: TurnkeySDKClientConfig) {
    this.config = config;
  }

  async request<TBodyType, TResponseType>(
    url: string,
    body: TBodyType
  ): Promise<TResponseType> {
    const fullUrl = this.config.apiBaseUrl + url;
    const stringifiedBody = JSON.stringify(body);
    const stamp = await this.config.stamper.stamp(stringifiedBody);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        [stamp.stampHeaderName]: stamp.stampHeaderValue,
        "X-Client-Version": VERSION,
      },
      body: stringifiedBody,
      redirect: "follow",
    });

    if (!response.ok) {
      let res: GrpcStatus;
      try {
        res = await response.json();
      } catch (_) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      throw new TurnkeyRequestError(res);
    }

    const data = await response.json();
    return data as TResponseType;
  }

  async command<TBodyType, TResponseType>(
    url: string,
    body: TBodyType,
    resultKey: string
  ): Promise<TResponseType> {
    const POLLING_DURATION = this.config.activityPoller?.duration ?? 1000;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const responseData = (await this.request<TBodyType, TResponseType>(
      url,
      body
    )) as ActivityResponse;
    const activityId = responseData["activity"]["id"];
    const activityStatus = responseData["activity"]["status"];

    if (activityStatus !== "ACTIVITY_STATUS_PENDING") {
      return {
        ...responseData["activity"]["result"][`${resultKey}`],
        activity: {
          id: activityId,
          status: activityStatus,
        },
      } as TResponseType;
    }

    const pollStatus = async (): Promise<TResponseType> => {
      const pollBody = { activityId: activityId };
      const pollData = (await this.getActivity(pollBody)) as ActivityResponse;
      const activityStatus = pollData["activity"]["status"];

      if (activityStatus === "ACTIVITY_STATUS_PENDING") {
        await delay(POLLING_DURATION);
        return await pollStatus();
      } else {
        return {
          ...pollData["activity"]["result"][`${resultKey}`],
          activity: {
            id: activityId,
            status: activityStatus,
          },
        } as TResponseType;
      }
    };

    return await pollStatus();
  }

  async activityDecision<TBodyType, TResponseType>(
    url: string,
    body: TBodyType
  ): Promise<TResponseType> {
    const data = (await this.request(url, body)) as ActivityResponse;
    const activityId = data["activity"]["id"];
    const activityStatus = data["activity"]["status"];
    return {
      ...data["activity"]["result"],
      activity: {
        id: activityId,
        status: activityStatus,
      },
    } as TResponseType;
  }

  getActivity = async (
    input: SdkApiTypes.TGetActivityBody
  ): Promise<SdkApiTypes.TGetActivityResponse> => {
    return this.request("/public/v1/query/get_activity", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getApiKey = async (
    input: SdkApiTypes.TGetApiKeyBody
  ): Promise<SdkApiTypes.TGetApiKeyResponse> => {
    return this.request("/public/v1/query/get_api_key", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getApiKeys = async (
    input: SdkApiTypes.TGetApiKeysBody = {}
  ): Promise<SdkApiTypes.TGetApiKeysResponse> => {
    return this.request("/public/v1/query/get_api_keys", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getAuthenticator = async (
    input: SdkApiTypes.TGetAuthenticatorBody
  ): Promise<SdkApiTypes.TGetAuthenticatorResponse> => {
    return this.request("/public/v1/query/get_authenticator", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getAuthenticators = async (
    input: SdkApiTypes.TGetAuthenticatorsBody
  ): Promise<SdkApiTypes.TGetAuthenticatorsResponse> => {
    return this.request("/public/v1/query/get_authenticators", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getOrganization = async (
    input: SdkApiTypes.TGetOrganizationBody = {}
  ): Promise<SdkApiTypes.TGetOrganizationResponse> => {
    return this.request("/public/v1/query/get_organization", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getPolicy = async (
    input: SdkApiTypes.TGetPolicyBody
  ): Promise<SdkApiTypes.TGetPolicyResponse> => {
    return this.request("/public/v1/query/get_policy", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getPrivateKey = async (
    input: SdkApiTypes.TGetPrivateKeyBody
  ): Promise<SdkApiTypes.TGetPrivateKeyResponse> => {
    return this.request("/public/v1/query/get_private_key", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getUser = async (
    input: SdkApiTypes.TGetUserBody
  ): Promise<SdkApiTypes.TGetUserResponse> => {
    return this.request("/public/v1/query/get_user", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getWallet = async (
    input: SdkApiTypes.TGetWalletBody
  ): Promise<SdkApiTypes.TGetWalletResponse> => {
    return this.request("/public/v1/query/get_wallet", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getActivities = async (
    input: SdkApiTypes.TGetActivitiesBody = {}
  ): Promise<SdkApiTypes.TGetActivitiesResponse> => {
    return this.request("/public/v1/query/list_activities", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getPolicies = async (
    input: SdkApiTypes.TGetPoliciesBody = {}
  ): Promise<SdkApiTypes.TGetPoliciesResponse> => {
    return this.request("/public/v1/query/list_policies", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  listPrivateKeyTags = async (
    input: SdkApiTypes.TListPrivateKeyTagsBody
  ): Promise<SdkApiTypes.TListPrivateKeyTagsResponse> => {
    return this.request("/public/v1/query/list_private_key_tags", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getPrivateKeys = async (
    input: SdkApiTypes.TGetPrivateKeysBody = {}
  ): Promise<SdkApiTypes.TGetPrivateKeysResponse> => {
    return this.request("/public/v1/query/list_private_keys", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getSubOrgIds = async (
    input: SdkApiTypes.TGetSubOrgIdsBody = {}
  ): Promise<SdkApiTypes.TGetSubOrgIdsResponse> => {
    return this.request("/public/v1/query/list_suborgs", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  listUserTags = async (
    input: SdkApiTypes.TListUserTagsBody = {}
  ): Promise<SdkApiTypes.TListUserTagsResponse> => {
    return this.request("/public/v1/query/list_user_tags", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getUsers = async (
    input: SdkApiTypes.TGetUsersBody = {}
  ): Promise<SdkApiTypes.TGetUsersResponse> => {
    return this.request("/public/v1/query/list_users", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getWalletAccounts = async (
    input: SdkApiTypes.TGetWalletAccountsBody
  ): Promise<SdkApiTypes.TGetWalletAccountsResponse> => {
    return this.request("/public/v1/query/list_wallet_accounts", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getWallets = async (
    input: SdkApiTypes.TGetWalletsBody = {}
  ): Promise<SdkApiTypes.TGetWalletsResponse> => {
    return this.request("/public/v1/query/list_wallets", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  getWhoami = async (
    input: SdkApiTypes.TGetWhoamiBody = {}
  ): Promise<SdkApiTypes.TGetWhoamiResponse> => {
    return this.request("/public/v1/query/whoami", {
      ...input,
      organizationId: input.organizationId ?? this.config.organizationId,
    });
  };

  approveActivity = async (
    input: SdkApiTypes.TApproveActivityBody
  ): Promise<SdkApiTypes.TApproveActivityResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.activityDecision("/public/v1/submit/approve_activity", {
      parameters: rest,
      organizationId: organizationId ?? this.config.organizationId,
      timestampMs: timestampMs ?? String(Date.now()),
      type: "ACTIVITY_TYPE_APPROVE_ACTIVITY",
    });
  };

  createApiKeys = async (
    input: SdkApiTypes.TCreateApiKeysBody
  ): Promise<SdkApiTypes.TCreateApiKeysResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_api_keys",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_API_KEYS",
      },
      "createApiKeysResult"
    );
  };

  createApiOnlyUsers = async (
    input: SdkApiTypes.TCreateApiOnlyUsersBody
  ): Promise<SdkApiTypes.TCreateApiOnlyUsersResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_api_only_users",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_API_ONLY_USERS",
      },
      "createApiOnlyUsersResult"
    );
  };

  createAuthenticators = async (
    input: SdkApiTypes.TCreateAuthenticatorsBody
  ): Promise<SdkApiTypes.TCreateAuthenticatorsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_authenticators",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_AUTHENTICATORS_V2",
      },
      "createAuthenticatorsResult"
    );
  };

  createInvitations = async (
    input: SdkApiTypes.TCreateInvitationsBody
  ): Promise<SdkApiTypes.TCreateInvitationsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_invitations",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_INVITATIONS",
      },
      "createInvitationsResult"
    );
  };

  createPolicies = async (
    input: SdkApiTypes.TCreatePoliciesBody
  ): Promise<SdkApiTypes.TCreatePoliciesResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_policies",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_POLICIES",
      },
      "createPoliciesResult"
    );
  };

  createPolicy = async (
    input: SdkApiTypes.TCreatePolicyBody
  ): Promise<SdkApiTypes.TCreatePolicyResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_policy",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_POLICY_V3",
      },
      "createPolicyResult"
    );
  };

  createPrivateKeyTag = async (
    input: SdkApiTypes.TCreatePrivateKeyTagBody
  ): Promise<SdkApiTypes.TCreatePrivateKeyTagResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_private_key_tag",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_PRIVATE_KEY_TAG",
      },
      "createPrivateKeyTagResult"
    );
  };

  createPrivateKeys = async (
    input: SdkApiTypes.TCreatePrivateKeysBody
  ): Promise<SdkApiTypes.TCreatePrivateKeysResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_private_keys",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_PRIVATE_KEYS_V2",
      },
      "createPrivateKeysResultV2"
    );
  };

  createReadOnlySession = async (
    input: SdkApiTypes.TCreateReadOnlySessionBody
  ): Promise<SdkApiTypes.TCreateReadOnlySessionResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_read_only_session",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_READ_ONLY_SESSION",
      },
      "createReadOnlySessionResult"
    );
  };

  createSubOrganization = async (
    input: SdkApiTypes.TCreateSubOrganizationBody
  ): Promise<SdkApiTypes.TCreateSubOrganizationResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_sub_organization",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4",
      },
      "createSubOrganizationResultV4"
    );
  };

  createUserTag = async (
    input: SdkApiTypes.TCreateUserTagBody
  ): Promise<SdkApiTypes.TCreateUserTagResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_user_tag",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_USER_TAG",
      },
      "createUserTagResult"
    );
  };

  createUsers = async (
    input: SdkApiTypes.TCreateUsersBody
  ): Promise<SdkApiTypes.TCreateUsersResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_users",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_USERS_V2",
      },
      "createUsersResult"
    );
  };

  createWallet = async (
    input: SdkApiTypes.TCreateWalletBody
  ): Promise<SdkApiTypes.TCreateWalletResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_wallet",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_WALLET",
      },
      "createWalletResult"
    );
  };

  createWalletAccounts = async (
    input: SdkApiTypes.TCreateWalletAccountsBody
  ): Promise<SdkApiTypes.TCreateWalletAccountsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/create_wallet_accounts",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_CREATE_WALLET_ACCOUNTS",
      },
      "createWalletAccountsResult"
    );
  };

  deleteApiKeys = async (
    input: SdkApiTypes.TDeleteApiKeysBody
  ): Promise<SdkApiTypes.TDeleteApiKeysResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_api_keys",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_API_KEYS",
      },
      "deleteApiKeysResult"
    );
  };

  deleteAuthenticators = async (
    input: SdkApiTypes.TDeleteAuthenticatorsBody
  ): Promise<SdkApiTypes.TDeleteAuthenticatorsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_authenticators",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_AUTHENTICATORS",
      },
      "deleteAuthenticatorsResult"
    );
  };

  deleteInvitation = async (
    input: SdkApiTypes.TDeleteInvitationBody
  ): Promise<SdkApiTypes.TDeleteInvitationResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_invitation",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_INVITATION",
      },
      "deleteInvitationResult"
    );
  };

  deletePolicy = async (
    input: SdkApiTypes.TDeletePolicyBody
  ): Promise<SdkApiTypes.TDeletePolicyResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_policy",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_POLICY",
      },
      "deletePolicyResult"
    );
  };

  deletePrivateKeyTags = async (
    input: SdkApiTypes.TDeletePrivateKeyTagsBody
  ): Promise<SdkApiTypes.TDeletePrivateKeyTagsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_private_key_tags",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_PRIVATE_KEY_TAGS",
      },
      "deletePrivateKeyTagsResult"
    );
  };

  deleteUserTags = async (
    input: SdkApiTypes.TDeleteUserTagsBody
  ): Promise<SdkApiTypes.TDeleteUserTagsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_user_tags",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_USER_TAGS",
      },
      "deleteUserTagsResult"
    );
  };

  deleteUsers = async (
    input: SdkApiTypes.TDeleteUsersBody
  ): Promise<SdkApiTypes.TDeleteUsersResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/delete_users",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_DELETE_USERS",
      },
      "deleteUsersResult"
    );
  };

  emailAuth = async (
    input: SdkApiTypes.TEmailAuthBody
  ): Promise<SdkApiTypes.TEmailAuthResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/email_auth",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_EMAIL_AUTH",
      },
      "emailAuthResult"
    );
  };

  exportPrivateKey = async (
    input: SdkApiTypes.TExportPrivateKeyBody
  ): Promise<SdkApiTypes.TExportPrivateKeyResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/export_private_key",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_EXPORT_PRIVATE_KEY",
      },
      "exportPrivateKeyResult"
    );
  };

  exportWallet = async (
    input: SdkApiTypes.TExportWalletBody
  ): Promise<SdkApiTypes.TExportWalletResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/export_wallet",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_EXPORT_WALLET",
      },
      "exportWalletResult"
    );
  };

  exportWalletAccount = async (
    input: SdkApiTypes.TExportWalletAccountBody
  ): Promise<SdkApiTypes.TExportWalletAccountResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/export_wallet_account",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_EXPORT_WALLET_ACCOUNT",
      },
      "exportWalletAccountResult"
    );
  };

  importPrivateKey = async (
    input: SdkApiTypes.TImportPrivateKeyBody
  ): Promise<SdkApiTypes.TImportPrivateKeyResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/import_private_key",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_IMPORT_PRIVATE_KEY",
      },
      "importPrivateKeyResult"
    );
  };

  importWallet = async (
    input: SdkApiTypes.TImportWalletBody
  ): Promise<SdkApiTypes.TImportWalletResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/import_wallet",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_IMPORT_WALLET",
      },
      "importWalletResult"
    );
  };

  initImportPrivateKey = async (
    input: SdkApiTypes.TInitImportPrivateKeyBody
  ): Promise<SdkApiTypes.TInitImportPrivateKeyResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/init_import_private_key",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_INIT_IMPORT_PRIVATE_KEY",
      },
      "initImportPrivateKeyResult"
    );
  };

  initImportWallet = async (
    input: SdkApiTypes.TInitImportWalletBody
  ): Promise<SdkApiTypes.TInitImportWalletResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/init_import_wallet",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_INIT_IMPORT_WALLET",
      },
      "initImportWalletResult"
    );
  };

  initUserEmailRecovery = async (
    input: SdkApiTypes.TInitUserEmailRecoveryBody
  ): Promise<SdkApiTypes.TInitUserEmailRecoveryResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/init_user_email_recovery",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_INIT_USER_EMAIL_RECOVERY",
      },
      "initUserEmailRecoveryResult"
    );
  };

  recoverUser = async (
    input: SdkApiTypes.TRecoverUserBody
  ): Promise<SdkApiTypes.TRecoverUserResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/recover_user",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_RECOVER_USER",
      },
      "recoverUserResult"
    );
  };

  rejectActivity = async (
    input: SdkApiTypes.TRejectActivityBody
  ): Promise<SdkApiTypes.TRejectActivityResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.activityDecision("/public/v1/submit/reject_activity", {
      parameters: rest,
      organizationId: organizationId ?? this.config.organizationId,
      timestampMs: timestampMs ?? String(Date.now()),
      type: "ACTIVITY_TYPE_REJECT_ACTIVITY",
    });
  };

  removeOrganizationFeature = async (
    input: SdkApiTypes.TRemoveOrganizationFeatureBody
  ): Promise<SdkApiTypes.TRemoveOrganizationFeatureResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/remove_organization_feature",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_REMOVE_ORGANIZATION_FEATURE",
      },
      "removeOrganizationFeatureResult"
    );
  };

  setOrganizationFeature = async (
    input: SdkApiTypes.TSetOrganizationFeatureBody
  ): Promise<SdkApiTypes.TSetOrganizationFeatureResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/set_organization_feature",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_SET_ORGANIZATION_FEATURE",
      },
      "setOrganizationFeatureResult"
    );
  };

  signRawPayload = async (
    input: SdkApiTypes.TSignRawPayloadBody
  ): Promise<SdkApiTypes.TSignRawPayloadResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/sign_raw_payload",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2",
      },
      "signRawPayloadResult"
    );
  };

  signRawPayloads = async (
    input: SdkApiTypes.TSignRawPayloadsBody
  ): Promise<SdkApiTypes.TSignRawPayloadsResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/sign_raw_payloads",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_SIGN_RAW_PAYLOADS",
      },
      "signRawPayloadsResult"
    );
  };

  signTransaction = async (
    input: SdkApiTypes.TSignTransactionBody
  ): Promise<SdkApiTypes.TSignTransactionResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/sign_transaction",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_SIGN_TRANSACTION_V2",
      },
      "signTransactionResult"
    );
  };

  updatePolicy = async (
    input: SdkApiTypes.TUpdatePolicyBody
  ): Promise<SdkApiTypes.TUpdatePolicyResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/update_policy",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_UPDATE_POLICY",
      },
      "updatePolicyResult"
    );
  };

  updatePrivateKeyTag = async (
    input: SdkApiTypes.TUpdatePrivateKeyTagBody
  ): Promise<SdkApiTypes.TUpdatePrivateKeyTagResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/update_private_key_tag",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_UPDATE_PRIVATE_KEY_TAG",
      },
      "updatePrivateKeyTagResult"
    );
  };

  updateRootQuorum = async (
    input: SdkApiTypes.TUpdateRootQuorumBody
  ): Promise<SdkApiTypes.TUpdateRootQuorumResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/update_root_quorum",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_UPDATE_ROOT_QUORUM",
      },
      "updateRootQuorumResult"
    );
  };

  updateUser = async (
    input: SdkApiTypes.TUpdateUserBody
  ): Promise<SdkApiTypes.TUpdateUserResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/update_user",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_UPDATE_USER",
      },
      "updateUserResult"
    );
  };

  updateUserTag = async (
    input: SdkApiTypes.TUpdateUserTagBody
  ): Promise<SdkApiTypes.TUpdateUserTagResponse> => {
    const { organizationId, timestampMs, ...rest } = input;
    return this.command(
      "/public/v1/submit/update_user_tag",
      {
        parameters: rest,
        organizationId: organizationId ?? this.config.organizationId,
        timestampMs: timestampMs ?? String(Date.now()),
        type: "ACTIVITY_TYPE_UPDATE_USER_TAG",
      },
      "updateUserTagResult"
    );
  };
}