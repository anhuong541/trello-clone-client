import { redirect } from "next/navigation";

export default function PageMemberOnly() {
  redirect("/project");
}
