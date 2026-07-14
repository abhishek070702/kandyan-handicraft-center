const BOT_UA =
  /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|TelegramBot|Pinterest|Googlebot/i

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function absoluteUrl(origin, path) {
  if (!path) return origin
  if (path.startsWith('http')) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

function renderHtml({ title, description, image, url, siteName }) {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const safeImage = escapeHtml(image)
  const safeUrl = escapeHtml(url)
  const safeSite = escapeHtml(siteName)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${safeSite}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    <link rel="canonical" href="${safeUrl}" />
  </head>
  <body>
    <p>${safeTitle}</p>
    <p>${safeDescription}</p>
    <img src="${safeImage}" alt="${safeTitle}" />
  </body>
</html>`
}

export default async (request, context) => {
  const userAgent = request.headers.get('user-agent') || ''
  if (!BOT_UA.test(userAgent)) {
    return context.next()
  }

  const url = new URL(request.url)
  const pathMatch = url.pathname.match(/^\/collections\/([^/]+)\/?$/)
  if (!pathMatch) {
    return context.next()
  }

  const categorySlug = pathMatch[1]
  const productId = url.searchParams.get('product')

  let catalog
  try {
    const response = await fetch(new URL('/og-catalog.json', url.origin))
    if (!response.ok) return context.next()
    catalog = await response.json()
  } catch {
    return context.next()
  }

  const siteName = catalog.site?.name || 'Kandyan Handicraft Center'
  const product = productId
    ? catalog.products?.[`${categorySlug}:${productId}`]
    : null
  const category = catalog.categories?.[categorySlug]

  const title = product?.name
    || (category ? `${category.name} | ${siteName}` : siteName)
  const description = product?.description
    || category?.description
    || catalog.site?.description
    || ''
  const image = absoluteUrl(
    url.origin,
    product?.image || category?.image || catalog.site?.image,
  )

  return new Response(
    renderHtml({
      title,
      description,
      image,
      url: url.toString(),
      siteName,
    }),
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    },
  )
}
