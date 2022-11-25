import type { Reason, Status } from "@prisma/client";

export type ReasonsForStatus = Record<Status, Reason[]>;
