export function withUrl(request: Request): { url: string } {
  const url = `${request.url.split("/")?.[0]}//${request.headers.get("host")}`;
  return {
    url,
  };
}
