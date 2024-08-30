import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </React.Fragment>
  ),
});
