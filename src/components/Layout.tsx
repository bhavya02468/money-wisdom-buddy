import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-primary text-2xl font-bold">FinWise</span>
            </Link>
            <div className="flex space-x-6">
              <Link to="/" className="text-text hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/chat" className="text-text hover:text-primary transition-colors">
                AI Advisor
              </Link>
              <Link to="/dashboard" className="text-text hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/learn" className="text-text hover:text-primary transition-colors">
                Learn
              </Link>
              <Link to="/expenses" className="text-text hover:text-primary transition-colors">
                Expenses
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;