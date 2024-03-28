import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = () => {
  return redirect("/daily-scrum");
};

export default Page;
