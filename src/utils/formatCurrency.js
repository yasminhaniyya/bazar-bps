/**
 * Format number to Indonesian Rupiah (IDR) currency format.
 * @param {number} number 
 * @returns {string} Formatted string, e.g. Rp 10.000,00
 */
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};
