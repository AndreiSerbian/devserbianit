// TEMPORARY diagnostic: returns only header NAMES (never values) to identify
// the provider-controlled trusted client IP header. Deleted after the check.
Deno.serve((req) => {
  const names = [...req.headers.keys()].sort();
  const shapes: Record<string, string> = {};
  for (const h of ["x-forwarded-for", "x-real-ip", "cf-connecting-ip", "x-envoy-external-address"]) {
    const v = req.headers.get(h);
    if (v !== null) {
      shapes[h] = `count=${v.split(",").length};len=${v.length}`;
    }
  }
  return new Response(JSON.stringify({ names, shapes }), {
    headers: { "Content-Type": "application/json" },
  });
});
