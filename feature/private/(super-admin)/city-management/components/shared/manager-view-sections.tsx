import { UserCircle } from "lucide-react";

import { PhoneDisplay } from "@/components/ui/phone-display";
import { DetailCard } from "./detail-card";

type ManagerViewDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  residentialCountry: string;
  state: string;
  city: string;
};

export function ManagerContactSection({ manager }: { manager: ManagerViewDetails }) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
        <UserCircle className="h-4 w-4 text-emerald-600" />
        Contact Information
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard label="Email Address" value={manager.email} />
        <DetailCard
          label="Phone Number"
          value={
            <PhoneDisplay
              countryCode={manager.phoneCode}
              phoneNumber={manager.phoneNumber}
              className="font-semibold"
            />
          }
        />
      </div>
    </section>
  );
}

export function ManagerPersonalSection({
  manager,
  fullAddress,
}: {
  manager: ManagerViewDetails;
  fullAddress: string;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
        <UserCircle className="h-4 w-4 text-emerald-600" />
        Personal Details
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard label="First Name" value={manager.firstName} />
        <DetailCard label="Last Name" value={manager.lastName} />
        <DetailCard label="Residential Country" value={manager.residentialCountry} />
        <DetailCard label="State" value={manager.state} />
        <DetailCard label="City" value={manager.city} />
        <DetailCard label="Address" value={fullAddress} />
      </div>
    </section>
  );
}
