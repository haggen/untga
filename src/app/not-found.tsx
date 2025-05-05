import { Heading } from "~/components/heading";

export default async function Page() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <Heading size="large" asChild>
          <h1>404</h1>
        </Heading>

        <p>Page not found.</p>
      </div>
    </div>
  );
}
