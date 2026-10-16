"use client";

// Re-export all modular store info components and types for 100% backward compatibility
export {
  StoreImageField,
  type StoreFieldsProps,
  type StoreImageFieldProps,
} from "./store-info/store-image-field";

export { StorePhoneField, type StorePhoneFieldProps } from "./store-info/store-phone-field";

export {
  StoreLocationFields,
  type StoreLocationFieldsProps,
} from "./store-info/store-location-fields";

export {
  StoreSameDayDeliveryFields,
  type StoreSameDayDeliveryFieldsProps,
} from "./store-info/store-same-day-delivery-fields";

export {
  StoreProductScreeningFields,
  PRODUCT_SCREENING_ITEMS,
  type StoreProductScreeningFieldsProps,
} from "./store-info/store-product-screening-fields";
