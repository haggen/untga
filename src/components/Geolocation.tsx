import { useQuery } from "@tanstack/react-query";

type Props = {
  ip: string;
};

export function Geolocation({ ip }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["geolocation", ip],
    queryFn: async () => {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);

      if (!response.ok) {
        throw new Error(`Not 2xx: ${response.status}`);
      }

      return await response.json();
    },
  });

  if (isLoading) {
    return "Loading...";
  }

  if (error) {
    return "Unknown";
  }

  if (data.error) {
    return "Unknown";
  }

  return `${data.city}, ${data.region}, ${data.country_code}`;
}
