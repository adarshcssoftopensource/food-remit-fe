/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "country-language" {
  export function getCountry(countryCode: string): any;
  export function getCountryLanguages(
    countryCode: string,
    cb?: (err: any, languages: any[]) => void,
  ): any[];
}
