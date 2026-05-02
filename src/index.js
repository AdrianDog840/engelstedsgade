export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Block .env files from being served publicly
    if (path === '/.env' || path.startsWith('/.env.') || path.startsWith('/.env/')) {
      return new Response('Forbidden', { status: 403 });
    }

    // Try serving the request as-is first
    let response = await env.ASSETS.fetch(request);

    // If 404 and path ends with '/', try appending index.html
    if (response.status === 404 && path.endsWith('/')) {
      const indexUrl = new URL(url.toString());
      indexUrl.pathname = path + 'index.html';
      response = await env.ASSETS.fetch(new Request(indexUrl.toString(), request));
    }

    // If still 404 and no extension, try /index.html
    if (response.status === 404 && !path.includes('.') && !path.endsWith('/')) {
      const indexUrl = new URL(url.toString());
      indexUrl.pathname = path + '/index.html';
      response = await env.ASSETS.fetch(new Request(indexUrl.toString(), request));
    }

    return response;
  },
};
