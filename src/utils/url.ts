export function withUrl<T>(request: Request, payload: T): { url: string } & T {
  const url = `${request.url.split("/")?.[0]}//${request.headers.get("host")}`;
  return {
    url,
    ...payload,
  };
}
