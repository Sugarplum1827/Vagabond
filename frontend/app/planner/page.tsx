import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { opportunities } from "@/lib/opportunities";
import ApplicationPlanner from "./ApplicationPlanner";

export default function PlannerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="site-wrap py-12 flex-1">
        <p className="font-cinzel text-sm text-[var(--red)]">Study abroad for Filipino students</p>
        <h1 className="font-cinzel text-4xl font-bold my-4">Application Planner</h1>
        <p className="font-fell text-lg max-w-2xl mb-8">
          Compare sourced opportunities by intake, save a shortlist, and prepare your application.
          Closed calls are included for planning. Your checklist stays in this browser.
        </p>
        <ApplicationPlanner opportunities={opportunities} />
      </main>
      <Footer />
    </div>
  );
}
