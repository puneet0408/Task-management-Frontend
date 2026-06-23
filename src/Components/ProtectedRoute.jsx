import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "../Pages/loadingpage";

export default function ProtectedRoute({ allowed = [] }) {
  const { currentUser , loadingsingle } = useSelector((state) => state.userListPage);

  if (loadingsingle) {
    return <div><LoadingScreen/></div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }


  if (allowed.length && !allowed.includes(currentUser?.role)) {
    return <Navigate to="/no-access" replace />;
  }

  return <Outlet />;
}
