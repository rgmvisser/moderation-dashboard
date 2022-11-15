import type { Status } from "@prisma/client";
import { ButtonColorFromStatus } from "../utils.tsx/status";

export const PropertyContainer = ({
  className,
  properties,
}: {
  properties: PropertyType[];
  className?: string;
}) => {
  return (
    <div className="w-full border-t-0 border-r-0 border-b border-l-0 border-main py-2 px-4">
      {properties.map((p) => (
        <Property property={p} key={p.text} />
      ))}
    </div>
  );
};

type PropertyType = {
  status: Status;
  text: string;
  type: string;
};

type PropertyProps = {
  property: PropertyType;
};

const Property = ({ property }: PropertyProps) => {
  const color = ButtonColorFromStatus(property.status);
  return (
    <div className="relative flex items-center justify-start gap-2.5 py-1">
      <div
        className={`flex h-3 w-3 items-start justify-start rounded-full ${color}`}
      />
      <p className="flex-auto text-base">
        <span className="font-semibold">{property.type}:</span> {property.text}
      </p>
    </div>
  );
};
