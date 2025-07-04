import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PiggyBank, BarChart2, ShieldCheck, Repeat } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <PiggyBank className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">BudgetWise</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Take Control of Your Finances
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            BudgetWise is the simple, powerful, and secure way to manage your money,
            track your spending, and achieve your financial goals.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link to="/register">Get Started for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">I have an account</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Everything You Need, All in One Place</h2>
              <p className="mt-2 text-muted-foreground">
                From detailed tracking to insightful reports, we've got you covered.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BarChart2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">Insightful Dashboard</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Visualize your spending, income, and budget progress with beautiful charts and graphs.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Repeat className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">Recurring Transactions</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Automate your bills and subscriptions. Set them once and never worry about them again.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <PiggyBank className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">Smart Budgeting</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create monthly budgets for different categories and get alerts before you overspend.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">Secure & Private</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your financial data is yours alone. We ensure it stays that way with top-tier security.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
                Join thousands of users who have transformed their financial life with BudgetWise.
            </p>
            <Button asChild size="lg" className="mt-8">
                <Link to="/register">Sign Up Now</Link>
            </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BudgetWise. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};