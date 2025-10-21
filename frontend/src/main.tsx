
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import App from "./App.tsx";
import "./index.css"

const container = document.getElementById("root");
if (!container) throw new Error("Root container is missing")

const root = createRoot(container);

root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      redirectUri: window.location.origin + '/home'
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactKeycloakProvider>
);