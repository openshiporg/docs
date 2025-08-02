import type { Metadata } from "next";
import SchemaVisualizer from "@/components/schema/schema-visualizer";

export const metadata: Metadata = {
  title: "Schema Visualizer - Openfront",
};

export default function Page() {
  return (
    <div className="min-h-svh flex flex-col">
      {/* <Header /> */}
      <SchemaVisualizer />
    </div>
  );
}