module.exports = {
    passwordUpdatedHtml: require("./password-updated"),
    forgotPasswordHtml: require("./forgot-password"),
    verifyEmailHtml: require("./verify-email"),
    cardRemovedHtml: require("./card-removed"),
    cardAddedHtml: require("./card-added"),
    upgradeApprovedHtml: (target) => `<p>Your upgrade request has been approved. New role: ${target}</p>`,
    upgradeRejectedHtml: () => `<p>Your upgrade request has been rejected.</p>`,
    adminResetPasswordHtml: (password) => `<p>As requested, your password has been reset. Temporary password: <b>${password}</b>. Please log in and change it immediately.</p>`,
}
