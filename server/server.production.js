const express = require("express");
const path = require("path");

module.exports = (app) => {

  const pathToClient = path.join(__dirname, "activity/dist");

  app.use(
    "/static",
    express.static(path.join(pathToClient, "static"), {
      etag: true
    })
  );
  app.use(
    "/locales",
    express.static(path.join(pathToClient, "locales"), {
      etag: true
    })
  );
  app.use(
    "/favicon",
    express.static(path.join(pathToClient, "favicon"), {
      etag: true
    })
  );

  app.use(
    "/assets",
    express.static(path.join(pathToClient, "assets"), {
      etag: true
    })
  );

  app.use(
    "/pics",
    express.static(path.join(pathToClient, "pics"), {
      etag: true
    })
  );

  // All url paths go to the bundled index.html
  app.get("/*", (req, res) => {
    if (
      req.url.match(
        /\/static\/|\/pics\/|\/favicon\/|\/assets\/|\/locales\/|\/api\/env|\/manifest\.json/
      )
    ) {
      return;
    }

    console.info(req.url);
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(path.join(pathToClient, "index.html"));
  });
};