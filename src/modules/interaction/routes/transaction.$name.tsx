import type { ActionFunctionArgs } from "react-router";
import { encodeFunctionData, parseAbi } from "viem";
import { api } from "../../../api/";
import { ZyfiService } from "../../../modules/zyfi/zyfi.service";

// biome-ignore lint/suspicious/noExplicitAny: TODO: enhance this behavior
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const action = async ({ params: { name }, request }: ActionFunctionArgs) => {
  const payload = await request.json();
  const zyfiService = ZyfiService({});

  switch (name) {
    case "claim": {
      const abi = parseAbi(["function claim(address[],address[],uint256[],bytes32[][]) view returns (uint256)"]);
      const tx = {
        to: payload.distributor,
        from: payload.userAddress,
        data: encodeFunctionData({
          abi,
          functionName: "claim",
          args: payload.args,
        }),
      };
      if (payload.sponsor) {
        const sponsoredTx = await zyfiService.wrapAndPrepareTx(tx);

        return sponsoredTx;
      }
      return tx;
    }
    case "supply": {
      try {
        const { data: tx } = await api.v4.interaction.transaction.get({
          query: payload,
        });

        if (!tx) return new Response(tx, { status: 500 });

        if (payload.sponsor && !tx.approved) {
          tx.approval = (await zyfiService.wrapAndPrepareTx({
            ...tx.approval,
            from: payload.userAddress,
          }))!;
        } else if (payload.sponsor) {
          tx.transaction = (await zyfiService.wrapAndPrepareTx({
            ...tx.transaction,
            from: payload.userAddress,
          }))!;
        }

        return tx;
      } catch (err) {
        console.error(err);

        return new Response("Failed to prepare transaction", { status: 500 });
      }
    }
    case "deposit": {
      const abi = parseAbi([
        "function createCampaign((bytes32,address,address,uint256,uint32,uint32,uint32,bytes)) returns (bytes32)",
      ]);

      const tx = {
        to: payload.distributionCreator,
        from: payload.args.creator,
        data: encodeFunctionData({
          abi,
          functionName: "createCampaign",
          args: [
            [
              payload.args.campaignId, // bytes32
              payload.args.creator, // address
              payload.args.rewardToken, // address
              BigInt(payload.args.amount), // uint256
              payload.args.campaignType, // uint32
              payload.args.startTimestamp, // uint32
              payload.args.duration, // uint32
              payload.args.campaignData, // bytes
            ],
          ],
        }),
      };

      if (payload.sponsor) {
        const sponsoredTx = await zyfiService.wrapAndPrepareTx(tx);
        return sponsoredTx;
      }

      return tx;
    }
    case "approve": {
      const abi = parseAbi(["function approve(address spender, uint256 amount) returns (bool)"]);

      const tx = {
        to: payload.tokenAddress,
        from: payload.userAddress,
        data: encodeFunctionData({
          abi,
          functionName: "approve",
          args: [payload.spender, BigInt(payload.amount ?? "1")], // Address of the spender and the amount
        }),
      };

      if (payload.sponsor) {
        const sponsoredTx = await zyfiService.wrapAndPrepareTx(tx);
        return sponsoredTx;
      }

      return tx;
    }
  }
};
