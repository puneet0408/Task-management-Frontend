const menuConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "dashboard",
    scope: "project",
    roles: ["superadmin","admin","manager","employee"]
  },
  {
    id: "tasks",
    title: "Tasks",
    path: "tasks",
    scope: "project",
    roles: ["admin","manager","employee"]
  },
  {
    id: "sprint",
    title: "Sprint",
    path: "sprint",
    scope: "project",
    roles: ["admin","manager"]
  },
  {
    id: "company",
    title: "Company",
    path: "/company",
    scope: "company",
    roles: ["superadmin"]
  },
  {
    id: "users",
    title: "Users",
    path: "/users",
    scope: "company",
    roles: ["superadmin","admin","manager"]
  },
  {
    id: "projects",
    title: "Projects",
    path: "/projects",
    scope: "company",
    roles: ["admin","manager"]
  }
];

export default menuConfig;
