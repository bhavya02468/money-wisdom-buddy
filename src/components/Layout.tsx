import { Link } from "react-router-dom";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
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
              <Link to="/auth" className="text-text hover:text-primary transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;