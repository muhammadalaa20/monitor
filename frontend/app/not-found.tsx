import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white">
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">Not Found</h2>
      <p className="text-sm text-gray-400">Could not find the page you are looking for</p>
      <Link href="/" className="py-3 px-6 border border-white rounded-full mt-4 hover:scale-105 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 hover:border-cyan-500 transition-all duration-300 ease-in-out">Return Home</Link>
    </div>
  )
}