"use client";

import { ColumnDef } from "@tanstack/react-table";
import { withDeletedByColumn } from "../components/deleted-by-columns";
import { RecycleEntityType } from "../hooks/use-get-recycled-data";
import { usersColumns as rawUsersColumns } from "./recycled-users-columns";
import { storesColumns } from "./recycled-stores-columns";
import { itemsColumns } from "./recycled-items-columns";
import { categoriesColumns } from "./recycled-categories-columns";
import { cityManagersColumns, countryManagersColumns } from "./recycled-managers-columns";
import {
  basketsColumns,
  employeesColumns,
  partnerLeadsColumns,
  subAdminsColumns,
} from "./recycled-admin-columns";

export { createSelectColumn, createSNoColumn } from "./recycled-table-helpers";
export { storesColumns } from "./recycled-stores-columns";
export { itemsColumns } from "./recycled-items-columns";
export { categoriesColumns } from "./recycled-categories-columns";
export { cityManagersColumns, countryManagersColumns } from "./recycled-managers-columns";
export {
  basketsColumns,
  employeesColumns,
  partnerLeadsColumns,
  subAdminsColumns,
} from "./recycled-admin-columns";

export const usersColumns = withDeletedByColumn(rawUsersColumns as ColumnDef<any>[], true);

export const COLUMNS_BY_ENTITY: Record<RecycleEntityType, ColumnDef<any>[]> = {
  users: usersColumns,
  stores: withDeletedByColumn(storesColumns, true),
  items: withDeletedByColumn(itemsColumns, true),
  categories: withDeletedByColumn(categoriesColumns, true),
  "city-managers": withDeletedByColumn(cityManagersColumns, true),
  "country-managers": withDeletedByColumn(countryManagersColumns, true),
  employees: withDeletedByColumn(employeesColumns, true),
  "partner-leads": withDeletedByColumn(partnerLeadsColumns, true),
  baskets: withDeletedByColumn(basketsColumns, true),
  "sub-admins": withDeletedByColumn(subAdminsColumns, true),
};
