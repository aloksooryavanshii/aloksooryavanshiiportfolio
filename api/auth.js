const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");

module.exports = async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`
    );
  }

  try {
    const auth = createOAuthAppAuth({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    });

    const { token } = await auth({
      type: "oauth-user",
      code,
    });

    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:github:success:{"token":"${token}","provider":"github"}',
              e.origin
            );
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    `;
    
    return res.send(script);
  } catch (err) {
    return res.status(401).send("OAuth error: " + err.message);
  }
};
