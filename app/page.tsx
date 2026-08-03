import Link from "next/link";

export default function Welcome() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Welcome
            </h1>
            <p className="max-w-md text-base text-gray-600">
                Glad to have you here. Let&apos;s get started.
            </p>
            <div className="flex gap-3">
                <Link
                    href="/login"
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Log In
                </Link>
            </div>
        </div>
    );
}