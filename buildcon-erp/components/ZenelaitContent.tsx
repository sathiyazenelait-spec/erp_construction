import Link from "next/link";

export default function ZenelaitContent() {
  return (
    <section className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur rounded-xl shadow-lg text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
        Zenelait
      </h1>
      <p className="mb-6 text-lg leading-relaxed">
        Zenelait is a cutting‑edge platform that empowers construction professionals with AI‑driven insights, project analytics, and seamless collaboration tools. Our mission is to accelerate project delivery, reduce waste, and unlock new levels of productivity across the built environment.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <form className="grid gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 rounded bg-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="p-3 rounded bg-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="p-3 rounded bg-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Send Message
        </button>
      </form>
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-full transition"
        >
          Login to Your Account
        </Link>
      </div>
    </section>
  );
}
