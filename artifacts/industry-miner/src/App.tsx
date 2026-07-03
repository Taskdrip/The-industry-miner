import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CourseDetails from "@/pages/course-details";
import JewelleryMasterclass from "@/pages/jewellery-masterclass";
import AdminPage from "@/pages/admin";
import Dashboard from "@/pages/dashboard";
import CourseViewer from "@/pages/course-viewer";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/course/:id" component={CourseDetails} />
      <Route path="/jewellery-masterclass" component={JewelleryMasterclass} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/course/:courseId" component={CourseViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
