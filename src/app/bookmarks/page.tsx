"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
       <h2 className="mb-6 font-headline text-3xl font-bold md:text-4xl">
        My Bookmarks
      </h2>
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted p-12 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No Bookmarks Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t bookmarked any articles. Start exploring and save your favorites!
          </p>
      </div>
    </div>
  );
}
