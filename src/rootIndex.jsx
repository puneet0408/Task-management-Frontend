import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toSlug } from "./Utils/srugs";

export default function RootIndexRedirect() {
  const navigate = useNavigate();
  const { currentUser, loadingsingle } = useSelector(
    (state) => state.userListPage
  );
  useEffect(() => {
    if (loadingsingle || !currentUser) return;

       if (currentUser.role == "superadmin") {
      navigate("/company", { replace: true });
      return;
    }
    const companyName = currentUser?.company?.company_name;
    const projectName =
      currentUser?.preferences?.activeProject?.projectName;
    if (!companyName || !projectName) {
      navigate("/projects", { replace: true });
      return;
    }
    const companySlug = toSlug(companyName);
    const projectSlug = toSlug(projectName);
    navigate(
      `/${companySlug}/${projectSlug}/dashboard`,
      { replace: true }
    );
  }, [loadingsingle, currentUser, navigate]);

  return null;
}
