import moment from "moment";

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

export function combineTime(days, hours, minutes) {
  // console.log(days);
  // console.log(hours);
  // console.log(minutes);
    // days = days.id.length === 0 ? "0" : days;
    // hours = hours.length === 0 ? "0" : hours;
    // minutes = minutes.length === 0 ? "0" : minutes;

    let newHours = parseInt(days.id) * 24
    newHours = newHours + parseInt(hours.id)
    newHours = newHours + (parseInt(minutes.id)/60)
    return newHours
}
