
export const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const formatCurrencyShort = (amount: number): string => {
  return `KES ${amount.toFixed(2)}`;
};

export const CURRENCY_SYMBOL = 'KES';
export const CURRENCY_NAME = 'Kenyan Shilling';
