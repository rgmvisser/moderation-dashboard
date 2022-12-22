import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { ForwardIcon, NoSymbolIcon } from "@heroicons/react/24/solid";

export const TerminateIcon = () => (
  <NoSymbolIcon className="h-5 w-5 rounded-full border border-red-600 bg-red-500 p-[2px] text-white" />
);

export const SkipIcon = () => (
  <ForwardIcon className="h-5 w-5 rounded-full border border-gray-500 bg-gray-400 p-[2px] text-white" />
);

export const UpIcon = () => (
  <ArrowUpCircleIcon className="h-5 w-5 text-secondary hover:text-secondary-hover" />
);

export const DownIcon = () => (
  <ArrowDownCircleIcon className="h-5 w-5 text-secondary hover:text-secondary-hover" />
);
