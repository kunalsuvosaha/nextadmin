import "./globals.css";

export const metadata = {
  title: "NextAdmin",
  description: "NextAdmin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
