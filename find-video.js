process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function search(query) {
  const url = `https://html.duckduckgo.com/html/?q=site:youtube.com+${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const text = await res.text();
  const matches = [...text.matchAll(/v=([a-zA-Z0-9_-]{11})/g)];
  return matches.length > 0 ? matches[0][1] : null;
}

async function main() {
  console.log(await search("pradhan mantri jan dhan yojana hindi"));
}
main();
