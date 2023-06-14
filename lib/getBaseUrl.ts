import { cache } from 'react';

export const getBaseUrl = cache(() =>
  process.env.VERCEL_URL
    ? `https://muitatinta-agenda.vercel.app`
    : `http://localhost:${process.env.PORT ?? 3000}`,
);
