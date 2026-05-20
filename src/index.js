export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    if (url.pathname === "/api/locale") {
      const lang = url.searchParams.get("lang") || "en"

      const cache = caches.default
      const cached = await cache.match(request)

      if (cached) {
        return cached
      }

      const data = await env.I18N.get(lang) || await env.I18N.get("en")

      const response = new Response(data, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60", // короткий кеш
          ...corsHeaders
        }
      })

      // кладём в edge cache
      await cache.put(request, response.clone())

      return response
    }

    return new Response("OK", { headers: corsHeaders })
  }
}