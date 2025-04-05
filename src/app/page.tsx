import { Heading } from "@/components/Heading";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col gap-2 ">
      <Heading>Welcome</Heading>
      <p>
        Would you like to{" "}
        <Link href="/login" className="text-orange-900 font-bold">
          log in
        </Link>
        , or{" "}
        <Link href="/register" className="text-orange-900 font-bold">
          register
        </Link>
        ?
      </p>
    </main>
  );
}
