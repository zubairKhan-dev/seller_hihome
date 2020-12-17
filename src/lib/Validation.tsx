
export function validEmail(email: string) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
}


export function validMobile(mobile: string) {
  if (mobile && mobile.length === 12 && mobile.substring(0, 3) === "971") {
      return true
  }
  return false;
}
