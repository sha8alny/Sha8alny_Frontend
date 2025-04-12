
"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/Card";
import { MapPin, ExternalLink } from "lucide-react";
/**
 * @namespace business
 * @module business
 * @description A presentation component for displaying company information in a card format.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.company - The company data to display.
 * @param {string} props.company?.name - The name of the company?.
 * @param {string} props.company?.logo - The URL of the company's logo. Defaults to "/placeholder.svg" if not provided.
 * @param {string} props.company?.industry - The industry the company belongs to.
 * @param {string} props.company?.location - The location of the company?.
 * @param {string} props.company?.description - A brief description of the company?.
 * @param {number} props.company?.numFollowers - The number of followers the company has.
 * @param {Function} props.onManageClick - Callback function triggered when the "Manage" button is clicked.
 * @param {Function} props.onViewPageClick - Callback function triggered when the "View Page" button is clicked.
 *
 * @returns {JSX.Element} A card component displaying company details with options to manage or view the company page.
 */
 function CompanyCardPresentation({ company, onManageClick, onViewPageClick }) {
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Card className="overflow-hidden p-2 transition-all hover:shadow-md bg-foreground border-0 ">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
              <Image
                src={company?.logo || "/placeholder.svg"}
                alt={`${company?.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{company?.name}</h3>
              <p className="text-sm text-muted-foreground">{company?.industry}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{company?.location}</span>
          </div>
          <p className="text-sm mt-2">{truncateText(company?.description, 60)}</p>
          <p className="text-sm text-muted-foreground">
            {company?.numFollowers.toLocaleString()} followers
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full justify-between">
          <Button
            className="bg-secondary hover:cursor-pointer text-background hover:bg-secondary/80 transition-colors duration-200"
            size="sm"
            onClick={onManageClick}
          >
            Manage
          </Button>
          <Button variant="ghost" size="sm" onClick={onViewPageClick}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Page
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default CompanyCardPresentation;