import { ListType } from "@prisma/client";

export const ListTypes = Object.keys(ListType) as ListType[];

export const ListTypeName = (type: ListType): string => {
  switch (type) {
    case ListType.locations:
      return "Locations";
    case ListType.phone_number:
      return "Phone Numbers";
    case ListType.strings:
      return "Text";
    case ListType.domains:
      return "Domains";
  }
};
