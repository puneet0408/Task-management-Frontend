const menuConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "FaHome",
    path: "/dashboard",
    roles: ["superadmin", "admin", "manager", "employee"]
  },
  {
    id: "company",
    title: "Company",
    icon: "FaFolderOpen",
    path: "/company",
    roles: ["superadmin"]
  },
  {
    id: "users",
    title: "Users",
    icon: "FaFolderOpen",
    path: "/users",
    roles: ["superadmin", "admin", "manager"]
  },
  {
    id: "projects",
    title: "Projects",
    icon: "FaFolderOpen",
    path: "/projects",
    roles: ["admin", "manager"]
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: "FaTasks",
    path: "/tasks",
    roles: ["manager", "employee"]
  },
  {
    id: "sprint",
    title: "Sprint",
    icon: "FaTasks",
    path: "/sprint",
    roles: ["manager", "admin"]
  },
  {
    id: "AI",
    title: "AI Assistance",
    icon: "FaTasks",
    path: "/asistance",
    roles: ["superadmin", "manager", "admin","employee"]
  }
];

export default menuConfig;
