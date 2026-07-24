import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Store } from "lucide-react";
import { STORE_LISTINGS } from "@/constants/dashboard";

export function StoreListings() {
  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">New Store Listings</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {STORE_LISTINGS.map((store) => (
            <Card key={store.id} className="overflow-hidden rounded-xl border p-0 shadow-sm">
              <div className={`relative h-40 w-full ${store.color}`}>
                <div className="flex h-full items-center justify-center">
                  <Store size={40} className="text-gray-900" />
                </div>

                <Badge className="absolute top-3 right-3">New</Badge>
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <h3 className="text-base font-semibold">{store.name}</h3>

                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4" />
                    {store.city}, {store.country}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="line-clamp-2 text-xs leading-5">{store.address}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
