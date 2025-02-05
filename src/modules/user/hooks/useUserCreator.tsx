import type { Creator } from "@merkl/api/dist/src/modules/v4/creator";
import { useWalletContext } from "dappkit";
import { useEffect, useMemo, useState } from "react";
import { UserService } from "../user.service";

export default function useUserCreator(userAddress?: string) {
  const { address: connectedAddress } = useWalletContext();
  const [creators, setCreators] = useState<{ [address: string]: Creator["model"] }>({});

  const address = useMemo(() => userAddress ?? connectedAddress, [userAddress, connectedAddress]);
  const creator = useMemo(() => address && creators?.[address], [address, creators]);

  useEffect(() => {
    async function fetchCreator() {
      if (!address) return;

      const userCreator = await UserService.getCreatorOf(address);

      setCreators(c => ({ ...c, ...{ [address]: userCreator } }));
    }

    fetchCreator();
  }, [address]);

  return { creator };
}
