import { Outlet } from "react-router";
import Sidebar from "../../global/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
