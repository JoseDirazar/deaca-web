import React, { useEffect } from "react";
import { useLocation } from "react-router";
import ReactGA from "react-ga4";

ReactGA.initialize("G-LK8BDNZLHP", {
  testMode: true,
});
// TODO: Estanciar y testear
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}
