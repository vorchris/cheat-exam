
    const msalConfig = {
        auth: {
          clientId: "c952edde-d7c2-4281-a846-034fb039e1f5",
          authority: "https://login.microsoftonline.com/common",
          redirectUri: 'https://localhost:22422/server/control/msauth',
        },
      };
      
      const msalInstance = new msal.PublicClientApplication(msalConfig);
      
      document.getElementById("signin").addEventListener("click", () => {
        const loginRequest = {
          scopes: ["openid", "profile", "User.Read", "Files.Read"],
        };
      
        msalInstance.loginPopup(loginRequest).then((response) => {
          console.log("Access token:", response.accessToken);
        });
      });
      
      document.getElementById("onedrive").addEventListener("click", async () => {
        const account = msalInstance.getAllAccounts()[0];
        if (!account) {
          console.log("Please sign in first");
          return;
        }
      
        const tokenRequest = {
          scopes: ["Files.Read"],
          account,
        };
      
        try {
          const response = await msalInstance.acquireTokenSilent(tokenRequest);
          const accessToken = response.accessToken;
      
          const filesResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          const files = await filesResponse.json();
          document.getElementById("output").textContent = JSON.stringify(files, null, 2);
        } catch (error) {
          console.error("Error fetching OneDrive files:", error);
        }
      });
      