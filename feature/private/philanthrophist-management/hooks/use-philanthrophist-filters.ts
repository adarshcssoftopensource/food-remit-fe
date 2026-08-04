"use client";

import { PHILANTHROPHISTS } from "@/constants/philanthrophist-management";
import { useMemo, useState } from "react";

export function usePhilanthrophistFilters() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const data = useMemo(
    () =>
      PHILANTHROPHISTS.filter((person) => {
        const registeredOn = new Date(person.registeredOn);
        if (fromDate && registeredOn < fromDate) return false;
        if (toDate && registeredOn > toDate) return false;
        if (country && person.country !== country) return false;
        if (city && person.city !== city) return false;
        return true;
      }),
    [fromDate, toDate, country, city],
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCountry("");
    setCity("");
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    country,
    setCountry,
    city,
    setCity,
    data,
    hasFilters: Boolean(fromDate || toDate || country || city),
    clearFilters,
  };
}
