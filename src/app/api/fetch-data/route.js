import { getData } from '../route'; // Adjust the import path as needed
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("collection");
    const data = await getData();

    if (!name || !data[name]) {
      return NextResponse({ error: "Invalid or missing collection name" }, { status: 400 });
    }

    return NextResponse.json(data[name]);
  } catch (error) {
        return NextResponse.json(
      { success: false, message: 'Failed to generate test', error: error.message },
      { status: 500 }
    );
  }
}