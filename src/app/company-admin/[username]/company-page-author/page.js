"use client";
import { useSearchParams } from "next/navigation";

export default function CompanyPageAuthor() 
{
  const searchParams = useSearchParams();
  const logo = searchParams.get("logo");
  return (
    <div>
    </div>

  );
}
