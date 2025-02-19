type ReqDesc<T = unknown> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  payload?: T;
  query?: Record<string, unknown>;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
};

type RespDesc<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  payload: T;
};

async function request<T>(
  urlDesc: URL | string,
  reqDesc: Partial<ReqDesc> = {}
) {
  if ("payload" in reqDesc) {
    reqDesc.method ??= "POST";

    if (reqDesc.payload instanceof FormData) {
      reqDesc.payload = Object.fromEntries(reqDesc.payload);
    }
  }

  reqDesc.method ??= "GET";
  reqDesc.credentials ??= "same-origin";
  reqDesc.headers ??= {};
  reqDesc.headers["Content-Type"] ??= "application/json; charset=utf-8";

  const url = new URL(urlDesc, window.location.origin);

  if (reqDesc.query) {
    for (const [key, value] of Object.entries(reqDesc.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: reqDesc.method,
    headers: new Headers(reqDesc.headers),
    body: JSON.stringify(reqDesc.payload),
    credentials: reqDesc.credentials,
    signal: reqDesc.signal,
  });

  const respDesc: RespDesc<T> = {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    payload: await response.json(),
  };

  if (!response.ok) {
    throw respDesc;
  }

  return respDesc;
}

export const client = { request };
