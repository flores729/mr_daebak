// src/app/customer/orders/[orderId]/edit/page.tsx

import OrderEditClient from "./OrderEditClient";

export default function OrderEditPage({ params }: { params: { orderId: string } }) {
  return <OrderEditClient orderId={params.orderId} />;
}
