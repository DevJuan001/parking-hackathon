import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { useTheme } from "./globals/hooks/useTheme";

function App() {
  useTheme();

  return (
    <div>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <div id="modal-root"></div>
    </div>
  );
}

export default App;
