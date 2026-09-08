"use client";

import {
  Check,
  ChevronsUpDown,
  Shield,
  ShieldCheck,
  UserCog,
  Globe,
  Building2,
  Store,
  Users,
  Smartphone,
  Search,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NOTIFICATION_ROLE_OPTIONS } from "@/lib/api/endpoints/notification.endpoints";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<string, React.ElementType> = {
  super_admin: Shield,
  sub_admin: ShieldCheck,
  co_admin: UserCog,
  country_manager: Globe,
  city_manager: Building2,
  store_manager: Store,
  employee: Users,
  app_user: Smartphone,
};

interface RoleSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RoleSelect({
  value,
  onChange,
  className,
  placeholder = "Select a role",
}: RoleSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const formattedValue = value
    ? value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : undefined;

  const selectedIcon = value ? ROLE_ICONS[value] : undefined;
  const SelectedIconComp = selectedIcon;

  // Filter options based on frontend search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return NOTIFICATION_ROLE_OPTIONS;
    const lowerSearch = search.toLowerCase();
    return NOTIFICATION_ROLE_OPTIONS.filter((opt) => opt.label.toLowerCase().includes(lowerSearch));
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={"w-full"}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 w-full justify-between rounded-xl border-gray-200 bg-gray-50 px-3 font-normal text-slate-700 hover:bg-gray-100 hover:text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600",
            className,
          )}
        >
          {formattedValue ? (
            <div className="flex items-center gap-2">
              {SelectedIconComp && <SelectedIconComp className="size-4 text-emerald-600" />}
              <span>{formattedValue}</span>
            </div>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) rounded-xl p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search roles..."
            value={search}
            onValueChange={setSearch}
            className="my-1 border-none bg-transparent"
          />
          <CommandList>
            {filteredOptions.length === 0 && (
              <CommandEmpty className="py-6 text-center text-sm text-slate-500">
                No role found.
              </CommandEmpty>
            )}
            <CommandGroup className="p-1.5">
              {filteredOptions.map((opt) => {
                const IconComp = ROLE_ICONS[opt.value];
                const isSelected = value === opt.value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => {
                      if (onChange) onChange(opt.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition-colors",
                      isSelected
                        ? "bg-emerald-50 font-medium text-emerald-700"
                        : "hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    {IconComp && (
                      <IconComp
                        className={cn("size-4", isSelected ? "text-emerald-600" : "text-slate-500")}
                      />
                    )}
                    <span className="flex-1">{opt.label}</span>
                    {isSelected && <Check className="size-4 text-emerald-600" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
