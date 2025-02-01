import prisma from "@/lib/prisma";

export default async function Home() {
  const user = await prisma.user.findFirst();

  return <main className="text-center p-24">Hello, {user?.email}!</main>;
}
