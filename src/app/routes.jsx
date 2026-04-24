import { useState, useEffect } from "react";
import InvoicesPage from "../pages/InvoicesPage";
import InvoiceDetailPage from "../pages/InvoiceDetailPage";

/**
 * Minimal hash-based router.
 * Routes:
 *   #/          → InvoicesPage
 *   #/invoices/:id → InvoiceDetailPage
 */
function getRoute() {
  const hash = window.location.hash.replace("#", "") || "/";
  const match = hash.match(/^\/invoices\/([A-Z0-9]+)$/);
  if (match) return { name: "detail", id: match[1] };
  return { name: "list" };
}

export function navigate(path) {
  window.location.hash = path;
}

export function useRoutes() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route.name === "detail") return <InvoiceDetailPage id={route.id} />;
  return <InvoicesPage />;
}