export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Appointment #{params.id}</h1>
      <p className="text-gray-500 mt-2">Appointment detail view coming soon.</p>
    </div>
  )
}
