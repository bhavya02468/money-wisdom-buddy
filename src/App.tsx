import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Investments from "@/pages/Investments";
import AddInvestment from "@/pages/AddInvestment";
import { ToastProvider } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investments" element={<Investments />} />
          <Route
            path="/add-investment"
            element={
              <DashboardLayout>
                <AddInvestment />
              </DashboardLayout>
            }
          />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;