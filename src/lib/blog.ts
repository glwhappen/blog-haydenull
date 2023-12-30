import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as v from "valibot";
import { BlogFrontMatterSchema } from "@/types/blog";

const BLOG_PATH = path.join(process.cwd(), "content/blogs");
/** 从根目录下的 content/blogs 文件夹读取 markdown 文件，并解析 */
export const getBlogsFrontMatter = () => {
  const blogs = fs.readdirSync(BLOG_PATH);
  return blogs.map((blog) => {
    const content = fs.readFileSync(
      path.join(process.cwd(), "content/blogs", blog),
      "utf-8"
    );
    const { data } = matter(content);
    return v.parse(BlogFrontMatterSchema, {
      ...data,
      slug: blog.replace(".md", ""),
    });
  });
};

/** 依据 slug 读取单个文章的数据 */
export const getBlogBySlug = (slug: string) => {
  const file = fs.readFileSync(path.join(BLOG_PATH, `${slug}.md`), "utf-8");
  const { data, content } = matter(file);
  return {
    frontMatter: v.parse(BlogFrontMatterSchema, {
      ...data,
      slug,
    }),
    content,
  };
};
