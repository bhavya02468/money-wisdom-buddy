import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
          <Link to="/" className="flex items-center space-x-2">
              <span className="text-primary text-2xl font-bold">FinWise</span>
            </Link>
            <p className="text-text-light">
              Your AI-powered financial companion for smarter money decisions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-text-light hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-text-light hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-text-light hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-light hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-light hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-text-light">
          <p>&copy; {new Date().getFullYear()} FinWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;