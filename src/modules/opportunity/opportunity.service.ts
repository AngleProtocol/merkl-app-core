import { api } from '@core/api'
import { fetchWithLogs } from '@core/api/utils'
import merklConfig from '@core/config'
import { DEFAULT_ITEMS_PER_PAGE } from '@core/constants/pagination'
import type { Opportunity } from '@merkl/api'

export abstract class OpportunityService {
  static async getManyFromRequest(
    request: Request,
    overrides?: Parameters<typeof api.v4.opportunities.index.get>[0]['query'],
  ) {
    return OpportunityService.getMany(
      Object.assign(
        OpportunityService.#getQueryFromRequest(request),
        overrides ?? {},
      ),
    )
  }
  // ─── Get Many Opportunities ──────────────────────────────────────────────

  static async getMany(
    query: Parameters<typeof api.v4.opportunities.index.get>[0]['query'],
  ): Promise<{ opportunities: Opportunity[]; count: number }> {
    //TODO: updates tags to take an array
    const overrideQuery = {
      ...query,
      sort: query.sort ?? merklConfig.opportunity.library.sortedBy,
    }
    const opportunities = await OpportunityService.#fetch(async () =>
      api.v4.opportunities.index.get({
        query: Object.assign(
          { ...overrideQuery },
          merklConfig.tags?.[0] ? { tags: merklConfig.tags?.[0] } : {},
        ),
      }),
    )
    const count = await OpportunityService.#fetch(async () =>
      api.v4.opportunities.count.get({
        query: Object.assign(
          { ...overrideQuery },
          merklConfig.tags?.[0] ? { tags: merklConfig.tags?.[0] } : {},
        ),
      }),
    )

    return { opportunities: opportunities.filter((o) => o !== null), count }
  }

  // ─── Get Featured opportunities ──────────────────────────────────────────────

  static async getFeatured(
    request: Request,
    overrides?: Parameters<typeof api.v4.opportunities.index.get>[0]['query'],
  ): Promise<{ opportunities: Opportunity[]; count: number }> {
    if (merklConfig.opportunity.featured.enabled)
      return await OpportunityService.getMany(
        Object.assign(OpportunityService.#getQueryFromRequest(request), {
          items: merklConfig.opportunity.featured.length,
          ...overrides,
        }),
      )
    return { opportunities: [], count: 0 }
  }

  // ─── Get Opportunities with campaign ──────────────────────────────────────────────

  static async getCampaignsByParams(query: {
    chainId: number
    type: string
    identifier: string
  }) {
    const { chainId, type, identifier } = query
    const opportunityWithCampaigns = await OpportunityService.#fetch(async () =>
      api.v4
        .opportunities({ id: `${chainId}-${type}-${identifier}` })
        .campaigns.get({
          query: {
            test: merklConfig.alwaysShowTestTokens ?? false,
          },
        }),
    )

    // TODO: updates tags to take an array
    if (
      merklConfig.tags?.length &&
      merklConfig.tags &&
      !opportunityWithCampaigns.tags.includes(merklConfig.tags?.[0])
    )
      throw new Response('Opportunity inaccessible', { status: 403 })

    return opportunityWithCampaigns
  }

  // ─── Get Aggregate ──────────────────────────────────────────────

  static async getAggregate(
    query: Parameters<typeof api.v4.opportunities.index.get>[0]['query'],
    params: 'dailyRewards',
  ) {
    return await OpportunityService.#fetch(async () =>
      api.v4.opportunities.aggregate({ field: params }).get({ query }),
    )
  }

  static async #fetch<
    R,
    T extends { data: R; status: number; response: Response }
  >(
    call: () => Promise<T>,
    resource = 'Opportunity',
  ): Promise<NonNullable<T['data']>> {
    const { data, status } = await fetchWithLogs(call)

    if (status === 404) throw new Response(`${resource} not found`, { status })
    if (status === 500)
      throw new Response(`${resource} unavailable`, { status })
    if (data == null) throw new Response(`${resource} unavailable`, { status })
    return data
  }

  /**
   * Retrieves opportunities query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  /**
   * Retrieves opportunities query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.opportunities.index.get>[0]['query'],
  ) {
    const url = new URL(request.url)

    const filters = {
      status: url.searchParams.get('status') ?? undefined,
      mainProtocolId:
        url.searchParams.get('protocol') ??
        url.searchParams.get('mainProtocolId') ??
        undefined,
      action: url.searchParams.get('action') ?? undefined,
      chainId: url.searchParams.get('chain') ?? undefined,
      minimumTvl: url.searchParams.get('tvl') ?? undefined,
      items: url.searchParams.get('items')
        ? Number(url.searchParams.get('items'))
        : DEFAULT_ITEMS_PER_PAGE,
      sort: url.searchParams.get('sort')?.split('-')[0],
      order: url.searchParams.get('sort')?.split('-')[1],
      name: url.searchParams.get('search') ?? undefined,
      test: merklConfig.alwaysShowTestTokens
        ? true
        : url.searchParams.get('test') ?? false,
      page: url.searchParams.get('page')
        ? Math.max(Number(url.searchParams.get('page')) - 1, 0)
        : undefined,
      ...override,
    }

    // Remove null/undefined values
    const query = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null,
      ),
    )

    return query
  }

  static getDescription(
    opportunity: Pick<Opportunity, 'tokens' | 'protocol' | 'chain' | 'action'>,
  ) {
    const symbols = opportunity.tokens?.map((t) => t.symbol).join('-')

    switch (opportunity.action) {
      case 'POOL':
        return `Earn rewards by providing liquidity to the ${opportunity.protocol?.name} ${symbols} pool on ${opportunity.chain.name}, or through a liquidity manager supported by Merkl`
      case 'HOLD':
        return `Earn rewards by holding ${symbols}, or if also available by staking it in a contract supported by Merkl`
      case 'LEND':
        return `Earn rewards by supplying liquidity to the ${opportunity.protocol?.name} ${symbols} on ${opportunity.chain.name}`
      case 'BORROW':
        return `Earn rewards by borrowing ${symbols} on ${opportunity.protocol?.name} on ${opportunity.chain.name}`
      case 'DROP':
        return `Visit your dashboard to check if you've earned rewards from this airdrop`
      default:
        break
    }
  }
}
