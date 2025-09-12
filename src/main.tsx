// Sentry initialization should be imported first!
import "./instrument";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableMocking } from "@/mocks/enableMocks";

// Simplify the rendering process to reduce potential errors
async function bootstrap() {
  await enableMocking();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
  );
}

bootstrap();
