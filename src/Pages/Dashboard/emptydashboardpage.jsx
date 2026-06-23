import { Button } from "reactstrap";
import { PlusCircle, Clipboard } from "react-feather";

import "./emptydashboard.scss";

const EmptyDashboard = ({ onCreateTask }) => {
  return (
    <div className="empty-dashboard">
      <div className="empty-icon">
        <Clipboard size={42} />
      </div>

      <h2>Welcome 👋</h2>

      <p className="empty-title">
        No tasks found in this sprint
      </p>

      <p className="empty-description">
        Create your first task to start tracking progress,
        monitor team performance, and unlock dashboard reports.
      </p>

      {/* <Button color="primary" onClick={onCreateTask}>
        <PlusCircle size={16} className="me-50" />
        Create First Task
      </Button> */}
    </div>
  );
};

export default EmptyDashboard;