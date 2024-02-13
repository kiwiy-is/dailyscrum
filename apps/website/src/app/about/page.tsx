import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "ui/button";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Sample about page!</h1>

      <Link href="/" className={buttonVariants({})}>
        Home page
      </Link>
    </main>
  );
}
