
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Outlet />
        </div>
    );
}
