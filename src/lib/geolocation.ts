import z from "zod/v4";

type Data = {
  country: string;
  regionName: string;
  city: string;
};

export async function getGeolocation(value: string) {
  const ip = z.ipv4().parse(value);

  const response = await fetch(
    `http://ip-api.com/json/${ip}?fields=city,regionName,country`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    throw new Error("Fetching geolocation failed", {
      cause: response,
    });
  }

  const data: Data = await response.json();

  if (data.city) {
    return `${data.city} (${data.country})`;
  }

  if (data.regionName) {
    return `${data.regionName} (${data.country})`;
  }

  return data.country || "unknown location";
}
