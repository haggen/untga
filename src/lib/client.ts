import type { Character, Container, Session, Slot, User } from "@/lib/db";

export { Character, Container, Session, Slot, User };

export type WithLocation = {
  include: {
    location: true;
  };
};

export type WithSpec = {
  include: { spec: true };
};

export type WithAttributes = {
  include: { attributes: WithSpec };
};

export type WithResources = {
  include: { resources: WithSpec };
};

export type WithSlots = {
  include: { slots: WithItem };
};

export type WithItem = {
  include: { item: WithSpec };
};

export type WithItems = {
  include: { items: WithSpec };
};

export type WithSource = {
  include: { source: WithSpec };
};

// --
// --
// --

type ClientReq<T = unknown> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  payload?: T;
  query?: Record<string, unknown>;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
};

export type ClientResp<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  payload: T;
};

async function request<T>(
  baseUrl: URL | string,
  clientReq: Partial<ClientReq> = {}
) {
  if ("payload" in clientReq) {
    clientReq.method ??= "POST";

    if (clientReq.payload instanceof FormData) {
      clientReq.payload = Object.fromEntries(clientReq.payload);
    }
  }

  clientReq.method ??= "GET";
  clientReq.credentials ??= "same-origin";
  clientReq.headers ??= {};
  clientReq.headers["Content-Type"] ??= "application/json; charset=utf-8";

  const url = new URL(baseUrl, window.location.origin);

  if (clientReq.query) {
    for (const [key, value] of Object.entries(clientReq.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: clientReq.method,
    headers: new Headers(clientReq.headers),
    body: JSON.stringify(clientReq.payload),
    credentials: clientReq.credentials,
    signal: clientReq.signal,
  });

  const clientResp: ClientResp<T> = {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    payload: await response.json(),
  };

  if (!response.ok) {
    throw clientResp;
  }

  return clientResp;
}

// --
// --
// --

export const client = {
  request,

  characters: {
    queryKey: (characterId?: number) => ["characters", characterId],

    get: async (characterId: number) => {
      return request<{
        data: Character<WithAttributes & WithResources & WithSlots>;
      }>(`/api/characters/${characterId}`);
    },
  },

  users: {
    queryKey: (userId: number) => ["users", userId],

    characters: {
      queryKey: (userId: number, characterId?: number) => [
        ...client.users.queryKey(userId),
        "characters",
        characterId,
      ],

      get: async (userId: number, characterId: number) => {
        return request<{
          data: Character<
            WithLocation & WithAttributes & WithResources & WithSlots
          >;
        }>(`/api/users/${userId}/characters/${characterId}`);
      },

      post: async ({
        userId,
        payload,
      }: {
        userId: number;
        payload: FormData;
      }) => {
        return request<{
          data: Character<
            WithLocation & WithAttributes & WithResources & WithSlots
          >;
        }>(`/api/users/${userId}/characters`, {
          payload,
        });
      },

      storage: {
        queryKey: (userId: number, characterId: number) => [
          ...client.users.characters.queryKey(userId, characterId),
          "storage",
        ],

        get: async (userId: number, characterId: number) => {
          return request<{ data: Container<WithSource & WithItems> }>(
            `/api/users/${userId}/characters/${characterId}/storage`
          );
        },
      },
    },
  },
};
