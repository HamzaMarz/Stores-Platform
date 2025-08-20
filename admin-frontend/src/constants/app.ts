export enum AppRoutes {
  Login = "/login",
  Dashboard = "/",
  OrdersPending = "/orders/pending",
  OrdersSearch = "/orders/search",
  Users = "/users",
  UserDetails = "/users/:id",
  UpgradeOps = "/users/upgrades",
  Support = "/support",
  SupportDetails = "/support/:id",
}

export enum ErrorMessages {
  Required = "This field is required",
  InvalidEmail = "Invalid email format",
  Unknown = "Something went wrong. Please try again.",
}


