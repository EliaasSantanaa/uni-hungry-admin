import { UserRole } from "@/types";

export interface CustomerFormData {
  email: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  restaurantId?: string;
}

export interface CustomerFormErrors {
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
}
