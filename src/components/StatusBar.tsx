import { getProjectStats } from "@/lib/githubData";

const StatusBar = () => {
  const stats = getProjectStats();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[26px] z-50 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm border-t border-[#3ecf8e]/5 hidden md:flex items-center justify-between px-6 font-mono text-[10px] text-white/25 tracking-wide">
      <div className="flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] mr-2 inline-block" />
        <span>darshpoddar.com</span>
      </div>

      <div>
        {stats.repos} repos · 2021–2026
      </div>

      <div className="flex items-center">
        <kbd className="bg-[#3ecf8e]/5 border border-[#3ecf8e]/10 rounded px-1.5 py-0.5 text-[#3ecf8e]/50 text-[9px] mr-1">
          ⌘K
        </kbd>
        <span> commands · ↓ scroll</span>
      </div>
    </div>
  );
};

export default StatusBar;
