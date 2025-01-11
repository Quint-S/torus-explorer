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

export function convertToInternationalCurrencySystem (labelValue: number): string | number {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

                : Math.abs(Number(labelValue)).toFixed(2);

}