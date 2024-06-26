import Link from "next/link";
import Header from "@/components/HeaderDetails/Header";
import FooterAdmin from "@/components/FooterDetails/FooterAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Header />
      <div className="flex-grow flex items-center justify-center py-12"> 
        <div className="mx-auto">
          <div className="text-center">
            <div className="text-2xl font-semibold">Login to AskGovMy</div>
            <p className="text-balance text-muted-foreground">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                required
              />
            </div>

            {/* Removed empty grid gap-2 div */}
            
            <Button type="submit" className="w-full">
              Continue with Email
            </Button>
            
            <div className="text-center">OR</div>
            
            <Button className="w-full">
              Continue with MyGovUC
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="ml-auto inline-block text-sm">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>

      <FooterAdmin />
    </div>
  );
}

export default AdminPage;
