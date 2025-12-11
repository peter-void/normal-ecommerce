import { UserAuth } from "@/types";
import { Mail } from "lucide-react";

export function ContactsCard({ user }: { user: UserAuth }) {
  return (
    <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Mail className="w-32 h-32 text-black" />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-2xl font-heading uppercase">Contacts</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="group relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
            Email Address
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
              {user.email || "Not provided"}
            </span>
          </div>
          <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
        </div>

        <div className="group relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
            Phone Number
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
              {user.phoneNumber || "Not provided"}
            </span>
          </div>
          <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
