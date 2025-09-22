export enum ApiEndpoints {
  AdminLogin = "/api/v1/admin/auth/login",
  AdminLogout = "/api/v1/admin/auth/logout",
  AdminMe = "/api/v1/admin/auth/me",

  AdminOrderSearch = "/api/v1/admin/order/search",
  AdminOrderUpdateStatus = "/api/v1/admin/order/update-status",
  AdminOrderRefund = "/api/v1/admin/order/refund",
  AdminOrderAllPending = "/api/v1/admin/order/all-pending",
  AdminOrderRejectRefund = "/api/v1/admin/order/reject-refund",

  AdminUserRestrict = "/api/v1/admin/user/restrict",
  AdminUserDetails = "/api/v1/admin/user/details",
  AdminUserAllSessions = "/api/v1/admin/user/all-sessions",
  AdminUserTerminateSession = "/api/v1/admin/user/terminate-session",
  AdminUserTerminateAllSessions = "/api/v1/admin/user/terminate-all-sessions",
  AdminUserAllPaymentMethods = "/api/v1/admin/user/all-payment-methods",
  AdminUserAllTransactions = "/api/v1/admin/user/all-transactions",
  AdminUserAllPaymentTransactions = "/api/v1/admin/user/all-payment-transactions",
  AdminUserAllSupport = "/api/v1/admin/user/all-support",
  AdminUserAllRatings = "/api/v1/admin/user/all-ratings",
  AdminUserDeleteRating = "/api/v1/admin/user/delete-rating",
  AdminUserAllOrders = "/api/v1/admin/user/all-orders",
  AdminUserAllUpgrade = "/api/v1/admin/user/all-upgrade",
  AdminUserUpgrade = "/api/v1/admin/user/upgrade",
  AdminUserRejectUpgrade = "/api/v1/admin/user/reject-upgrade",
  AdminUserResetPassword = "/api/v1/admin/user/reset-password",

  AdminSupportAllTickets = "/api/v1/admin/support/all-tickets",
  AdminSupportTicketDetails = "/api/v1/admin/support/ticket-details",
  AdminSupportSendMessage = "/api/v1/admin/support/send-message",
  AdminSupportUpdateStatus = "/api/v1/admin/support/update-status",
}

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE as string) ||
  (typeof window !== 'undefined'
    ? (window.location.hostname.endsWith('videonest.me')
        ? 'https://admin.stores-platform.videonest.me'
        : '')
    : '')


