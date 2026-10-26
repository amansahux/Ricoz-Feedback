import { Navigate } from "react-router";
import { useSelector } from "react-redux";

/**
 * PermissionRoute — blocks access to a route based on the user's role.
 *
 * Props:
 *   allowedRoles  — array of roles allowed to visit this route (e.g. ['owner', 'admin'])
 *   children      — the page to render if access is granted
 *   redirectTo    — where to send non-support_agent users on denial (default: /dashboard)
 *
 * Role-aware redirect:
 *   - support_agent → always redirected to /feedback
 *   - all others    → redirected to `redirectTo` (default /dashboard)
 */
export default function PermissionRoute({
  allowedRoles,
  children,
  redirectTo = "/dashboard",
}) {
  const { user, isHydrating } = useSelector((state) => state.auth);

  // Wait for session to restore before making any redirect decision
  if (isHydrating) return null;

  // Determine where to send the user if access is denied
  const deniedRedirect = user?.role === "support_agent" ? "/feedback" : redirectTo;

  // If the user's role is not in the allowedRoles list, redirect them
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={deniedRedirect} replace />;
  }

  return children;
}
