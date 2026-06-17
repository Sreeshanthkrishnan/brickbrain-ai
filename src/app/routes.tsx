import { createBrowserRouter } from "react-router";

// Auth screens
import SplashScreen from "./screens/SplashScreen";
import Onboarding1 from "./screens/Onboarding1";
import Onboarding2 from "./screens/Onboarding2";
import Onboarding3 from "./screens/Onboarding3";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

// Main app screens
import DashboardHome from "./screens/DashboardHome";
import AIEstimationForm from "./screens/AIEstimationForm";
import CostEstimationResult from "./screens/CostEstimationResult";
import MaterialCalculator from "./screens/MaterialCalculator";
import LiveMaterialPricing from "./screens/LiveMaterialPricing";
import LaborPlanning from "./screens/LaborPlanning";
import ConstructionTimeline from "./screens/ConstructionTimeline";
import ProjectMilestones from "./screens/ProjectMilestones";
import AIRecommendations from "./screens/AIRecommendations";
import BudgetTracking from "./screens/BudgetTracking";
import ExpenseEntry from "./screens/ExpenseEntry";
import HouseVisualization3D from "./screens/HouseVisualization3D";
import FloorPlanning3D from "./screens/FloorPlanning3D";
import AIChatbot from "./screens/AIChatbot";
import ConstructionAnalytics from "./screens/ConstructionAnalytics";
import ProjectProgress from "./screens/ProjectProgress";
import TeamManagement from "./screens/TeamManagement";
import AttendanceMonitoring from "./screens/AttendanceMonitoring";
import PaymentTracking from "./screens/PaymentTracking";
import SettingsScreen from "./screens/SettingsScreen";
import AINewsScreen from "./screens/AINewsScreen";
import ProjectsScreen from "./screens/ProjectsScreen";
import UserProfile from "./screens/UserProfile";
import CustomerSupport from "./screens/CustomerSupport";
import FAQScreen from "./screens/FAQScreen";
import AboutBrickBrain from "./screens/AboutBrickBrain";
import SuccessScreen from "./screens/SuccessScreen";

// Layout wrapper
import MainLayout from "./layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/onboarding-1",
    element: <Onboarding1 />,
  },
  {
    path: "/onboarding-2",
    element: <Onboarding2 />,
  },
  {
    path: "/onboarding-3",
    element: <Onboarding3 />,
  },
  {
    path: "/welcome",
    element: <WelcomeScreen />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/signup",
    element: <SignupScreen />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordScreen />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <DashboardHome /> },
      { path: "estimate", element: <AIEstimationForm /> },
      { path: "estimate/result", element: <CostEstimationResult /> },
      { path: "materials", element: <MaterialCalculator /> },
      { path: "pricing", element: <LiveMaterialPricing /> },
      { path: "labor", element: <LaborPlanning /> },
      { path: "timeline", element: <ConstructionTimeline /> },
      { path: "milestones", element: <ProjectMilestones /> },
      { path: "recommendations", element: <AIRecommendations /> },
      { path: "budget", element: <BudgetTracking /> },
      { path: "expenses", element: <ExpenseEntry /> },
      { path: "3d-house", element: <HouseVisualization3D /> },
      { path: "3d-floor", element: <FloorPlanning3D /> },
      { path: "chatbot", element: <AIChatbot /> },
      { path: "analytics", element: <ConstructionAnalytics /> },
      { path: "progress", element: <ProjectProgress /> },
      { path: "team", element: <TeamManagement /> },
      { path: "attendance", element: <AttendanceMonitoring /> },
      { path: "payments", element: <PaymentTracking /> },
      { path: "settings", element: <SettingsScreen /> },
      { path: "ai-news", element: <AINewsScreen /> },
      { path: "projects", element: <ProjectsScreen /> },
      { path: "profile", element: <UserProfile /> },
      { path: "support", element: <CustomerSupport /> },
      { path: "faq", element: <FAQScreen /> },
      { path: "about", element: <AboutBrickBrain /> },
      { path: "success", element: <SuccessScreen /> },
    ],
  },
]);
