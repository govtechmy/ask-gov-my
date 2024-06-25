import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminPage() {
  return (
      <div className="flex items-center justify-center py-12 h-full min-h-[600px]">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login to AskGovMy</h1>
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
            <div className="grid gap-2">
            </div>
            <Button type="submit" className="w-full">
              Continue with Email
            </Button>
            <div className="text-center">OR</div>
            <Button className="w-full">
              Continue with MyGovUC
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm "
                >
                  Forgot your password?
            </Link>
          </div>
        </div>
      </div>
  )
}

export default AdminPage;
