import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export function GetDateFormatted(date: Date) {
  return dayjs(date).format("llll");
}

export function GetDateFromNow(date: Date) {
  return dayjs(date).fromNow();
}
