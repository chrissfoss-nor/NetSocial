# NetSocial

A social networking application built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/).

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example environment file and fill in your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project anon (public) key |

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Client

The Supabase client is initialised in `lib/supabaseClient.js` and can be imported anywhere in the project:

```js
import { supabase } from '../lib/supabaseClient';
```
