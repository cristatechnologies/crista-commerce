// app/blog/page.tsx
import { getPageMetadata } from "@/lib/utils/getPageMetadata";
import BlogList from "@/Theme/page-components/blog/blog-list";


export async function generateMetadata() {
  const meta = await getPageMetadata("blog");

  return {
    title: meta?.title || "Blog",
    description: meta?.description || "Blog Description",
    keywords: meta?.keyword || "",
  };
}

export default function BlogPage() {
  return <BlogList />;
}


