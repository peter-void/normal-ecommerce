"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Session } from "better-auth";
import { formatDate } from "date-fns";
import { Monitor, Smartphone, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";

interface SessionManagementProps {
  currentSessionToken: string;
  sessions: Session[];
}

export function SessionManagement({
  currentSessionToken,
  sessions,
}: SessionManagementProps) {
  const currentSession = sessions.find(
    (session) => session.token === currentSessionToken
  );

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken
  );

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b-4 border-black pb-4">
          <div className="h-4 w-4 bg-cyan-400 border-2 border-black" />
          <h2 className="text-xl font-black uppercase">Current Session</h2>
        </div>
        {currentSession && (
          <SessionCard session={currentSession} isCurrentSession />
        )}
      </section>

      {otherSessions.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b-4 border-black pb-4">
            <div className="h-4 w-4 bg-yellow-400 border-2 border-black" />
            <h2 className="text-xl font-black uppercase">Active Sessions</h2>
          </div>
          <div className="grid gap-6">
            {otherSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SessionCard({
  session,
  isCurrentSession,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const getBrowserInformation = () => {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null)
      return "Unknown Device";

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name} ${userAgentInfo.os.name}`;
  };

  const revokeSession = () => {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  return (
    <div
      className={`
      relative group
      border-4 border-black p-6 
      ${isCurrentSession ? "bg-cyan-50" : "bg-white"}
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      transition-all duration-200
      hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    `}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div
            className={`
            p-4 border-4 border-black 
            ${isCurrentSession ? "bg-cyan-400" : "bg-yellow-400"}
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          `}
          >
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone size={32} strokeWidth={3} />
            ) : (
              <Monitor size={32} strokeWidth={3} />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-black uppercase">
                {getBrowserInformation()}
              </h3>
              {isCurrentSession && (
                <Badge className="bg-black text-white border-2 border-black rounded-none px-3 font-bold uppercase tracking-wider">
                  Active Now
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase">
                <span className="w-20">Created</span>
                <span className="text-black">
                  {formatDate(session.createdAt, "PPP p")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase">
                <span className="w-20">Expires</span>
                <span className="text-black">
                  {formatDate(session.expiresAt, "PPP p")}
                </span>
              </div>
            </div>

            {session.ipAddress && (
              <p className="text-xs font-black text-muted-foreground/60 uppercase">
                IP: {session.ipAddress}
              </p>
            )}
          </div>
        </div>

        {!isCurrentSession && (
          <Button
            type="button"
            onClick={revokeSession}
            className="
              h-auto py-4 px-6
              bg-red-500 hover:bg-red-600 
              text-white border-4 border-black rounded-none
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
              font-black uppercase tracking-tighter
              flex items-center gap-2
            "
          >
            <Trash2Icon size={20} strokeWidth={3} />
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}
