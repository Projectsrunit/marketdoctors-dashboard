import Link from "next/link";


export default function NotFound() {
  return (
    <div className="bg-gray-100 flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-gray-800 mb-4 text-6xl font-bold">404</h1>
        <p className="text-gray-600 mb-8 text-xl">Page Not Found</p>
        <p className="text-gray-600 mb-8 text-lg capitalize">
          Sorry, but the page you are looking for does not exist, has been
          removed, or you are allowed to see it.
        </p>
        <Link href="https://marketdoctors.com.ng/">
          <p className="hover:bg-primary-dark rounded-md bg-primary px-6 py-3 font-medium text-white transition duration-300">
            Go to Homepage
          </p>
        </Link>
        <p className="mb-8  text-xl capitalize">
          Need help? Contact{" "}
          <a
            href="#"
            className="text-primary hover:underline"
          >
            Market Doctor Admin&apos;
          </a>
        </p>
      </div>
    </div>
  );
}