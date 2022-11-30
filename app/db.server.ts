import type { Tenant } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";
import { ModelsWithoutTenant } from "./models";

let tenantDBs: Record<string, PrismaClient> = {};

declare global {
  var __tenantDBs__: Record<string, PrismaClient>;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  getGeneralClient();
} else {
  if (!global.__tenantDBs__) {
    getGeneralClient();
    global.__tenantDBs__ = tenantDBs;
  }
  tenantDBs = global.__tenantDBs__;
}

function getTenantClient(tenant: Tenant) {
  if (!tenantDBs[tenant.id]) {
    tenantDBs[tenant.id] = getClient(tenant.id);
  }
  return tenantDBs[tenant.id];
}

function getGeneralClient() {
  if (!tenantDBs.general) {
    tenantDBs.general = getClient();
  }
  return tenantDBs.general;
}

function getClient(tenantId?: string) {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const databaseUrl = new URL(DATABASE_URL);

  const isLocalHost = databaseUrl.hostname === "localhost";

  const PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION;
  const FLY_REGION = isLocalHost ? null : process.env.FLY_REGION;

  const isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION;

  if (!isLocalHost) {
    databaseUrl.host = `${FLY_REGION}.${databaseUrl.host}`;
    if (!isReadReplicaRegion) {
      // 5433 is the read-replica port
      databaseUrl.port = "5433";
    }
  }

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
    // log: [
    //   {
    //     emit: "event",
    //     level: "query",
    //   },
    //   {
    //     emit: "stdout",
    //     level: "error",
    //   },
    //   {
    //     emit: "stdout",
    //     level: "info",
    //   },
    //   {
    //     emit: "stdout",
    //     level: "warn",
    //   },
    // ],
  });
  // client.$on("query", (e) => {
  //   console.log("Query: " + e.query);
  //   console.log("Params: " + e.params);
  //   console.log("Duration: " + e.duration + "ms");
  // });
  if (tenantId) {
    client.$use(async (params, next) => {
      if (params.model && ModelsWithoutTenant.includes(params.model)) {
        return next(params);
      }
      if (
        [
          "findUnique",
          "findFirst",
          "findMany",
          "update",
          "updateMany",
          // "upsert", don't use this as only one unique field can be used to do this natively: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
          "delete",
          "deleteMany",
        ].includes(params.action)
      ) {
        if (params.args?.where?.tenantId) {
          return next(params);
        } else if (params.args?.where) {
          params.args.where = { ...params.args.where, tenantId: tenantId };
        } else if (params.args) {
          params.args.where = { tenantId: tenantId };
        } else {
          params.args = { where: { tenantId: tenantId } };
        }
      }
      return next(params);
    });
  }

  // connect eagerly
  client.$connect();

  return client;
}

export { getTenantClient, getGeneralClient };
