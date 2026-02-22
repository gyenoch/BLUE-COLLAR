export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Blog Post</h1>
      <p className="text-gray-500 mt-2">Slug: {params.slug}</p>
    </div>
  )
}
