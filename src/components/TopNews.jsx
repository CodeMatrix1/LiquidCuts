"use client"
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function TopNews() {
  return (
    <div className="flex flex-col justify-start h-full w-full flex-1 overflow-y-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top News</h1>
      <p className="text-gray-600">Stay tuned for the latest updates!</p>
      <div className="mt-6 w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="bg-white shadow-md rounded-lg p-6 py-4 w-full">
          <p className="text-gray-500 text-sm font-semibold">
            This is where the latest news will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
}
