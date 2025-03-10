import type { Api } from "@core/api/types";
import type { MerklServer } from "@core/config/server";
import type { Token } from "@merkl/api";
import { defineModule } from "@merkl/conduit";
import { Fmt } from "dappkit";
import { type ApiQuery, type ApiResponse, fetchResource } from "../../api/utils";
import merklConfig from "../../config";

export const TokenService = defineModule<{ api: Api; request: Request; server: MerklServer }>().create(({ inject }) => {
  const fetchApi = <R, T extends ApiResponse<R>>(call: () => Promise<T>) => fetchResource<R, T>("Token")(call);
  const queryFromRequest = (request: Request, override?: ApiQuery<Api["v4"]["opportunities"]["index"]["get"]>) => {
    const page = new URL(request.url).searchParams.get("page");
    const items = new URL(request.url).searchParams.get("items");
    const search = new URL(request.url).searchParams.get("search");

    const [sort, order] = new URL(request.url).searchParams.get("sort")?.split("-") ?? [];

    const filters = Object.assign(
      { items, sort, order, name: search, page },
      override ?? {},
      page !== null && { page: Number(page) - 1 },
    );

    const query = Object.entries(filters).reduce(
      (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
      {},
    );

    return query;
  };

  const getMany = inject(["api"]).inFunction(async ({ api }, query: ApiQuery<Api["v4"]["tokens"]["index"]["get"]>) => {
    const tokens = await fetchApi(async () => api.v4.tokens.index.get({ query }));

    return tokens;
  });

  const getManyFromRequest = inject(["api", "request"]).inFunction(async ({ api, request }) => {
    const query = queryFromRequest(request);
    const tokens = await fetchApi(async () => api.v4.tokens.index.get({ query }));
    const count = await fetchApi(async () => api.v4.tokens.count.get({ query }));

    return { tokens, count };
  });

  const getValidRewardTokenByChain = inject(["api"]).inFunction(async ({ api }, chainId) => {
    const tokens = await fetchApi(async () => api.v4.tokens.reward({ chainId }).get());
    return tokens;
  });

  const findUniqueOrThrow = inject(["api"]).inFunction(async ({ api }, chainId: number, address: string) => {
    return await fetchApi(async () => api.v4.tokens({ id: `${chainId}-${address}` }).get());
  });

  const getSymbol = inject(["api"]).inFunction(async ({ api }, symbol: string | undefined) => {
    if (!symbol) throw new Response("Token not found");

    const tokens = await fetchApi(async () => api.v4.tokens.index.get({ query: { displaySymbol: symbol } }));

    if (tokens.length === 0) throw new Response("Token not found", { status: 404 });
    return tokens;
  });

  const getAllowance = inject(["api"]).inFunction(
    async ({ api }, chainId: number, address: string, owner: string, spender: string) => {
      const id = `${chainId}-${address}`;

      return await fetchApi(async () => api.v4.tokens({ id }).allowance({ owner })({ spender }).get());
    },
  );

  const sortForUser = inject(["server"]).inFunction(({ server }, tokens?: (Token & { balance: bigint })[]) => {
    if (!tokens) return [];

    const tokensWithBalance = tokens
      .filter(({ balance }) => balance > 0)
      .sort((a, b) => {
        if (a.price && b.price) return Fmt.toPrice(b.balance, b) - Fmt.toPrice(a.balance, a);
        if (a.price && a.balance && Fmt.toPrice(a.balance, a)) return -1;
        if (b.price && b.balance && Fmt.toPrice(b.balance, b)) return 1;

        return Number(b.balance - a.balance);
      });
    const tokensWithNoBalance = tokens.filter(({ balance }) => !balance || BigInt(balance) <= 0n);

    const tokensInPriority = !merklConfig?.tokenSymbolPriority?.length
      ? tokensWithNoBalance
      : (server?.tokenSymbolPriority
          ?.map(s => tokensWithNoBalance.find(({ symbol }) => symbol === s))
          ?.filter(t => t !== undefined) ?? []);

    const otherTokens = tokensWithNoBalance.filter(s => merklConfig?.tokenSymbolPriority?.includes(s.symbol));

    return [...tokensWithBalance, ...tokensInPriority, ...otherTokens];
  });

  return {
    getMany,
    getManyFromRequest,
    getSymbol,
    getAllowance,
    sortForUser,
    findUniqueOrThrow,
    getValidRewardTokenByChain,
  };
});
