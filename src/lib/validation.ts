import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email or mobile number is required" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});
export const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(11, { message: "Phone number is required" }),
    email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});