import { use } from "react";
import z from "zod";

type Data = {
  country: string;
  regionName: string;
  city: string;
};

export async function useGeolocation(value: string) {
  const ip = z.ipv4().parse(value);

  try {
    const response = await fetch(`/api/geolocation/${ip}`);
    if (!response.ok) {
      throw new Error("Failed to fetch geolocation data", {
        cause: response,
      });
    }
    return await (response.json() as Promise<Data>);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function Geolocation(
  props: Readonly<{
    data: Promise<Data | null>;
  }>
) {
  const data = use(props.data);

  if (!data) {
    return "unknown location";
  }

  return `${data.city || data.regionName} (${data.country})`;
}
