import { Container, Group, Space, Title } from "dappkit";
import { useMemo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorContent() {
  const error = useRouteError();
  const errorTitle = useMemo(() => {
    if (isRouteErrorResponse(error)) return error.data;
    return "Unavailable";
  }, [error]);

  return (
    <Container>
      {Array(10).fill(<Space size="xl" />)}
      <Group className="justify-center align-middle h-full">
        <Title h={5} look="soft">
          {errorTitle}
        </Title>
      </Group>
    </Container>
  );
}
