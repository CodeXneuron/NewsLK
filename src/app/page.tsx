import { getNews } from "@/lib/data";
import { NewsList } from "@/components/news/news-list";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export default async function Home() {
  const articles = await getNews();

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader className="h-12 w-12"/></div>}>
      <NewsList articles={articles} />
    </Suspense>
  );
}
