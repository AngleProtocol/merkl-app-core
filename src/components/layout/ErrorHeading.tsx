import { Container } from "dappkit";
import { useMemo } from "react";
import { Meta, Outlet, isRouteErrorResponse, useRouteError } from "react-router";
import Hero from "../composite/Hero";

export function ErrorHeading() {
  const error = useRouteError();
  const errorTitle = useMemo(() => {
    if (isRouteErrorResponse(error)) return error.data;
    return "Unavailable";
  }, [error]);
  const errorDetails = useMemo(() => {
    if (isRouteErrorResponse(error)) return "An error occured while fetching this resource";
    return "An error occured while loading this page";
  }, [error]);

  console.error(error);

  return (
    <Hero
      icons={[{ remix: "RiAlertFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={errorTitle}
      description={errorDetails}>
      <Container>
        <Meta />
        <Outlet />
      </Container>
    </Hero>
  );
}
