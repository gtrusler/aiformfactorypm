export interface Plan {
  variantId: number;
  name: string;
  description?: string;
  price?: number;
  features?: string[];
  limits?: {
    [key: string]: number;
  };
}
