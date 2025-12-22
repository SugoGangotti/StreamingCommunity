import { PageTemplate } from "./components/page-template";
import { Homepage } from "./pages/homepage";

function App() {
  return (
    <PageTemplate className="w-screen h-screen">
      <Homepage />
    </PageTemplate>
  );
}

export default App;
