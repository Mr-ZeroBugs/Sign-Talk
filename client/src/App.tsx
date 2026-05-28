import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppShell from "@/components/layout/AppShell";
import Home from "@/pages/Home";
import Translate from "@/pages/Translate";
import TalkToSign from "@/pages/TalkToSign";

// Placeholder components for routing
const History = () => <div className="p-8 text-slate-900">History Page (Phase 5)</div>;
const Settings = () => <div className="p-8 text-slate-900">Settings Page (Phase 5)</div>;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/translate" component={Translate} />
      <Route path="/talk-to-sign" component={TalkToSign} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Router />
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
