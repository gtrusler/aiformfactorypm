import type { JSX } from "react";
import type { StaticImageData } from "next/image";
import type { categoryType, authorType } from "@/app/blog/_assets/constants";

export interface articleType {
  slug: string;
  title: string;
  description: string;
  categories: categoryType[];
  author: authorType;
  publishedAt: string;
  image: {
    src?: StaticImageData;
    urlRelative: string;
    alt: string;
  };
  content: JSX.Element;
}
