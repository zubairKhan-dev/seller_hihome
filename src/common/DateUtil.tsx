import moment from "moment";
import {strings} from "../components/Translations";

export function parseDate(date: Date, format: string) {
    return moment(date).format(format)
}

export function formatDate(dateString: string, format: string, forceLocale?: string) {
    return moment(dateString).format(format)
}

export function splitTime(numberOfHours) {
    const Days = Math.floor(numberOfHours / 24);
    const Remainder = numberOfHours % 24;
    const Hours = Math.floor(Remainder);
    const Minutes = Math.floor(60 * (Remainder - Hours));
    return({days:Days,hours:Hours,minutes:Minutes})
}
