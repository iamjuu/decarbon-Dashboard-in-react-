import { useEffect } from "react";

export function usePreventNavigation() {
  useEffect(() => {
    const DASHBOARD_URL = "https://nos2kannur.in/Nos2/controlpanel/dashboard/"; // ✅ Absolute URL

    // 🚀 Detect page reload and redirect to the external dashboard
    if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
      window.location.href = DASHBOARD_URL; // ✅ Redirect to absolute URL
    }

    const preventReload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Shows "Are you sure you want to leave?"
    };

    const blockKeyPress = (event) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        alert("Reloading is disabled!");
      }
    };

    const blockRightClick = (event) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", preventReload);
    window.addEventListener("keydown", blockKeyPress);
    window.addEventListener("contextmenu", blockRightClick);

    return () => {
      window.removeEventListener("beforeunload", preventReload);
      window.removeEventListener("keydown", blockKeyPress);
      window.removeEventListener("contextmenu", blockRightClick);
    };
  }, []);
}

