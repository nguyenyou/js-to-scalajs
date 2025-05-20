import { readdir, readFile } from "fs/promises";
import { Fragment } from "react";
import matter from "gray-matter";
import { sans } from "../fonts";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { remarkMdxEvalCodeBlock } from "./mdx";
import Link from "../Link";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const filename = "./public/" + slug + "/index.md";
  const file = await readFile(filename, "utf8");

  const { content, data } = matter(file);

  let postComponents = {};
  try {
    postComponents = await import("../../public/" + slug + "/components.js");
  } catch (e) {
    if (!e || e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }

  let Wrapper = postComponents.Wrapper ?? Fragment;

  return (
    <>
      <article>
        <h1 className={[sans.className].join(" ")}>{data.title}</h1>
        <p>
          {new Date(data.date).toLocaleDateString("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div>
          <Wrapper>
            <MDXRemote
              source={content}
              components={{
                a: Link,
                img: ({ src, ...rest }) => {
                  if (src && !/^https?:\/\//.test(src)) {
                    // https://github.com/gaearon/overreacted.io/issues/827
                    src = `/${slug}/${src}`;
                  }
                  return <img src={src} {...rest} />;
                },
                ...postComponents,
              }}
              options={{
                mdxOptions: {
                  useDynamicImport: true,
                  remarkPlugins: [remarkMdxEvalCodeBlock],
                },
              }}
            />
          </Wrapper>
        </div>
      </article>
    </>
  );
}

export async function generateStaticParams() {
  const entries = await readdir("./public/", { withFileTypes: true });
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  return dirs.map((dir) => ({ slug: dir }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const file = await readFile("./public/" + slug + "/index.md", "utf8");
  let { data } = matter(file);
  return {
    title: data.title + " — overreacted",
    description: data.spoiler,
  };
}
