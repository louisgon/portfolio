export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    url.hostname = 'louis.gg';
    return Response.redirect(url.toString(), 301);
  },
};
