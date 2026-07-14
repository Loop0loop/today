import { AppProviders } from "@/lifecycle/providers/AppProviders";
import { AppShell } from "@/app/AppShell";
import "./App.css";

function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}

export default App;
