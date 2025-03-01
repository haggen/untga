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

export const client = { request };
