"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Image as ImageIcon,
  Info,
  MapPin,
  Search,
  ShoppingBasket,
  Tag,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function AddProductBox() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <ShoppingBasket className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create Grocery Basket / Bundle
              </h1>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                NEW BUNDLE
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Assemble a curated grocery package from existing catalog items.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-emerald-600">
              <Info className="h-4 w-4" />
              <h2 className="font-bold">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">
                  Basket Name <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="e.g. Family Weekly Pack" className="border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">
                  Primary Target Category <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="family">
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family Essentials (3-5 People)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-500">
                  Short Description (Optional)
                </Label>
                <Textarea
                  placeholder="Complete 2-week grocery package covering rice, fresh meats, and staples"
                  className="min-h-20 resize-none border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-emerald-600">
              <MapPin className="h-4 w-4" />
              <h2 className="font-bold">Regional Scoping</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="ph">
                  <SelectTrigger className="flex items-center gap-2 border-slate-200">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🇵🇭</span> Philippines
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ph">Philippines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">City (Optional)</Label>
                <Select defaultValue="santarosa">
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="santarosa">City of Santa Rosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-emerald-600">
              <ImageIcon className="h-4 w-4" />
              <h2 className="font-bold">Bundle Media</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">
                  Hero Image <span className="text-red-500">*</span>{" "}
                  <span className="font-normal">(Required)</span>
                </Label>
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-50/50 p-8 text-center transition-colors hover:bg-emerald-50">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Upload Basket Hero Image</p>
                  <p className="mt-1 text-[10px] text-slate-500">(White Background PNG/JPG/WEBP)</p>
                  <p className="mt-2 text-[10px] text-slate-400">Click to browse or drag & drop</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-500">
                    Supporting Images (Optional)
                  </Label>
                  <span className="text-xs text-slate-400">0/3</span>
                </div>
                <p className="text-[10px] text-slate-400">Up to 3 images</p>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-500/20 bg-emerald-50/30 text-center transition-colors hover:bg-emerald-50/50"
                    >
                      <UploadCloud className="mb-1 h-4 w-4 text-emerald-600" />
                      <p className="text-[10px] text-emerald-600">
                        Upload
                        <br />
                        <span className="text-slate-400">(Optional)</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Items Builder */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-2 text-emerald-600">
          <ShoppingBasket className="h-4 w-4" />
          <h2 className="font-bold">Bundle Items Builder (2-Tier SKU Selector)</h2>
        </div>

        <div className="mb-6 flex flex-col items-end gap-4 sm:flex-row">
          <div className="w-full flex-1 space-y-2">
            <Label className="text-xs font-bold text-slate-500">Search & Add Item</Label>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Type item name (e.g. Magnolia)"
                className="border-slate-200 pl-9"
              />
            </div>
          </div>
          <div className="w-24 space-y-2">
            <Label className="text-xs font-bold text-slate-500">
              <span className="text-red-500">*</span> Quantity
            </Label>
            <Input type="number" defaultValue="2" className="border-slate-200" />
          </div>
          <div className="w-32 space-y-2">
            <Label className="text-xs font-bold text-slate-500">Unit</Label>
            <Select defaultValue="kg">
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Kg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="border-emerald-500/30 font-bold text-emerald-600 hover:bg-emerald-50"
          >
            + Add to Basket
          </Button>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-bold text-slate-700">Included Items in Basket:</Label>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">#</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-center">Unit</th>
                  <th className="px-4 py-3 text-right">Unit Price (PHP)</th>
                  <th className="px-4 py-3 text-right">Total (PHP)</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  {
                    id: 1,
                    name: "Sinandomeng Special Rice (25kg)",
                    qty: 1,
                    unit: "Sack",
                    price: "₱1,350.00",
                    total: "₱1,350.00",
                  },
                  {
                    id: 2,
                    name: "Magnolia Whole Chicken",
                    qty: 2,
                    unit: "Birds",
                    price: "₱235.00",
                    total: "₱470.00",
                  },
                  {
                    id: 3,
                    name: "Minola Coconut Cooking Oil (1L)",
                    qty: 1,
                    unit: "Bottle",
                    price: "₱115.00",
                    total: "₱115.00",
                  },
                  {
                    id: 4,
                    name: "Fresh Table Eggs (Tray of 30)",
                    qty: 1,
                    unit: "Tray",
                    price: "₱240.00",
                    total: "₱240.00",
                  },
                ].map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-center font-medium text-slate-500">{item.id}</td>
                    <td className="flex items-center gap-3 px-4 py-3 font-medium">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs">
                        IMG
                      </div>
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{item.qty}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.unit}</td>
                    <td className="px-4 py-3 text-right font-medium">{item.price}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">{item.total}</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="flex flex-col justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="mb-2 flex items-center gap-2 text-emerald-600">
            <Tag className="h-4 w-4" />
            <h2 className="font-bold">Pricing Summary</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">Base Items Value:</span>
            <span className="text-xl font-black">₱2,175.00</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-start gap-6 border-slate-200 md:flex-row md:items-end md:justify-end md:border-l md:pl-6">
          <div className="flex flex-col items-center space-y-2">
            <Label className="text-[10px] font-bold text-slate-500">Apply Discount</Label>
            <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
          </div>

          <div className="w-32 space-y-2">
            <Label className="text-[10px] font-bold text-slate-500">Discount Type</Label>
            <Select defaultValue="percentage">
              <SelectTrigger className="h-9 border-slate-200 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-24 space-y-2">
            <Label className="text-[10px] font-bold text-slate-500">Discount Value</Label>
            <div className="relative">
              <Input
                defaultValue="8.1"
                className="h-9 border-slate-200 pr-6 text-right font-medium"
              />
              <span className="absolute top-2 right-2 text-xs font-bold text-slate-400">%</span>
            </div>
          </div>

          <div className="relative w-48 space-y-2">
            <Label className="text-[10px] font-bold text-emerald-600">
              Bundle Special Price <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute top-2 left-3 text-sm font-bold text-emerald-600">₱</span>
              <Input
                defaultValue="1,999.00"
                className="h-9 border-emerald-500 bg-emerald-50/30 pl-8 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-emerald-700">
            <Tag className="h-4 w-4 shrink-0" />
            <div>
              <p className="text-[10px] leading-none font-bold opacity-70">You save:</p>
              <p className="mt-0.5 text-xs leading-none font-bold">₱176.00 / 8.1% OFF</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-full px-6 font-bold"
        >
          Cancel
        </Button>
        <Button className="flex gap-2 rounded-full bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700">
          <ShoppingBasket className="h-4 w-4" /> Create Basket
        </Button>
      </div>
    </div>
  );
}
