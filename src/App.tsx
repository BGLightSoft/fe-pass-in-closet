import { AppProviders } from "./app/providers";
import { AppRoutes } from "./app/routes";
import { Toaster } from "./shared/ui/toaster";

function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster />
    </AppProviders>
  );
}

export default App;
