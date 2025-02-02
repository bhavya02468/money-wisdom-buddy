import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { LineChart, LogOut, PlusCircle, Target, Building2, Coins, User } from "lucide-react";
import { AIAdvisorWidget } from "./AIAdvisorWidget";
import { useEffect, useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Check if the current path is active
  const isActive = (path: string) => location.pathname === path;

  // Utility function to set button classes based on active state
  const menuButtonClasses = (active: boolean) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
      active ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar className="bg-white border-r shadow-md">
          <SidebarHeader className="px-4 pt-7 pb-4 border-b">
            <Link to="/dashboard" className="flex items-center">
              {/* Optionally include a logo image here */}
              <span className="text-primary text-3xl font-bold">FinWise</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={menuButtonClasses(isActive("/dashboard"))}>
                      <Link to="/dashboard">
                        <LineChart className="w-5 h-5" />
                        <span className="text-xl font-semibold">Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={menuButtonClasses(isActive("/investments"))}>
                      <Link to="/investments">
                        <Building2 className="w-5 h-5" />
                        <span className="text-xl font-semibold">Investments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/investment-recommender")}
                      className={menuButtonClasses(isActive("/investment-recommender"))}
                    >
                      <Coins className="w-5 h-5" />
                      <span className="text-xl font-semibold">Investment Recommender</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/financial-goals")}
                      className={menuButtonClasses(isActive("/financial-goals"))}
                    >
                      <Target className="w-5 h-5" />
                      <span className="text-xl font-semibold">Financial Goals</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-xl font-semibold">Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/add-expense")}
                      className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-200"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="text-xl font-semibold">Add Expense</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/add-income")}
                      className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-200"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="text-xl font-semibold">Add Income</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* User Profile at the Bottom */}
          <div className="p-4 border-t flex items-center gap-3">
            <User className="w-8 h-8 text-gray-700" />
            <span className="text-lg font-semibold text-gray-700">{localStorage.getItem("fullName")}</span>
          </div>

        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 px-6 py-6 bg-gray-50">{children}</main>

          <AIAdvisorWidget />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
