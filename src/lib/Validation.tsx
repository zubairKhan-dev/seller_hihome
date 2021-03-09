
export function validEmail(email: string) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
}


export function validMobile(mobile: string) {
  if (mobile && mobile.length === 10 && mobile.substring(0, 2) === "05") {
      return true
  }
  return false;
}
