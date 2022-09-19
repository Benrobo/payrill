
// get credit card type

export function GetCardType(cardNumber: any){

    const cardNum = typeof cardNumber === "string" ? +cardNumber : cardNumber
    // visa
    var re = new RegExp("^4");
    if (cardNumber.match(re) != null)
        return "Visa";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cardNumber)) 
        return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (cardNumber.match(re) != null)
        return "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (cardNumber.match(re) != null)
        return "Discover";

    // Diners
    re = new RegExp("^36");
    if (cardNumber.match(re) != null)
        return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (cardNumber.match(re) != null)
        return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (cardNumber.match(re) != null)
        return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (cardNumber.match(re) != null)
        return "Visa Electron";

    return "";
}


export function formatCardNUm(num: string) {
    const formatedNum = num.replace(/(\d{4}(?!\s))/g, "$1 ");
    const f1 = formatedNum.split(" ")
    let num1, num2, num3, num4;
    if (f1.length < 4) {
        num1 = f1[2]
        num2 = f1[1]
        num3 = f1[0].replace(/(\d)/g, "*")
        return `${num3} ${num2} ${num1}`
    }
    num1 = f1[3]
    num2 = f1[2]
    num3 = f1[1].replace(/(\d)/g, "*")
    num4 = f1[0].replace(/(\d)/g, "*")
    return `${num4} ${num3} ${num2} ${num1}`
}

export function separateCardNum(num: string){
    const formatedNum = num.replace(/(\d{4}(?!\s))/g, "$1 ");
    return formatedNum;
}

export function formatCurrency(currency : string, amount: number) {
    const checkCurrency = typeof currency === "undefined" ? "USD" : currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: checkCurrency,
        // notation: 'compact'
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(amount || 0)
}
