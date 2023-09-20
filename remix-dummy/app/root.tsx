import { useEffect, useMemo, useState } from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeContext from "~/contexts/ThemeContext";
import baseStyles from "~/styles/base.css";

const queryClient = new QueryClient();

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: baseStyles },
];

export default function App() {
  const navigation = useNavigation();
  const [theme, setTheme] = useState();
  const themeMemo = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  useEffect(() => {
    const currentTheme: any = localStorage.getItem("theme") ?? "light";
    setTheme(currentTheme);
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {navigation.state !== "idle" ? <div>Loading...</div> : null}
        <QueryClientProvider client={queryClient}>
          <ThemeContext.Provider value={themeMemo}>
            <Outlet />
            <ReactQueryDevtools />
          </ThemeContext.Provider>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
