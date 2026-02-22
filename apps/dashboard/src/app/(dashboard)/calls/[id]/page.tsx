export default function CallDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Call #{params.id}</h1>
      <p className="text-gray-500 mt-2">Call detail and transcript view coming soon.</p>
    </div>
  )
}
