"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CategorySelect } from "@/components/common/category-select";
import { CountrySelect } from "@/components/common/country-select";
import { CurrencyPriceInput } from "@/components/common/currency-price-input";
import { DepartmentSelect } from "@/components/common/department-select";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCategoriesDropdown } from "@/feature/private/catalogue-management/categories/hooks/use-get-categories-dropdown";
import { useGetDepartmentsDropdown } from "@/feature/private/catalogue-management/departments/hooks/use-get-departments-dropdown";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import { resolveCurrencyDisplay } from "@/lib/currency";
import { cn } from "@/lib/utils";

export type ItemPlacementRow = {
  key: string;
  countryId: string;
  departmentId: string;
  categoryId: string;
  price: string;
  currency: string;
  currencySymbol: string;
  countryName: string;
  departmentName: string;
  categoryName: string;
};

type ItemPlacementsFieldProps = {
  value: ItemPlacementRow[];
  onChange: (rows: ItemPlacementRow[]) => void;
  invalid?: boolean;
  className?: string;
};

function createRowKey() {
  return `placement-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ItemPlacementsField({
  value,
  onChange,
  invalid,
  className,
}: ItemPlacementsFieldProps) {
  const rows = Array.isArray(value) ? value : [];
  const [draftCountryId, setDraftCountryId] = useState("");
  const [draftDepartmentId, setDraftDepartmentId] = useState("");
  const [draftCategoryId, setDraftCategoryId] = useState("");
  const [draftPrice, setDraftPrice] = useState("");

  const { countries } = useGetCountriesDropdown();
  const { data: departmentsData } = useGetDepartmentsDropdown(draftCountryId || undefined);
  const { data: categoriesData } = useGetCategoriesDropdown(draftDepartmentId || undefined);

  const draftCountry = countries.find((c) => c.id === draftCountryId);
  const draftCurrencyMeta = resolveCurrencyDisplay({
    currency: draftCountry?.currency,
    countryName: draftCountry?.name || draftCountry?.countryName,
    countryCode: draftCountry?.countryCode,
  });

  const departments = useMemo(
    () => (Array.isArray(departmentsData?.data) ? departmentsData.data : []),
    [departmentsData],
  );
  const categories = useMemo(
    () => (Array.isArray(categoriesData?.data) ? categoriesData.data : []),
    [categoriesData],
  );

  const handleAdd = () => {
    if (!draftCountryId || !draftDepartmentId || !draftCategoryId || !draftPrice) {
      toast.error("Select country, department, category, and enter price first");
      return;
    }

    const duplicate = rows.some(
      (row) =>
        row.countryId === draftCountryId &&
        row.departmentId === draftDepartmentId &&
        row.categoryId === draftCategoryId,
    );
    if (duplicate) {
      toast.error("This country / department / category is already added");
      return;
    }

    const country = countries.find((c) => c.id === draftCountryId);
    const department = departments.find((d) => d.id === draftDepartmentId);
    const category = categories.find((c) => c.id === draftCategoryId);
    const currencyMeta = resolveCurrencyDisplay({
      currency: country?.currency,
      countryName: country?.name || country?.countryName,
      countryCode: country?.countryCode,
    });

    const departmentName =
      department?.displayName || department?.name || department?.departmentName || "Department";
    const categoryName = category?.name || category?.categoryName || "Category";

    onChange([
      ...rows,
      {
        key: createRowKey(),
        countryId: draftCountryId,
        departmentId: draftDepartmentId,
        categoryId: draftCategoryId,
        price: draftPrice,
        currency: currencyMeta.code,
        currencySymbol: currencyMeta.symbol,
        countryName: country?.name || country?.countryName || "Country",
        departmentName,
        categoryName,
      },
    ]);

    if (!isStoreScoped) {
      setDraftCountryId("");
    }
    setDraftDepartmentId("");
    setDraftCategoryId("");
    setDraftPrice("");
  };

  const updatePrice = (key: string, price: string) => {
    onChange(rows.map((row) => (row.key === key ? { ...row, price } : row)));
  };

  const removeRow = (key: string) => {
    onChange(rows.filter((row) => row.key !== key));
  };

  const { profile } = useProfile();
  const isStoreScoped = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";

  // Auto-select store country if store manager
  useEffect(() => {
    if (isStoreScoped && profile?.stores?.[0]?.country) {
      if (draftCountryId !== profile.stores[0].country) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraftCountryId(profile.stores[0].country);
      }
    }
  }, [isStoreScoped, profile, draftCountryId]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className={cn(
          "grid gap-3 sm:grid-cols-2",
          isStoreScoped ? "lg:grid-cols-4" : "lg:grid-cols-5",
        )}
      >
        {!isStoreScoped && (
          <CountrySelect
            value={draftCountryId}
            onValueChange={(val) => {
              setDraftCountryId(val);
              setDraftDepartmentId("");
              setDraftCategoryId("");
            }}
            placeholder="Select country"
          />
        )}
        <DepartmentSelect
          countryId={draftCountryId}
          value={draftDepartmentId}
          onValueChange={(val) => {
            setDraftDepartmentId(val);
            setDraftCategoryId("");
          }}
          placeholder="Select department"
          disabled={!draftCountryId}
        />
        <CategorySelect
          departmentId={draftDepartmentId}
          value={draftCategoryId}
          onValueChange={setDraftCategoryId}
          placeholder="Select category"
          disabled={!draftDepartmentId}
        />
        <div className="min-w-0">
          <CurrencyPriceInput
            value={draftPrice}
            onChange={setDraftPrice}
            currency={draftCurrencyMeta?.code}
            currencySymbol={draftCurrencyMeta?.symbol}
            disabled={!draftCountryId}
            placeholder="Price"
            className="h-11"
          />
        </div>
        <Button type="button" onClick={handleAdd} className="h-11 rounded-xl font-semibold">
          <Plus data-icon="inline-start" />
          Add
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
          invalid && "border-destructive ring-destructive/20 ring-3",
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/50">
              <TableHead className="w-[18%]">Country</TableHead>
              <TableHead className="w-[26%]">Price</TableHead>
              <TableHead className="w-[22%]">Department</TableHead>
              <TableHead className="w-[22%]">Category</TableHead>
              <TableHead className="w-[12%] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-sm text-slate-400">
                  Add at least one country placement with price
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-200">
                    {row.countryName}
                  </TableCell>
                  <TableCell>
                    <CurrencyPriceInput
                      value={row.price}
                      onChange={(price) => updatePrice(row.key, price)}
                      currency={row.currency}
                      currencySymbol={row.currencySymbol}
                      invalid={!row.price || Number(row.price) < 0}
                    />
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {row.departmentName}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {row.categoryName}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeRow(row.key)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove placement"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
