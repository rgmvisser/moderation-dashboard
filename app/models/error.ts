export class CMError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = "CMError";
  }

  equals(other: Error) {
    return this.message === other.message;
  }

  static TenantNotFound = new CMError("Tenant not found", 1);
  static ModeratorAlreadyPartOfTenant = new CMError(
    "Moderator already part of this workspace",
    2
  );
}
