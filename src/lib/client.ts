import type {
  Attribute,
  Character,
  Container,
  Effect,
  Item,
  Route,
  Session,
  User,
} from "@/lib/db";

export { Attribute, Character, Container, Effect, Route, Session, User };

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

export type WithEffects = {
  include: { effects: WithSpec };
};

export type WithSlots = {
  include: { slots: WithItems };
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

  const url = new URL(
    baseUrl,
    typeof window !== "undefined" ? window.location.origin : undefined
  );

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

  users: {
    queryKey: (userId?: number) => ["users", userId] as const,

    post: async (payload: FormData) => {
      return request<{
        data: User;
      }>(`/api/v1/users`, {
        payload,
      });
    },

    characters: {
      queryKey: (userId: number, characterId?: number) =>
        [...client.users.queryKey(userId), "characters", characterId] as const,

      get: async (userId: number, characterId: number) => {
        return request<{
          data: Character;
        }>(`/api/v1/users/${userId}/characters/${characterId}`);
      },

      post: async ({
        userId,
        payload,
      }: {
        userId: number;
        payload: FormData;
      }) => {
        return request<{
          data: Character;
        }>(`/api/v1/users/${userId}/characters`, {
          payload,
        });
      },
    },

    sessions: {
      queryKey: (userId: number) =>
        [...client.users.queryKey(userId), "sessions"] as const,

      get: async (userId: number) => {
        return request<{ data: Session[] }>(`/api/v1/users/${userId}/sessions`);
      },
    },
  },

  sessions: {
    queryKey: (sessionId?: number) => ["sessions", sessionId] as const,

    post: async (payload: FormData) => {
      return request<{
        data: Session;
      }>(`/api/v1/sessions`, {
        payload,
      });
    },

    get: async (userId: number) => {
      return request<{ data: Session[] }>(`/api/v1/users/${userId}/sessions`);
    },

    delete: async (sessionId: number) => {
      return request(`/api/v1/sessions/${sessionId}`, {
        method: "DELETE",
      });
    },
  },

  containers: {
    queryKey: (containerId: number) => ["containers", containerId] as const,

    get: async (containerId: number) => {
      return request<Container<WithSource & WithItems>>(
        `/api/v1/containers/${containerId}`
      );
    },
  },

  characters: {
    queryKey: (characterId?: number) => ["characters", characterId] as const,

    get: async (characterId: number) => {
      return request<{
        data: Character;
      }>(`/api/v1/characters/${characterId}`);
    },

    slots: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "slots"] as const,

      get: async (characterId: number) => {
        return request<{ data: Container<WithItems>[]; total: number }>(
          `/api/v1/characters/${characterId}/slots`
        );
      },
    },

    effects: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "effects"] as const,

      get: async (characterId: number) => {
        return request<{ data: Effect<WithSpec>[]; total: number }>(
          `/api/v1/characters/${characterId}/effects`
        );
      },
    },

    resources: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "resources"] as const,

      get: async (characterId: number) => {
        return request<{ data: Attribute<WithSpec>[]; total: number }>(
          `/api/v1/characters/${characterId}/resources`
        );
      },
    },

    skills: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "skills"] as const,

      get: async (characterId: number) => {
        return request<{ data: Attribute<WithSpec>[]; total: number }>(
          `/api/v1/characters/${characterId}/skills`
        );
      },
    },
  },

  items: {
    queryKey: (itemId: number) => ["items", itemId] as const,

    get: async (itemId: number) => {
      return request<{ data: Item<WithSpec> }>(`/api/v1/items/${itemId}`);
    },

    storage: {
      queryKey: (itemId: number) =>
        [...client.items.queryKey(itemId), "storage"] as const,

      get: async (itemId: number) => {
        return request<{ data: Container<WithItems> }>(
          `/api/v1/items/${itemId}/storage`
        );
      },
    },
  },

  locations: {
    queryKey: () => ["locations"] as const,

    get: async () => {
      return request<{ data: Location[] }>(`/api/v1/locations`);
    },

    characters: {
      queryKey: (locationId: number) =>
        [...client.locations.queryKey(), locationId, "characters"] as const,

      get: async (locationId: number) => {
        return request<{ data: Character[] }>(
          `/api/v1/locations/${locationId}/characters`
        );
      },
    },

    exits: {
      queryKey: (locationId: number) =>
        [...client.locations.queryKey(), locationId, "exits"] as const,

      get: async (locationId: number) => {
        return request<{ data: Route[] }>(
          `/api/v1/locations/${locationId}/exits`
        );
      },
    },
  },
};
