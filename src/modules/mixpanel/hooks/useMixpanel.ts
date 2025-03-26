import { useEffect } from "react"
import { MixpanelService } from "../mixpanel.service";

export default function useMixpanel(token?: string) {

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (typeof document === "undefined" || !token) return;

        MixpanelService({token}).init();

        return () => {}
    }, []);

    return {

    }
}