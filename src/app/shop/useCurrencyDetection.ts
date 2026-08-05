/**
 * Currency policy at launch: GBP is the base price and the default for everyone,
 * because the UK is our only shipping market. USD is offered purely so
 * international visitors can gauge the price — they can switch with the picker.
 *
 * When Europe/international shipping opens, reintroduce IP-based detection here
 * (see git history for the ipapi version) and add the extra currencies to
 * CurrencyPicker plus each product's prices.
 */
export function useCurrencyDetection() {
  // no-op while GBP is the only shipping currency
}
