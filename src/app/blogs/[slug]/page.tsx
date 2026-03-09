// app/blogs/[slug]/page.tsx
import BlogDetail from "@/Theme/page-components/blog/blog-details";
import { Metadata } from "next";
import { fetchBlogBySlug } from "@/services/blog";

export const revalidate = 3600; // 1 hour

interface BlogMeta {
  slug: string;
  seo_title?: string;
  seo_description?: string;
  category_slug: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    // Fetch the full blog data directly
    const blogData = await fetchBlogBySlug(slug);
    
    if (!blogData?.blog) {
      console.error(`❌ Blog not found for slug: ${slug}`);
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found",
        robots: "noindex,nofollow",
      };
    }

    const blog = blogData.blog;
    
    // Create fallback title from slug if needed
    const fallbackTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const title = blog.seo_title || blog.title || fallbackTitle;
    const description = 
      blog.seo_description || 
      blog.description?.substring(0, 160) || 
      `Read our blog post about ${fallbackTitle}`;

      
    const metadata: Metadata = {
      title,
      description,
      alternates: {
        canonical: `/blogs/${slug}`,
      },
      robots: "index,follow",
      openGraph: {
        title,
        description,
        url: `pulseitfitness.com/blogs/${slug}`,
        type: "article",
        publishedTime: blog.created_at,
        modifiedTime: blog.updated_at,
        images: blog.image
          ? [
              {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}${blog.image}`,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: blog.image
          ? [`${process.env.NEXT_PUBLIC_BASE_URL}${blog.image}`]
          : [],
      },
    };

    return metadata;
  } catch (error) {
    console.error(`❌ Error generating metadata for slug: ${(await params).slug}`, error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post",
      robots: "noindex,nofollow",
    };
  }
}

export async function generateStaticParams() {
  try {
    // Fetch all blog slugs for static generation
    const res = await fetch(
      "https://s1.shopico.in/pulseit2/api/user/metadata?blogs-all=true",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("Failed to fetch blog metadata for static params");
      return [];
    }

    const data = await res.json();
    const blogs = data.metadata || [];
    
    return blogs
      .filter((blog: BlogMeta) => blog.slug)
      .map((blog: BlogMeta) => ({
        slug: blog.slug,
      }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}