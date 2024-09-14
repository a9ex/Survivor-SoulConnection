import '@/styles/tailwind.css';
import { NextUIProvider } from '@nextui-org/react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout(props: LayoutProps) {
  return (
    <html className="bg-gray-100">
      <body>
        <NextUIProvider>{props.children}</NextUIProvider>
      </body>
    </html>
  );
}
