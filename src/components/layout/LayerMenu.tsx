import { NavLink } from "@remix-run/react";
import { Divider, Group, Text } from "dappkit";
import { Icon } from "dappkit";
import config from "merkl.config";
import type { FC } from "react";
import type { routesType } from "../../config/type";
import SwitchMode from "../element/SwitchMode";
import SearchBar from "../element/functions/SearchBar";

export const LayerMenu: FC<{
  nav: routesType;
  setOpen: (open: boolean) => void;
}> = ({ nav, setOpen }) => {
  return (
    <div className="layermenu z-50 min-w-64 bg-main-2 flex flex-col">
      <main className="flex-1 overflow-y-scroll w-full">
        <ul className="min-w-max list-none flex gap-lg flex-col">
          {Object.entries(nav).map(([key, value]) => (
            <li key={value.key} className="flex-col gap-md flex">
              {value.external ? (
                <a
                  href={value.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.open(value.route, "_blank", "noopener noreferrer")}
                  className={`dim flex items-center gap-md ${["faq"].includes(key) ? "uppercase" : "capitalize"}`}>
                  <Icon remix={value.icon} className="text-xl text-main-11" />
                  <Text size="lg" bold className="text-main-12">
                    {key}
                  </Text>
                </a>
              ) : (
                <NavLink
                  onClick={() => setOpen(false)}
                  to={value.route}
                  className={`dim flex items-center gap-md ${["faq"].includes(key) ? "uppercase" : "capitalize"}`}>
                  <Icon remix={value.icon} className="text-xl text-main-11" />
                  <Text size="lg" bold className="text-main-12">
                    {key}
                  </Text>
                </NavLink>
              )}
              <Divider />
            </li>
          ))}
        </ul>
      </main>
      <footer className="mt-lg">
        <Group className="items-center">
          {config.header.searchbar.enabled && <SearchBar />}
          <SwitchMode />
        </Group>
      </footer>
    </div>
  );
};
