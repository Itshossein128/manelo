import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(6, "Full name must be at least 6 characters"),
    email: z.string().email("Invalid email address"),

});
