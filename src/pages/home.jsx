import LayoffTreemap from "@/components/LayoffTreemap";
import AppSidebar from "@/components/AppSidebar";
import TopNews from "@/components/TopNews";

export default function HomePage() {
  return (
    <>
      <div className="flex gap-6 h-full">
        <LayoffTreemap />
        <div className="flex flex-1 flex-col">
          <TopNews />
        </div>
      </div>
    </>
  );
}
