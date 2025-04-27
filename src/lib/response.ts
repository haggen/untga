export function getResponsePayload(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType) {
    throw new Error("Response is missing content type.");
  }

  if (response.status === 204) {
    return Promise.resolve(null);
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  if (contentType.includes("text/plain")) {
    return response.text();
  }

  throw new Error(`Response uses an unsupported content type ${contentType}.`);
}
