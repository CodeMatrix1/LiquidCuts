"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ListNews({ newsItems, heading, subheading }) {
  return (
    <div className="flex flex-col justify-start h-full w-full flex-1 overflow-y-auto p-4">
      {heading ? <h1 className="text-2xl font-bold mb-4">{heading}</h1> : null}
      <p className="text-gray-600">{subheading}</p>
      <div className="mt-6 w-full rounded-md overflow-hidden">
        <Accordion type="single" collapsible>
          {newsItems.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="mb-2 border rounded-lg"
            >
              <AccordionTrigger className="px-6 py-4 font-semibold flex items-center justify-between">
                <span>{item.headline}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-gray-100 text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between pr-6">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Outlook :{" "}
                      </span>
                      <span
                        className={`font-bold ${
                          item.impact === "Positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.impact}
                      </span>
                      <span className="ml-2 text-gray-500">
                        for {item.company}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-600">
                        Liquidity:{" "}
                      </span>
                      <span className="font-bold">{item.liquidity}</span>
                    </div>
                  </div>
                  <div></div>
                  <span className="font-semibold text-gray-600">Details: </span>
                  <span>{item.summary}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
