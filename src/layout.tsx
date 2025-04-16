import { Group } from "dappkit";
import { Outlet } from "react-router";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

export default function Index() {
  return (
    <Group size="xl" className="!gap-0 min-h-screen !flex-nowrap flex-col">
      <Header />
      <main className="flex-1 h-full">
        <Outlet />
      </main>
      <Footer />
    </Group>
  );
}
