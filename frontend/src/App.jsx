import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { useTheme } from "./globals/hooks/useTheme";

function App() {
  useTheme();

  return (
    <div className="w-screen h-screen bg-[#FBF9FC] dark:bg-[#0a0a0a]">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <div id="modal-root"></div>
    </div>
  );
}

export default App;
