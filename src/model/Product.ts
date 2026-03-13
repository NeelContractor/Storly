// type Product = {
//   _id: any;
//   name: string;
//   description: string;
//   category: string;
//   type: string;
//   brand: string;
//   price: number;
//   discount: number;
//   star: number;
//   color: string[];
//   size: string[];
//   tag: string[];
//   availability: boolean;
//   love: number;
//   status: { limited: boolean; prebuy: boolean };
//   specification: string;
//   image: {
//     img1: string;
//     img2: string;
//     img3: string;
//     img4?: string;
//     img5?: string;
//   };
//   comment: string[];
//   id: string;
// };

// export default Product;

import mongoose, { Schema, Document } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: string;
  type: string;
  brand: string;
  price: number;
  discount: number;
  star: number;
  color: string[];
  size: string[];
  tag: string[];
  availability: boolean;
  love: number;
  status: {
    limited: boolean;
    prebuy: boolean;
  };
  specification: string;
  image: {
    img1: string;
    img2: string;
    img3: string;
    img4?: string;
    img5?: string;
  };
  comment: string[];
  id: string;
}

const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    color: { type: [String], default: [] },
    size: { type: [String], default: [] },
    tag: { type: [String], default: [] },
    availability: { type: Boolean, default: true },
    love: { type: Number, default: 0 },
    status: {
      limited: { type: Boolean, default: false },
      prebuy: { type: Boolean, default: false },
    },
    specification: { type: String, default: "" },
    image: {
      img1: { type: String, required: true },
      img2: { type: String, required: true },
      img3: { type: String, required: true },
      img4: { type: String },
      img5: { type: String },
    },
    comment: { type: [String], default: [] },
    id: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;