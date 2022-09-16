import dayjs from "dayjs";

export default function formatDate(time: number) {
  return dayjs(time).format("YYYY年MM月DD日 hh:mm:ss");
}
