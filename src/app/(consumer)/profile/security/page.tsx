import { SessionManagement } from "@/features/profile/components/session-management";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const listSessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Security
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage your account security and sessions.
        </p>
      </div>

      <div className="grid gap-8">
        <SessionManagement
          currentSessionToken={session?.session.token as string}
          sessions={listSessions}
        />
      </div>
    </div>
  );
}
