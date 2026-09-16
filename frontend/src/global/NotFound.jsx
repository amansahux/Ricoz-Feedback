import { Link } from "react-router";
import Button from "../shared/components/Button.jsx";
 function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#FAFAFA]">
      <p className="font-mono uppercase tracking-widest text-xs text-[#C7263D]">
        404
      </p>
      <h1 className="font-poppins text-4xl font-semibold text-[#111113] mt-3">
        This page slipped through the feedback loop.
      </h1>
      <p className="text-[#71717A] mt-3 max-w-md">
        The page you're looking for doesn't exist. Head back to your dashboard.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
 
export default NotFound;