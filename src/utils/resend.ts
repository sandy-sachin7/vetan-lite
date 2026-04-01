import { Resend } from 'resend';

// Use a dummy key if env var is missing during local development
export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
