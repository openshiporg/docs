import type { Metadata } from "next";
import SchemaVisualizer from "@/components/schema-visualizer";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  if (id === "openfront") {
    return {
      title: "Openfront Schema Visualizer",
      description: "Interactive schema visualization for the Openfront e-commerce platform",
    };
  } else if (id === "openship") {
    return {
      title: "Openship Schema Visualizer", 
      description: "Interactive schema visualization for the Openship fulfillment platform",
    };
  }
  
  return {
    title: "Schema Visualizer",
    description: "Interactive schema visualization",
  };
}

export async function generateStaticParams() {
  return [
    { id: "openfront" },
    { id: "openship" },
  ];
}

export default async function SchemaVisualizerPage({ params }: Props) {
  const { id } = await params;
  
  // Validate the schema ID
  if (!["openfront", "openship"].includes(id)) {
    notFound();
  }
  
  return (
    <div className="min-h-svh flex flex-col">
      <SchemaVisualizer schemaId={id} />
    </div>
  );
}