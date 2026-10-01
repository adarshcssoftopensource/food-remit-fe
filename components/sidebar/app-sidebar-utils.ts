import type { AdminProfile } from "@/components/providers/profile-provider";
import { NAVIGATION_GROUPS, type NavItem } from "@/config/nav";
import { hasPathPermission } from "@/config/permissions";
import { ROUTES } from "@/config/routes";

type NavLinkTarget = { url: string; items?: { title: string; url: string }[] };

export function isSubItemActive(
  item: NavLinkTarget,
  sub: { title: string; url: string },
  currentPath: string | null,
) {
  if (!currentPath) return false;

  if (currentPath === sub.url) return true;

  // Single sub-item group where parent route matches (e.g. /country-management/123 -> /country-management/list)
  if (
    item.items?.length === 1 &&
    (currentPath === item.url || currentPath.startsWith(item.url + "/"))
  ) {
    return true;
  }

  if (currentPath.startsWith(sub.url + "/")) {
    // If another sibling sub-item is also matched and has a longer (more specific) URL, this sub is not active
    const hasMoreSpecificMatch = item.items?.some(
      (otherSub) =>
        otherSub.url !== sub.url &&
        otherSub.url.length > sub.url.length &&
        (currentPath === otherSub.url || currentPath.startsWith(otherSub.url + "/")),
    );
    return !hasMoreSpecificMatch;
  }

  return false;
}

export function hasGroupActiveChild(item: NavLinkTarget, currentPath: string | null) {
  if (!currentPath) return false;
  if (item.items?.some((sub) => isSubItemActive(item, sub, currentPath))) return true;
  return currentPath === item.url || currentPath.startsWith(item.url + "/");
}

export function getInitialOpenGroup(activeNavItems: NavItem[], pathname: string | null) {
  const active = activeNavItems.find(
    (item) =>
      item.items?.length &&
      (item.items.some(
        (sub) =>
          pathname === sub.url ||
          (pathname?.startsWith(sub.url + "/") &&
            !item.items?.some(
              (o) =>
                o.url !== sub.url &&
                o.url.length > sub.url.length &&
                (pathname === o.url || pathname?.startsWith(o.url + "/")),
            )),
      ) ||
        (item.items.length === 1 &&
          (pathname === item.url || pathname?.startsWith(item.url + "/"))) ||
        pathname === item.url ||
        pathname?.startsWith(item.url + "/")),
  );
  return active?.title ?? null;
}

export function filterAllowedNavItems(
  activeNavItems: NavItem[],
  profile: AdminProfile | null,
  isSuperAdmin: boolean,
) {
  return activeNavItems
    .filter((item) => {
      const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";
      const isStoreManager =
        profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
      if (item.url === ROUTES.ADMIN.MY_ORDERS || item.title === "My Orders") return isEmployee;
      if (
        item.url === ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT ||
        item.title === "Order Management" ||
        item.title === "Orders"
      ) {
        return !isEmployee;
      }
      if (
        item.url === ROUTES.ADMIN.PRODUCT_BOXES ||
        item.title === "Product Boxes Management" ||
        item.title === "Product Boxes"
      ) {
        return isStoreManager;
      }
      return true;
    })
    .map((item) => {
      // If the item has sub-items, filter them first based on permissions
      if (item.items && item.items.length > 0) {
        const filteredSubs = item.items.filter((sub) => {
          if (!hasPathPermission(sub.url, profile?.permissions, isSuperAdmin, profile?.roleCode)) {
            return false;
          }
          const isStoreManager =
            profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";

          const isCityManager =
            profile?.roleCode === "CITY_MANAGER" || profile?.role === "city_manager";

          if (
            isStoreManager &&
            (sub.title === "Store Report" ||
              sub.title === "Store Reports" ||
              sub.url === ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT)
          ) {
            return false;
          }

          if (isCityManager && sub.url === ROUTES.ADMIN.STORE_MANAGEMENT.ASSIGN_CITY_MANAGER) {
            return false;
          }

          return true;
        });
        return { ...item, items: filteredSubs };
      }
      return item;
    })
    .filter((item) => {
      // If it had sub-items but none are allowed, filter it out
      if (item.items && item.items.length === 0) {
        return false;
      }
      // Otherwise check the item's main URL permission
      return hasPathPermission(item.url, profile?.permissions, isSuperAdmin, profile?.roleCode);
    });
}

export function groupNavItems(filteredNavItems: NavItem[]) {
  const hasAnyGroup = filteredNavItems.some((item) => !!item.group);
  if (!hasAnyGroup) {
    return [
      {
        id: "DEFAULT",
        label: "",
        collapsible: false,
        items: filteredNavItems,
      },
    ];
  }

  const groups: {
    id: string;
    label: string;
    icon?: any;
    collapsible: boolean;
    hideHeader?: boolean;
    items: typeof filteredNavItems;
  }[] = [];

  for (const g of NAVIGATION_GROUPS) {
    const itemsInGroup = filteredNavItems.filter(
      (item) => item.group === g.label || item.group === g.id,
    );
    if (itemsInGroup.length > 0) {
      groups.push({
        id: g.id,
        label: g.label,
        icon: (g as any).icon,
        collapsible: g.collapsible,
        hideHeader: (g as any).hideHeader,
        items: itemsInGroup,
      });
    }
  }

  // Any items with undefined group placed in Utilities before Recycle Bin
  const knownGroups = new Set<string>(NAVIGATION_GROUPS.flatMap((g) => [g.id, g.label]));
  const unassignedItems = filteredNavItems.filter(
    (item) => !item.group || !knownGroups.has(item.group),
  );

  if (unassignedItems.length > 0) {
    const utilGroup = groups.find((g) => g.id === "UTILITIES");
    if (utilGroup) {
      const recycleIndex = utilGroup.items.findIndex(
        (i) => i.url === ROUTES.ADMIN.RECYCLE_BIN || i.title === "Recycle Bin",
      );
      if (recycleIndex !== -1 && utilGroup.items[recycleIndex]) {
        const recycleItem = utilGroup.items[recycleIndex];
        const beforeRecycle = utilGroup.items.slice(0, recycleIndex);
        const afterRecycle = utilGroup.items.slice(recycleIndex + 1);
        utilGroup.items = [...beforeRecycle, ...unassignedItems, ...afterRecycle, recycleItem];
      } else {
        utilGroup.items.push(...unassignedItems);
      }
    } else {
      groups.push({
        id: "UTILITIES",
        label: "Utilities",
        collapsible: true,
        items: unassignedItems,
      });
    }
  }

  return groups;
}
