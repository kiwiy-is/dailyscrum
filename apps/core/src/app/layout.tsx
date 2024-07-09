import SiteProtector from "./site-protector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.DEPLOYMENT_ENV === "staging") {
    return <SiteProtector>{children}</SiteProtector>;
  }

  return children;
}
