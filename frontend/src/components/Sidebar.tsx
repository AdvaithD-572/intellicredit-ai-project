import Link from "next/link";
import { 
  LayoutDashboard, 
  FileUp, 
  Search, 
  LineChart, 
  Briefcase, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`glass flex flex-col justify-between py-6 px-4 ${className}`}>
      <div>
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Briefcase className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Intelli<span className="text-accent-primary">Credit</span></span>
        </div>

        <nav className="space-y-2">
          <SidebarItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem href="/upload" icon={<FileUp size={20} />} label="Upload Data" />
          <SidebarItem href="/research" icon={<Search size={20} />} label="AI Research" />
          <SidebarItem href="/analysis" icon={<LineChart size={20} />} label="Risk Analysis" />
          <SidebarItem href="/chat" icon={<Search size={20} />} label="Document Chat" />
          <SidebarItem href="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
      </div>

      <div className="px-2">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors group">
          <LogOut size={20} className="group-hover:text-accent-danger transition-colors" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        active 
          ? "bg-accent-primary/10 text-accent-primary shadow-[inset_2px_0_0_hsl(var(--accent-primary))]" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}
