import { AppRouter } from "./routes/router";
import { SettingsProvider } from "./contexts/SettingsContext";

function App() {
  return (
    <SettingsProvider>
      <AppRouter />
    </SettingsProvider>
  );
}

export default App;
