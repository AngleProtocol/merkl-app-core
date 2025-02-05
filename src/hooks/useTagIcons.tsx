import type { TagProps, TagTypes } from "@core/components/element/Tag";
import { actions } from "@core/config/actions";
import { statuses } from "@core/config/status";
import type { IconProps } from "dappkit";
import { useMemo } from "react";

export default function useTagIcons(tags: TagProps[]) {
  return {
    icons: useMemo(
      () =>
        tags?.map(function defineTagIcon<T extends keyof TagTypes>({ type, value }: { type: T; value: TagTypes[T] }) {
          //TODO: use this everywhere
          const iconDefinitions = {
            action: action => actions[action]?.icon,
            chain: chain => ({ src: chain.icon }),
            protocol: protocol => ({ src: protocol?.icon }),
            status: status => (statuses[status] ?? statuses.LIVE).icon,
            token: token => ({ src: token.icon }),
            tokenChain: token => ({ src: token.icon }),
          } as const satisfies { [K in keyof TagTypes]: (value: TagTypes[K]) => IconProps };

          return (iconDefinitions[type] as (v: typeof value) => IconProps)(value);
        }),
      [tags],
    ),
  };
}
