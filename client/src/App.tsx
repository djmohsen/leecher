import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import UploadPage from "@/pages/upload";
import FilesPage from "@/pages/files";
import FilePage from "@/pages/file";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={UploadPage} />
      <Route path="/files" component={FilesPage} />
      <Route path="/file/:id" component={FilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Navbar />
      <main className="min-h-screen">
        <Router />
      </main>
      <Footer />
    </TooltipProvider>
  );
}

export default App;
