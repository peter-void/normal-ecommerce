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
    (session) => session.token === currentSessionToken,
  );

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken,
  );

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <div className="h-2 w-2 bg-black rounded-full" />
          <h2 className="text-lg font-bold uppercase tracking-widest text-black">
            Current Session
          </h2>
        </div>
        {currentSession && (
          <SessionCard session={currentSession} isCurrentSession />
        )}
      </section>

      {otherSessions.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
            <div className="h-2 w-2 bg-gray-300 rounded-full" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-black">
              Active Sessions
            </h2>
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
      },
    );
  };

  return (
    <div
      className={`
      relative group
      border p-6 
      ${isCurrentSession ? "border-black bg-gray-50" : "border-gray-200 bg-white"}
      transition-all duration-200
    `}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div
            className={`
            p-4 border 
            ${isCurrentSession ? "border-black bg-white" : "border-gray-200 bg-gray-50 text-gray-400"}
          `}
          >
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone size={24} strokeWidth={2} />
            ) : (
              <Monitor size={24} strokeWidth={2} />
            )}
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold uppercase tracking-tight text-black">
                {getBrowserInformation()}
              </h3>
              {isCurrentSession && (
                <Badge className="bg-black text-white hover:bg-black border-0 rounded-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  Active Now
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="w-16">Created</span>
                <span className="text-black">
                  {formatDate(session.createdAt, "PPP p")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="w-16">Expires</span>
                <span className="text-black">
                  {formatDate(session.expiresAt, "PPP p")}
                </span>
              </div>
            </div>

            {session.ipAddress && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
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
              h-10 px-6
              bg-white hover:bg-red-50 hover:border-red-500 hover:text-red-500
              text-black border border-gray-200 rounded-none
              transition-colors duration-200
              font-bold uppercase tracking-widest text-xs
              flex items-center gap-2
            "
          >
            <Trash2Icon size={16} strokeWidth={2} className="mr-1" />
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}
