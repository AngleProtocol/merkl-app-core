import chalk from "chalk";

function logStatus(status: number) {
  if (status === 200) return chalk.green(`[${status}]`);
  if (status < 500) return chalk.yellow(`[${status}]`);
  return chalk.red(`[${status}]`);
}

function logPerformance(ms: number) {
  if (ms < 100) return chalk.green(`[${Math.round(ms)}ms]`);
  if (ms < 500) return chalk.yellow(`[${Math.round(ms)}ms]`);
  return chalk.red(`[${Math.round(ms)}ms]`);
}

function logSize(bytes: number) {
  const kb = Math.round(bytes / 1000);

  return `[${kb}kb]`;
}

/**
 * Eden response structure for a given return type
 */
export type ApiResponse<R> = { data: R; status: number; response: Response };
// biome-ignore lint/suspicious/noExplicitAny: needed
export type ApiQuery<R extends (...args: any[]) => any> = R extends (parameter: { query: infer P }) => any ? P : never;

export async function fetchWithLogs<R, T extends { data: R; status: number; response: Response }>(
  call: () => Promise<T>,
) {
  const start = performance.now();
  const response = await call();
  const end = performance.now() - start;

  process.env.NODE_ENV === "development" &&
    console.info(
      `${logStatus(response.status)}${logPerformance(end)}${logSize(
        +(response.response.headers.get("content-length") ?? 0),
      )}: ${response.response.url}`,
    );

  return response;
}

/**
 * Fetch resource or throw appropriate error
 * @param call callback to api call i.e. () => api.v4.campaigns.index.get()
 * @param resource to insert name in errors i.e. Campaigns not found (404)
 * @returns return type of api call
 */
export async function safeFetch<R, T extends ApiResponse<R>>(
  call: () => Promise<T>,
  resource = "Campaign",
): Promise<NonNullable<T["data"]>> {
  const { data, status } = await fetchWithLogs(call);

  if (status === 404) throw new Response(`${resource} not found`, { status });
  if (status === 500) throw new Response(`${resource} unavailable`, { status });
  if (data == null) throw new Response(`${resource} unavailable`, { status });
  return data;
}

/**
 * Wraps the safeFetch function to always declare the same resource name
 * @param resourceName i.e. Campaigns
 * @returns a safeFetch function without resource name parameters
 */
export function fetchResource<R, T extends ApiResponse<R>>(resourceName: string) {
  return (call: () => Promise<T>) => safeFetch<R, T>(call, resourceName);
}
