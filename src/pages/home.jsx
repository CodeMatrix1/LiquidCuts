import LayoffTreemap from "@/components/LayoffTreemap";import TopNews from "@/components/TopNews";

export default function HomePage() {
  return (
    <div className="flex gap-6 h-full w-full">
      <LayoffTreemap />
        <TopNews />
    </div>
  );
}
