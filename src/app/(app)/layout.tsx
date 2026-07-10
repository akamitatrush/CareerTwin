import { AppHeader } from "@/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let fullName: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();

    fullName =
      profile?.full_name ||
      (user.user_metadata?.full_name as string | undefined) ||
      user.email ||
      undefined;
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader fullName={fullName} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
