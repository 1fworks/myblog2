import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import 'dayjs/locale/ko';
// dayjs.locale('ko')
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("ko")
dayjs.tz.setDefault("Asia/Seoul")

export default function my_dayjs(time:string|undefined = undefined) {
    return dayjs(time).tz()
}