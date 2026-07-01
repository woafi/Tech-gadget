import { z } from 'zod';

// Checkout Schema
export const checkoutSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    address: z
        .string()
        .min(1, 'Address is required')
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address must be less than 200 characters'),
    city: z
        .string()
        .min(1, 'City is required')
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must be less than 50 characters'),
    zipCode: z
        .string()
        .min(1, 'ZIP code is required')
        .regex(/[0-9]/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            'Please enter a valid phone number'
        ),
    paymentMethod: z.enum(['credit-card', 'paypal', 'sslcommerz']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;