import type {
  Attribute,
  Character,
  Container,
  Effect,
  Item,
  Location,
  Log,
  Route,
  Session,
  User,
  WithAttributes,
  WithCharacters,
  WithEffects,
  WithEntry,
  WithExit,
  WithExits,
  WithItems,
  WithLocation,
  WithSlots,
  WithSource,
  WithSpec,
} from "~/lib/db";

export {
  Attribute,
  Character,
  Container,
  Effect,
  Location,
  Log,
  Route,
  Session,
  User,
  WithAttributes,
  WithEffects,
  WithEntry,
  WithExit,
  WithItems,
  WithLocation,
  WithSlots,
  WithSource,
  WithSpec,
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

/**
 * API client.
 */
export const client = {
  request,

  users: {
    queryKey: (userId?: number) => ["users", userId] as const,

    post: async (payload: FormData) => {
      return request<User>(`/api/v1/users`, {
        payload,
      });
    },

    patch: async (userId: number, payload: FormData) => {
      return request<User>(`/api/v1/users/${userId}`, {
        method: "PATCH",
        payload,
      });
    },

    delete: async (userId: number) => {
      return request(`/api/v1/users/${userId}`, {
        method: "DELETE",
      });
    },

    characters: {
      get: async (userId: number) => {
        return request<Character[]>(`/api/v1/users/${userId}/characters`);
      },
    },

    sessions: {
      queryKey: (userId: number) =>
        [...client.users.queryKey(userId), "sessions"] as const,

      get: async (userId: number) => {
        return request<Session[]>(`/api/v1/users/${userId}/sessions`);
      },
    },
  },

  sessions: {
    queryKey: (sessionId?: number) => ["sessions", sessionId] as const,

    post: async (payload: FormData) => {
      return request<Session>(`/api/v1/sessions`, {
        payload,
      });
    },

    get: async (userId: number) => {
      return request<Session[]>(`/api/v1/users/${userId}/sessions`);
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

    post: async (payload: FormData) => {
      return request<Character>(`/api/v1/characters`, {
        payload,
      });
    },

    get: async (characterId: number) => {
      return request<Character<WithLocation>>(
        `/api/v1/characters/${characterId}`
      );
    },

    patch: async (characterId: number, payload: FormData) => {
      return request<Character>(`/api/v1/characters/${characterId}`, {
        method: "PATCH",
        payload,
      });
    },

    delete: async (characterId: number) => {
      return request(`/api/v1/characters/${characterId}`, {
        method: "DELETE",
      });
    },

    slots: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "slots"] as const,

      get: async (characterId: number) => {
        return request<Container<WithItems>[]>(
          `/api/v1/characters/${characterId}/slots`
        );
      },
    },

    storage: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "storage"] as const,

      get: async (characterId: number) => {
        return request<Container<WithSource & WithItems>[]>(
          `/api/v1/characters/${characterId}/storage`
        );
      },
    },

    logs: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "logs"] as const,

      get: async (characterId: number) => {
        return request<Log[]>(`/api/v1/characters/${characterId}/logs`);
      },
    },

    location: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "location"] as const,

      get: async (characterId: number) => {
        return request<Location<WithCharacters & WithExits>>(
          `/api/v1/characters/${characterId}/location`
        );
      },
    },

    effects: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "effects"] as const,

      get: async (characterId: number) => {
        return request<Effect<WithSpec>[]>(
          `/api/v1/characters/${characterId}/effects`
        );
      },
    },

    resources: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "resources"] as const,

      get: async (characterId: number) => {
        return request<Attribute<WithSpec>[]>(
          `/api/v1/characters/${characterId}/resources`
        );
      },
    },

    skills: {
      queryKey: (characterId: number) =>
        [...client.characters.queryKey(characterId), "skills"] as const,

      get: async (characterId: number) => {
        return request<Attribute<WithSpec>[]>(
          `/api/v1/characters/${characterId}/skills`
        );
      },
    },
  },

  items: {
    queryKey: (itemId: number) => ["items", itemId] as const,

    get: async (itemId: number) => {
      return request<Item<WithSpec>>(`/api/v1/items/${itemId}`);
    },

    storage: {
      queryKey: (itemId: number) =>
        [...client.items.queryKey(itemId), "storage"] as const,

      get: async (itemId: number) => {
        return request<Container<WithItems>>(`/api/v1/items/${itemId}/storage`);
      },
    },
  },

  locations: {
    queryKey: (locationId?: number) => ["locations", locationId] as const,

    get: (async (locationId?: number) => {
      if (locationId) {
        return request<Location>(`/api/v1/locations/${locationId}`);
      }
      return request<Location[]>(`/api/v1/locations`);
    }) as {
      (locationId: number): Promise<ClientResp<Location>>;
      (): Promise<ClientResp<Location[]>>;
    },

    characters: {
      queryKey: (locationId: number) =>
        [...client.locations.queryKey(), locationId, "characters"] as const,

      get: async (locationId: number) => {
        return request<Character[]>(
          `/api/v1/locations/${locationId}/characters`
        );
      },
    },

    exits: {
      queryKey: (locationId: number) =>
        [...client.locations.queryKey(), locationId, "exits"] as const,

      get: async (locationId: number) => {
        return request<Route<WithEntry & WithExit>[]>(
          `/api/v1/locations/${locationId}/exits`
        );
      },
    },
  },
};
