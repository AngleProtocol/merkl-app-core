import type { ClientLoaderFunction, ClientLoaderFunctionArgs } from "@remix-run/react";
import NodeCache from "node-cache";

export class CacheService {
  cache = new NodeCache();

  set<T>(key: string, ttl: number, value: T) {
    this.cache.set(key, value, ttl);

    return value;
  }

  get<T>(key: string): T | undefined {
    const cached = this.cache.get<T>(key);

    return cached;
  }

  reset(key: string) {
    this.cache.del(key);
  }

  wrap(resource: string, ttl: number): ClientLoaderFunction {
    const loader = async ({ request, serverLoader }: ClientLoaderFunctionArgs) => {
      const key = `${resource}:${request.url}`;
      const cache = Cache.get(key);

      if (cache) return cache;

      const data = await serverLoader();

      Cache.set(key, ttl, data);

      return data;
    };

    loader.hydrate = true;
    return loader;
  }
}

export const Cache = new CacheService();
