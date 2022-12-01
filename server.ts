import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import prom from "express-prometheus-middleware";

import { Server } from "socket.io";
import { startBacklogQueue } from "~/controllers/backlog.server";
import { authenticateUser } from "socket_session";
import type { User } from "@prisma/client";

const app = express();
const metricsApp = express();

app.use(
  prom({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    metricsApp,
  })
);

app.use((req, res, next) => {
  // helpful headers:
  res.set("x-fly-region", process.env.FLY_REGION ?? "unknown");
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all("*", function getReplayResponse(req, res, next) {
  const { method, path: pathname } = req;
  const { PRIMARY_REGION, FLY_REGION } = process.env;

  const isMethodReplayable = !["GET", "OPTIONS", "HEAD"].includes(method);
  const isReadOnlyRegion =
    FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION;

  const shouldReplay = isMethodReplayable && isReadOnlyRegion;

  if (!shouldReplay) return next();

  const logInfo = {
    pathname,
    method,
    PRIMARY_REGION,
    FLY_REGION,
  };
  console.info(`Replaying:`, logInfo);
  res.set("fly-replay", `region=${PRIMARY_REGION}`);
  return res.sendStatus(409);
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "build");

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require(BUILD_DIR) })
    : (...args) => {
        purgeRequireCache();
        const requestHandler = createRequestHandler({
          build: require(BUILD_DIR),
          mode: MODE,
        });
        return requestHandler(...args);
      }
);

const port = process.env.PORT || 3000;

const httpServer = app.listen(port, () => {
  // require the built app so we're ready when the first request comes in
  require(BUILD_DIR);
  console.log(`✅ app ready: http://localhost:${port}`);
});

// And then attach the socket.io server to the HTTP server
export const ioServer = new Server(httpServer);

declare module "http" {
  interface IncomingMessage {
    user?: User;
  }
}
ioServer.use((socket, next) => {
  try {
    const user = authenticateUser(socket);
    socket.request.user = user;
    next();
  } catch (e) {
    if (e instanceof Error) {
      return next(e);
    }
    return next(new Error("Authentication error"));
  }
});

ioServer.on("connection", (socket) => {
  if (!socket.request.user) {
    console.log("No user found");
    socket.disconnect();
    return;
  }
  const user = socket.request.user;
  // from this point you are on the WS connection with a specific client
  console.log(`User ${user.id} connected to socket ${socket.id}`);
  socket.join(user.id);
  // console.log(ioServer.sockets.adapter.rooms);
  socket.on("disconnect", (reason) => {
    socket.leave(user.id);
    console.log(
      `User ${user.id} disconnected from socket ${socket.id}, reason: ${reason}`
    );
  });
  socket.on("event", (data) => {
    console.log(socket.id, data);
    socket.emit("event", "pong");
  });
});

const metricsPort = process.env.METRICS_PORT || 3001;

metricsApp.listen(metricsPort, () => {
  console.log(`✅ metrics ready: http://localhost:${metricsPort}/metrics`);
});

startBacklogQueue();

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
