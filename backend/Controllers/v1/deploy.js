const router = require("express").Router();
const path = require("path");
const { spawn } = require("child_process");
const sendMail = require("../utils/send-mail");

// GitHub webhook endpoint: triggers deployment script on push events
router.post("/github", async (req, res) => {
    const event = req.get("X-GitHub-Event");
    if (event !== "push") {
        return res.status(202).send({ message: "Ignored: not a push event" });
    }

    // Limit to main branch pushes if ref is provided
    const ref = req.body && req.body.ref;
    if (ref && ref !== "refs/heads/main") {
        return res.status(202).send({ message: "Ignored: non-main branch", ref });
    }

    // Absolute path on the Ubuntu server where this repo lives
    const scriptPath = "/home/ubuntu/Stores-Platform/scripts/gh-deploy.sh";

    try {
        // Run script detached so the webhook returns immediately
        // Use nohup in case the parent process dies during PM2 restart
        const nohupCmd = `nohup ${scriptPath} >/home/ubuntu/gh-deploy.log 2>&1 &`;
        const child = spawn("/bin/bash", ["-lc", nohupCmd], {
            detached: true,
            stdio: "ignore",
            env: { ...process.env },
        });
        child.unref();
    } catch (error) {
        return res.status(500).send({ message: "Failed to start deploy script" });
    }

    return res.status(202).send({ message: "Deployment started" });
});

// Deployment completion notify endpoint - called by script post-restart
router.post("/notify", async (req, res) => {
    try {
        const {
            changed_backend = false,
            changed_frontend = false,
            changed_admin = false,
            prev_head = "",
            post_head = "",
        } = req.body || {};

        const changedList = [];
        if (changed_backend) changedList.push("backend");
        if (changed_frontend) changedList.push("frontend");
        if (changed_admin) changedList.push("admin-frontend");

        const title = "Stores-Platform: GitHub update deployed";
        const html = `
            <div>
                <p>A GitHub push was deployed successfully.</p>
                <p><strong>Changes:</strong> ${changedList.length ? changedList.join(", ") : "(none detected)"}</p>
                ${prev_head && post_head ? `<p>Range: <code>${prev_head}</code> → <code>${post_head}</code></p>` : ""}
                <p>Time: ${new Date().toISOString()}</p>
            </div>
        `;

        await sendMail("ab5389659@gmail.com", title, html);
        return res.status(200).send({ ok: true });
    } catch (e) {
        return res.status(500).send({ ok: false });
    }
});

module.exports = router;


