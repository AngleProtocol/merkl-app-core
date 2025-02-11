import merklConfig from "@core/config";
import type { MerklConfig } from "@core/config/type";
import type { Themes } from "packages/dappkit/src";

export abstract class MetadataService {
  static wrapMetadata<
    Ressource extends keyof MerklConfig<Themes>["metaDatas"],
    Args extends Parameters<MerklConfig<Themes>["metaDatas"][Ressource]>,
  >(ressource: Ressource, args: Args) {
    // @ts-ignore
    const localMetadatas = merklConfig.metaDatas[ressource](...args);
    const globalMetadatas = merklConfig.metaDatasGlobal(args[0]);

    return [...globalMetadatas, ...localMetadatas];
  }

  static getDescription<
    Ressource extends keyof MerklConfig<Themes>["metaDatas"],
    Args extends Parameters<MerklConfig<Themes>["metaDatas"][Ressource]>,
  >(ressource: Ressource, args: Args) {
    // @ts-ignore
    const localMetadatas = merklConfig.metaDatas[ressource](...args);
    const description = localMetadatas.find(metadata => metadata.property === "description");

    return description?.content;
  }
}
