export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }

    // preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      })
    }

    if (url.pathname === "/api/locale") {
      const lang = url.searchParams.get("lang") || "en"

      const data = await env.I18N.get(lang)

      if (!data) {
        return new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        })
      }

      return new Response(data, {
        headers: {
          "Content-Type": "application/json",
          //"Cache-Control": "public, max-age=3600",
          "Cache-Control": "no-store",
          ...corsHeaders
        }
      })
    }

    return new Response("OK", { headers: corsHeaders })
  }
}