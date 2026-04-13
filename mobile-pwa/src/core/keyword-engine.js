const stopwords = new Set(['và', 'là', 'của', 'cho', 'với', 'các', 'những', 'một']);

export function suggestKeywords(text, limit = 5) {
  const counts = new Map();
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w))
    .forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}
