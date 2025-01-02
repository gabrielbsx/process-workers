import { FormatDateProtocol } from "@/core/protocols/format-date.protocol";
import dayjs from "dayjs";

export const dayJsFormatDate: FormatDateProtocol = (date, format) => {
  return dayjs(date).format(format);
};
