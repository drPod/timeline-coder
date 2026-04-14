import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

type ReadmeViewProps = {
  repo: string;
  branch: string;
  content: string;
};

/**
 * Rewrite a URL to point at the repo on GitHub when it's relative.
 * - Images use raw.githubusercontent.com so they load inline.
 * - Non-image links go to github.com/...blob/branch/ so clicking them
 *   goes to the rendered file on GitHub.
 */
function makeRewriter(repo: string, branch: string) {
  const rawBase = `https://raw.githubusercontent.com/drPod/${repo}/${branch}/`;
  const repoBlobBase = `https://github.com/drPod/${repo}/blob/${branch}/`;

  return function rewrite(url: string | undefined, isImage: boolean): string | undefined {
    if (!url) return url;
    // Absolute, protocol-relative, mailto, anchor — leave alone
    if (
      /^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(url)
    ) {
      return url;
    }
    // Strip leading ./
    const clean = url.replace(/^\.\//, "");
    return (isImage ? rawBase : repoBlobBase) + clean;
  };
}

const ReadmeView = ({ repo, branch, content }: ReadmeViewProps) => {
  const rewrite = useMemo(() => makeRewriter(repo, branch), [repo, branch]);

  return (
    <div className="readme-view max-w-none px-6 py-6 text-white/70 md:px-10 md:py-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt, ...props }) => (
            <img
              {...props}
              src={rewrite(src as string, true)}
              alt={alt ?? ""}
              loading="lazy"
              className="my-4 max-w-full rounded-md border border-white/10"
            />
          ),
          a: ({ href, children, ...props }) => (
            <a
              {...props}
              href={rewrite(href as string, false)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3ecf8e] underline decoration-[#3ecf8e]/30 underline-offset-2 transition-colors hover:decoration-[#3ecf8e]"
            >
              {children}
            </a>
          ),
          h1: ({ children }) => (
            <h1 className="mb-4 mt-2 font-mono text-[28px] font-bold tracking-tight text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 font-mono text-[20px] font-bold tracking-tight text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 font-mono text-[16px] font-semibold text-white/90">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 font-mono text-[14px] font-semibold text-white/85">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-3 leading-relaxed text-white/70">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1 pl-6 text-white/70">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1 pl-6 text-white/70">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-[#3ecf8e]/40 pl-4 italic text-white/50">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !/\blanguage-/.test(className ?? "");
            if (isInline) {
              return (
                <code
                  {...props}
                  className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[12.5px] text-[#3ecf8e]"
                >
                  {children}
                </code>
              );
            }
            return (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-4 text-[12.5px] leading-relaxed">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse font-mono text-[12px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-white/10 text-left">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-white/85">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-white/5 px-3 py-2 text-white/65">
              {children}
            </td>
          ),
          hr: () => <hr className="my-6 border-white/10" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-white/90">{children}</strong>
          ),
          em: ({ children }) => <em className="text-white/80">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ReadmeView;
