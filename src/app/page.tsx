import {redirect} from 'next/navigation';
import {routing} from '@/i18n/routing';

// Fallback: middleware handles locale detection + redirect for `/`
// This page only renders if middleware somehow skips
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
