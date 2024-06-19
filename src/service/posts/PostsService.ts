import path from "path";
import fs from "fs/promises";
import matter from 'gray-matter';

export interface Post {
  metadata: {
    date: string;
    url: string;
    excerpt: string;
    tags: string[];
  };
  slug: string;
  title: string;
  content: string;
}

export default function PostsService() {
  return {
    async getAll(): Promise<Post[]> {
      const PATH_POST = path.resolve(".", "_data", "posts");
      const postFiles = await fs.readdir(PATH_POST, {encoding: "utf-8"});
      const postsPromise = postFiles.map(async (postFilesName) => {
        const filePath = path.join(PATH_POST, postFilesName);
        const postFile = await fs.readFile(filePath, {encoding: "utf-8"});
        const { data, content} = matter(postFile);
        const post: Post= {
          metadata: {
            date: data.date,
            url: data.url,
            excerpt: data.excerpt,
            tags: data.tags,
          },
          slug: data.slug,
          title: postFilesName.replace(".md", ""),
          content,
        }
        return post;
      });
      const posts = await Promise.all(postsPromise);
      return posts;
    }
  };
}
