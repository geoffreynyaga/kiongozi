/*
 * File: /Users/geoff/Documents/code/kiongozi/src/lib/supabase.ts
 * Project: kiongozi
 * Author: Geoffrey Nyaga  at geoffreynyagak@gmail.com
 * -----
 * Last Modified: Saturday October 5th 2024 12:50:00 pm
 * Modified By: Geoffrey Nyaga at geoffreynyagak@gmail.com
 * -----
 * This file should not be copied and/or distributed without the express
 * permission of Geoffrey Nyaga Kinyua
 *
 * Copyright (c) 2024 Geoffrey Nyaga Kinyua
 * -----
 * HISTORY:
 */

import {SupabaseClient, createClient} from "@supabase/supabase-js";

// Ensure all required environment variables are set

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

// Initialize Supabase client for client-side usage
// export const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
// );

export const supabase = "";
