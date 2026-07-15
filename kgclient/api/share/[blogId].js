// api/share/[blogId].js
//
// Facebook, WhatsApp, Twitter/X, LinkedIn, Discord, etc. crawlers do NOT
// execute JavaScript — they only read the raw HTML of the URL they're given.
// Since this is a client-rendered Vite/React app, react-helmet's <meta> tags
// (set via JS after the page loads) are invisible to those crawlers.
//
// This function is only ever hit for crawler requests (see vercel.json,
// which routes requests with a bot User-Agent here instead of the SPA).
// It fetches the real blog data from the backend and returns a minimal
// static HTML page with correct OG/Twitter tags, so the shared link shows
// the blog's actual title, description, and thumbnail.

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const stripHtml = (str = "") => String(str).replace(/<[^>]*>/g, "").trim();

const SITE_URL = "https://qspaceblog.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export default async function handler(req, res) {
  const { blogId } = req.query;

  let blog = null;
  try {
    const apiRes = await fetch(
      `https://kgserver-bjy2.onrender.com/api/v1/blog/${blogId}`
    );
    const data = await apiRes.json();
    if (data.success) blog = data.blog;
  } catch (err) {
    console.error("share function: failed to fetch blog", err);
  }

  const title = blog?.title ? `${blog.title} | Qspace Blog` : "Qspace Blog";
  const rawDescription = blog?.subtitle || blog?.description || "Read our latest tech, coding, and career articles.";
  const description = stripHtml(rawDescription).slice(0, 200);
  const image = blog?.thumbnail || DEFAULT_OG_IMAGE;
  const pageUrl = `${SITE_URL}/blogs/${blogId}`;
  const author = blog?.author ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim() : undefined;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${pageUrl}" />

<!-- Open Graph (Facebook, WhatsApp, LinkedIn, Discord) -->
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Qspace Blog" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${pageUrl}" />
${author ? `<meta property="article:author" content="${escapeHtml(author)}" />` : ""}

<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />

<!-- Real visitors who somehow land here get bounced straight to the SPA -->
<meta http-equiv="refresh" content="0; url=${pageUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${pageUrl}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
  res.status(200).send(html);
}
