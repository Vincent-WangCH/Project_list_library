import { NextRequest, NextResponse } from "next/server";

// Backend API URL from environment variable
const BACKEND_API_URL = process.env.STORE_API_URL;

// GET - Retrieve all sales items from backend
export async function GET() {
  try {
    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch items from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sales data from backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend API" },
      { status: 500 }
    );
  }
}

// POST - Create a new sale item via backend
export async function POST(req: NextRequest) {
  try {
    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    const input = await req.json();

    // Validate required fields before sending to backend
    if (!input.name || input.quantity == null || input.unitPrice == null) {
      return NextResponse.json(
        { error: "Name, quantity, and unitPrice are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to create item in backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating sale item in backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend API" },
      { status: 500 }
    );
  }
}

