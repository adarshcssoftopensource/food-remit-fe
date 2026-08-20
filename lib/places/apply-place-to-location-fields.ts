import type { PlaceDetails } from "@/hooks/use-google-places";
import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";

type ResidentialFieldMap<T extends FieldValues> = {
  country: Path<T>;
  state: Path<T>;
  city: Path<T>;
  zipcode: Path<T>;
};

const SET_OPTS = { shouldValidate: true, shouldDirty: true, shouldTouch: true } as const;

export function applyPlaceToLocationFields<T extends FieldValues>(
  place: PlaceDetails,
  setValue: UseFormSetValue<T>,
  fields: ResidentialFieldMap<T>,
): void {
  if (place.country) {
    setValue(fields.country, place.country as T[Path<T>], SET_OPTS);
  }
  if (place.state) {
    setValue(fields.state, place.state as T[Path<T>], SET_OPTS);
  }
  if (place.city) {
    setValue(fields.city, place.city as T[Path<T>], SET_OPTS);
  }
  if (place.postalCode) {
    setValue(fields.zipcode, place.postalCode as T[Path<T>], SET_OPTS);
  }
}
