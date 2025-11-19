export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-10 text-3xl font-bold">
      여기는 주문 상세 페이지입니다<br/>
      주문 ID: {params.id}
    </div>
  );
}