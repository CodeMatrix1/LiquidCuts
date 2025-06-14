import LayoffTreemap from "@/components/TreeMap";
import ListNews from "@/components/ListNews";
import { getData } from "@/shared/config";
import { useEffect, useState } from "react";

//topnews=[
//]

export default function HomePage() {
  const [topnews, setTopnews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fetch-data?collection=topnews")
      .then((res) => res.json())
      .then((data) => {
        setTopnews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!topnews) return <div>No data found.</div>;

  return (
    <div className="flex gap-6 h-full w-full">
      <LayoffTreemap />
      <ListNews
        newsItems={topnews}
        heading="Top News"
        subheading="Stay tuned for the latest updates!"
      />
    </div>
  );
}

// _id
// 68495081562746e34bcea91e
// ticker
// "Microsoft"
// title
// "Google, Meta, Amazon and other tech companies have laid off more ..."
// url
// "https://www.cnbc.com/2023/01/18/tech-layoffs-microsoft-amazon-meta-oth…"
// summary
// "Here is a concise news summary:

// More than 104,000 employees have been…"
// date
// "2023-01-18"

// liquidity
// Object
// sentiment
// 0.6048828959465027
