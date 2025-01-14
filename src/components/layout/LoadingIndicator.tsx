import { useNavigation } from "@remix-run/react";
import { Bar, mergeClass } from "dappkit";
import { useEffect, useState } from "react";

const RESET_DELAY = 250;
const LOADING_BASE = 20;
const LOADING_RANDOMNESS_FACTOR = 20;

export default function LoadingIndicator() {
  const navigation = useNavigation();

  const [previous, setPrevious] = useState<(typeof navigation)["state"]>("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    switch (navigation.state) {
      case "idle":
        if (previous === "loading") setProgress(100);
        else {
          setTimeout(() => {
            setProgress(0);
          }, RESET_DELAY);
        }
        break;
      case "loading":
        setProgress(LOADING_BASE + Math.random() * LOADING_RANDOMNESS_FACTOR);
        break;
      default:
        break;
    }

    setPrevious(navigation.state);
  }, [navigation.state, previous]);

  return (
    <div className="absolute z-50 w-[100vw]">
      <Bar
        className={mergeClass("!p-0 !h-[3px]", progress === 0 && "opacity-0")}
        total={100}
        values={[{ value: progress, className: "bg-accent-8 transition-all duration-100" }]}
      />
    </div>
  );
}
