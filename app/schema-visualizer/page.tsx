import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to the openfront schema visualizer by default
  redirect("/schema-visualizer/openfront");
}