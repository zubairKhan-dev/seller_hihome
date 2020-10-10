
export function isValidString(value: string) {
    if (!value)
        return false;
    if (value && value.length === 0)
        return false;
        return true;
}
