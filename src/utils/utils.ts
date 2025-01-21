export function formatAddress(address: string){
    return `${address.slice(0, 4)}..${address.slice(-4)}`;
}

export function formatTORUS(torusAmount: number){
    const amount = torusAmount / 1000000000000000000;
    if(amount > 9999){
        return `${convertToInternationalCurrencySystem(amount)}`;
    }

    let s = amount.toFixed(2);
    if(s.endsWith('0')){
        s = s.substring(0, s.length-1);
    }
    if(s.endsWith('0')){
        s = s.substring(0, s.length-2);
    }

    return s;
}
export const formattedNumber = (num: number) => num < 10 ? `000${num}` : num < 100 ? `00${num}` : num < 1000 ? `0${num}` : `${num}`;


export function convertToInternationalCurrencySystem(labelValue: number): string {
    const absValue = Math.abs(Number(labelValue));
    let formatted: string;

    if (absValue >= 0.999995e+9) { // Billion threshold
        formatted = (absValue / 1.0e+9).toFixed(2) + "B";
    } else if (absValue >= 0.999995e+6) { // Million threshold
        formatted = (absValue / 1.0e+6).toFixed(2) + "M";
    } else if (absValue >= 0.999995e+3) { // Thousand threshold
        formatted = (absValue / 1.0e+3).toFixed(2) + "K";
    } else {
        formatted = absValue.toFixed(2);
    }

    // Remove trailing zeros after decimal point
    if (formatted.includes('.')) {
        formatted = formatted.replace(/\.?0+([KMB])?$/, '$1');
    }

    return formatted;
}