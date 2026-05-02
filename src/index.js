export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/.env')) {
      return new Response('Forbidden', { status: 403 });
    }

    return env.ASSETS.fetch(request);
  },
};
