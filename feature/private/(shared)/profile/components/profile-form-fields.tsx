"use client";

// Re-export all profile field components and types for 100% backward compatibility
export {
  ProfileNameField,
  ProfileEmailField,
  ProfileContactField,
  VerifiedBadge,
  type ProfileFieldsProps,
  type ProfileNameFieldProps,
  type ProfileEmailFieldProps,
  type ProfileContactFieldProps,
} from "./profile-fields/profile-identity-fields";

export {
  EmployeeLocationSection,
  ProfileAddressField,
  StoreManagerLocationFields,
  type EmployeeLocationSectionProps,
  type ProfileAddressFieldProps,
} from "./profile-fields/profile-location-fields";
