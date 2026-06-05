import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getFilteredCollectionData } from "@/lib/data";
import {
  ALLOWED_COLLECTIONS,
  isAllowedCollection,
  normalizeTicker,
  requiresTicker,
} from "@/lib/validators";

export async function GET(request) {
  try {
    const { error } = await requireAuth(request);

    if (error) {
      return NextResponse.json(error, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get("collection");
    const ticker = normalizeTicker(searchParams.get("ticker"));

    if (!collectionName || !isAllowedCollection(collectionName)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing collection name",
          allowedCollections: ALLOWED_COLLECTIONS,
        },
        { status: 400 }
      );
    }

    if (requiresTicker(collectionName) && !ticker) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticker is required for this collection",
        },
        { status: 400 }
      );
    }

    const data = await getFilteredCollectionData(collectionName, { ticker });

    return NextResponse.json({
      success: true,
      filters: {
        ticker,
      },
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
