import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowed = [] }) {
  const { currentUser , loadingsingle } = useSelector((state) => state.userListPage);

  if (loadingsingle) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }


  if (allowed.length && !allowed.includes(currentUser?.role)) {
    return <Navigate to="/no-access" replace />;
  }

  return <Outlet />;
}
