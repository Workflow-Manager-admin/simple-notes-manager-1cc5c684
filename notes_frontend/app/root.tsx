import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import "./tailwind.css";

// Types for ENV
type ENVType = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
};

/**
 * PUBLIC_INTERFACE
 * Remix root loader, exposes ENV vars to client.
 */
export async function loader() {
  // Pass env variables as window.ENV for client-side Supabase
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL || "",
      SUPABASE_KEY: process.env.SUPABASE_KEY || "",
    },
  });
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Only used to inject ENV; skip type warnings
  return (
    <html lang="en" style={{ background: "#f7fafc" }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white min-h-screen text-gray-900 font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* Inject ENV variables into window for client-side Supabase client */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              typeof window !== "undefined"
                ? (window as { ENV: ENVType }).ENV
                : ((globalThis as unknown) as { ENV: ENVType }).ENV ?? {}
            )}`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
