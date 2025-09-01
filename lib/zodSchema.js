import { z } from 'zod'

export const zSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must include at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must include at least one special character" }),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name can't be longer than 50 characters" }),
    
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only digits" }),
  
  review: z
    .string()
    .min(3, { message: 'Review is required.' }),
    
  code: z
    .string()
    .min(3, { message: 'Coupon code is required.' }),
    
  phone: z
    .string()
    .min(10, { message: 'Phone number is required.' }),
    
  country: z
    .string()
    .min(3, { message: 'Country is required.' }),
    
  state: z
    .string()
    .min(3, { message: 'State is required.' }),
    
  city: z
    .string()
    .min(3, { message: 'City is required.' }),
    
  pincode: z
    .string()
    .min(3, { message: 'Pincode is required.' }),
    
  landmark: z
    .string()
    .min(3, { message: 'Landmark is required.' }),
    
  ordernote: z
    .string()
    .optional(),
    
  address: z
    .string()
    .min(3, { message: 'Address is required.' }),
});