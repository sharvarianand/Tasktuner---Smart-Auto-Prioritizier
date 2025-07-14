import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'TaskTuner',
  description: 'Stay on track with smart productivity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <Toaster position="top-right" />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
