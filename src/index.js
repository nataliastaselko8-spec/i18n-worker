export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // API перевода
    if (url.pathname === "/api/locale") {
      const lang = url.searchParams.get("lang") || "en"

      const data = await env.I18N.get(lang)

      if (!data) {
        return new Response(
          JSON.stringify({ error: "not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      }

      return new Response(data, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600"
        }
      })
    }

    return new Response("OK")
  }
}
