import { notFound } from "next/navigation";
import { getCategoryByValue } from "@/lib/constants";
import { categories } from "@/lib/constants";
import SubcategoryCarousel from "@/components/categories/SubcategoryCarousel";
import CategoryClient from "@/components/categories/CategoryClient";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategoryByValue(params.category);
  if (!category) notFound();

  return <CategoryClient category={category} categories={categories} />;
}
