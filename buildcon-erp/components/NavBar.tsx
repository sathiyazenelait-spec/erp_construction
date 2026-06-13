import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between bg-slate-900/80 border-b border-slate-800 px-6 py-4 backdrop-blur">
      <Link href="/" className="text-2xl font-bold text-white tracking-wide">
        BuildCon
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/zenelait" className="text-sm text-slate-300 hover:text-white transition">
          Zenelait
        </Link>
        <Link href="/signup" className="text-sm text-slate-300 hover:text-white transition">
          Sign Up
        </Link>
        <button
          onClick={handleLogin}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

