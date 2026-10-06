export interface DefaultStoreImage {
  id: string;
  businessType: string;
  label: string;
  description: string;
  imageUrl: string;
}

export const DEFAULT_STORE_IMAGES: DefaultStoreImage[] = [
  {
    id: "convenience-store",
    businessType: "Convenience Store",
    label: "Convenience Store",
    description: "Corner shops, daily essentials, and quick-stop markets",
    imageUrl: "/images/default-stores/convenience-store.jpg",
  },
  {
    id: "ethnic-grocery",
    businessType: "Ethnic Grocery",
    label: "Ethnic Grocery",
    description: "International, regional spices, specialty and cultural groceries",
    imageUrl: "/images/default-stores/ethnic-grocery.jpg",
  },
  {
    id: "food-manufacturer",
    businessType: "Food Manufacturer",
    label: "Food Manufacturer",
    description: "Food processing, commercial packaged goods, and production facilities",
    imageUrl: "/images/default-stores/food-manufacturer.jpg",
  },
  {
    id: "franchise",
    businessType: "Franchise",
    label: "Franchise",
    description: "Chain stores, franchised food outlets, and quick-service operations",
    imageUrl: "/images/default-stores/franchise.jpg",
  },
  {
    id: "grocery",
    businessType: "Grocery",
    label: "Grocery",
    description: "Neighborhood food markets, fresh produce, and independent grocers",
    imageUrl: "/images/default-stores/grocery.jpg",
  },
  {
    id: "restaurant",
    businessType: "Restaurant",
    label: "Restaurant",
    description: "Dine-in, cafes, bistros, eateries, and commercial kitchens",
    imageUrl: "/images/default-stores/restaurant.jpg",
  },
  {
    id: "retail-chain",
    businessType: "Retail Chain",
    label: "Retail Chain",
    description: "Multi-location retail branches and brand departmental food stores",
    imageUrl: "/images/default-stores/retail-chain.jpg",
  },
  {
    id: "supermarket",
    businessType: "Supermarket",
    label: "Supermarket",
    description: "Large full-line grocery stores and departmental hypermarkets",
    imageUrl: "/images/default-stores/supermarket.jpg",
  },
  {
    id: "wholesale-distributor",
    businessType: "Wholesale Distributor",
    label: "Wholesale Distributor",
    description: "Bulk food suppliers, logistics hubs, and wholesale distribution depots",
    imageUrl: "/images/default-stores/wholesale-distributor.jpg",
  },
];

export function getDefaultStoreImageForBusinessType(
  businessType?: string | null,
): DefaultStoreImage | undefined {
  if (!businessType) return undefined;
  const normalized = businessType.trim().toLowerCase();

  return (
    DEFAULT_STORE_IMAGES.find((img) => img.businessType.toLowerCase() === normalized) ??
    DEFAULT_STORE_IMAGES.find((img) => {
      const itemType = img.businessType.toLowerCase();
      if (normalized.includes("ethnic") && itemType.includes("ethnic")) return true;
      if (normalized.includes("convenience") && itemType.includes("convenience")) return true;
      if (normalized.includes("supermarket") && itemType.includes("supermarket")) return true;
      if (normalized.includes("manufacturer") && itemType.includes("manufacturer")) return true;
      if (normalized.includes("wholesale") && itemType.includes("wholesale")) return true;
      if (normalized.includes("franchise") && itemType.includes("franchise")) return true;
      if (normalized.includes("restaurant") && itemType.includes("restaurant")) return true;
      if (normalized.includes("retail") && itemType.includes("retail")) return true;
      if (normalized.includes("grocery") && itemType.includes("grocery")) return true;
      return false;
    })
  );
}

export function isDefaultStoreImageUrl(url?: string | null): boolean {
  if (!url) return false;
  return DEFAULT_STORE_IMAGES.some((img) => img.imageUrl === url) || url === "/default-store.svg";
}
