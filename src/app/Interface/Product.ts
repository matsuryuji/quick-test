/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Product {
  title: string;
  price: number;
  images: any[];
  variants: {
    sizes: string[];
    colors: string[];
  };
}
