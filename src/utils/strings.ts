/**
 * Build a Url removing multiple slashes and trailing slash.
 *
 * @example
 * buildUrl('https://api.billixy.com', 'properties', 'v2', 'meters', '123') // https://api.billixy.com/properties/v2/meters/123
 * buildUrl('https://app.billixy.com/', '//dashboard/', '/analytics/', '///reports///', '//monthly////') // https://app.billixy.com/dashboard/analytics/reports/monthly
 *
 * buildUrl('billixy.app', 'auth/login') // billixy.app/auth/login
 * buildUrl('billixy.app', '/user/profile') // billixy.app/user/profile
 * buildUrl('billixy.app/', '/property/list') // billixy.app/property/list
 * buildUrl('//cdn.billixy.io/', '/assets/images') // //cdn.billixy.io/assets/images
 * buildUrl('https://billing.billixy.com/', '/invoices') //  https://billing.billixy.com/invoices
 * buildUrl('http://staging.billixy.dev/', '/api/test') // http://staging.billixy.dev/api/test
 * buildUrl("https://portal.billixy.com/", "/redirect?returnUrl=https://billing.billixy.com"); // https://portal.billixy.com/redirect?returnUrl=https://billing.billixy.com
 */
export function buildUrl(...routes: Array<string | URL | number>): string {
  return routes
    .join("/")
    .replace(/(https?:\/\/|^\/\/)|(\/)+/g, "$1$2") // remove double slashes
    .replace(/\/+$/, ""); // remove trailing slash
}
