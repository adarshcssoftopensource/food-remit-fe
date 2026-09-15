import { CouponFormPage } from "@/feature/private/coupons-management/components/coupon-form-page";

interface EditCouponPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
  const { id } = await params;
  return <CouponFormPage couponId={id} />;
}
