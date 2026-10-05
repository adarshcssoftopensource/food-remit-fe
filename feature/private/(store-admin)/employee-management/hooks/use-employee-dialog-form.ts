"use client";

import { findPhoneCountry } from "@/components/ui/phone-input-utils";
import { useProfile } from "@/components/providers/profile-provider";
import {
  EmployeeFormSchema,
  EmployeeFormValues,
} from "@/feature/private/(store-admin)/employee-management/schema/employee.schema";
import { type Employee } from "@/feature/private/(store-admin)/employee-management/types/employee-management";
import { useGetCountriesDropdown } from "@/feature/private/(shared)/settings/hooks/use-get-countries-dropdown";
import { getCountryPhoneInfo } from "@/lib/phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

function getEmptyEmployeeValues(
  defaultDialCode: string,
  targetCountryName?: string,
): EmployeeFormValues {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: defaultDialCode,
    country: targetCountryName || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    accountStatus: "ACTIVE",
  };
}

function getEmployeeValues(employee: Employee, defaultDialCode: string): EmployeeFormValues {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phoneNumber: employee.phoneNumber || "",
    countryCode: employee.countryCode || defaultDialCode,
    country: (employee as any).country || "",
    address: employee.address || "",
    city: employee.city || "",
    state: employee.state || "",
    zipCode: employee.zipCode || "",
    image: employee.image || undefined,
    accountStatus: employee.accountStatus,
  };
}

export function useEmployeeDialogForm(open: boolean, employee: Employee | undefined) {
  const isEdit = !!employee;
  const { profile } = useProfile();
  const { countries: apiCountries } = useGetCountriesDropdown();
  const store = profile?.stores?.[0];

  const { targetCountryIso, targetCountryName, defaultDialCode } = useMemo(() => {
    // 1. If store has countryCode (e.g. "US", "IN")
    if (store?.countryCode && store.countryCode.length === 2) {
      const iso = store.countryCode.toUpperCase();
      const phoneInfo = getCountryPhoneInfo(iso, apiCountries);
      return {
        targetCountryIso: iso,
        targetCountryName: store.countryName || phoneInfo?.isoCode || iso,
        defaultDialCode: phoneInfo?.dialCode || "+1",
      };
    }

    // 2. Check store.countryName or store.country
    const storeCountryRaw = store?.countryName || store?.country;
    if (storeCountryRaw) {
      const phoneInfo = getCountryPhoneInfo(storeCountryRaw, apiCountries);
      if (phoneInfo?.isoCode) {
        return {
          targetCountryIso: phoneInfo.isoCode.toUpperCase(),
          targetCountryName: store?.countryName || phoneInfo.isoCode,
          defaultDialCode: phoneInfo.dialCode,
        };
      }
    }

    // 3. Check profile countryIsoCode / countryName / country
    const profileIsoRaw = (profile as any)?.countryIsoCode;
    if (profileIsoRaw && profileIsoRaw.length === 2) {
      const iso = profileIsoRaw.toUpperCase();
      const phoneInfo = getCountryPhoneInfo(iso, apiCountries);
      return {
        targetCountryIso: iso,
        targetCountryName: (profile as any)?.countryName || iso,
        defaultDialCode: phoneInfo?.dialCode || "+1",
      };
    }

    const profileCountryRaw = (profile as any)?.countryName || (profile as any)?.country;
    if (profileCountryRaw) {
      const phoneInfo = getCountryPhoneInfo(profileCountryRaw, apiCountries);
      if (phoneInfo?.isoCode) {
        return {
          targetCountryIso: phoneInfo.isoCode.toUpperCase(),
          targetCountryName: (profile as any)?.countryName || phoneInfo.isoCode,
          defaultDialCode: phoneInfo.dialCode,
        };
      }
    }

    // 4. Default fallback: US
    return {
      targetCountryIso: "US",
      targetCountryName: "United States",
      defaultDialCode: "+1",
    };
  }, [store, profile, apiCountries]);

  /** Locked ISO for phone flag (US vs CA for +1). Never pass only "+1" as defaultCountry. */
  const [phoneIso, setPhoneIso] = useState<string | undefined>(undefined);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: getEmptyEmployeeValues(defaultDialCode || "+1", targetCountryName),
  });

  // Reset form when dialog opens (render-time adjust — avoids setState-in-effect lint).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      if (isEdit && employee) {
        const empCountry = findPhoneCountry(employee.countryCode);
        setPhoneIso(empCountry?.isoCode || targetCountryIso);
        form.reset(getEmployeeValues(employee, defaultDialCode));
      } else {
        setPhoneIso(targetCountryIso);
        form.reset(getEmptyEmployeeValues(defaultDialCode, targetCountryName));
      }
    }
  }

  return { form, phoneIso, setPhoneIso, targetCountryIso, targetCountryName };
}
