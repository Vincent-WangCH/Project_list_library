import { NextRequest, NextResponse } from "next/server";
import { checkBackendHealth } from "@/app/lib/healthCheck";

// Backend API URL from environment variable
const BACKEND_API_URL = process.env.STORE_API_URL;

// GET - Retrieve a single sale item by ID from backend
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    // Perform health check before making the actual request
    const healthResult = await checkBackendHealth();
    if (!healthResult.healthy) {
      return NextResponse.json(
        { error: healthResult.message, isBackendWaking: true },
        { status: 503 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${BACKEND_API_URL}/items/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Item not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sale item from backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend API" },
      { status: 500 }
    );
  }
}

// PUT - Update a sale item via backend
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    // Perform health check before making the actual request
    const healthResult = await checkBackendHealth();
    if (!healthResult.healthy) {
      return NextResponse.json(
        { error: healthResult.message, isBackendWaking: true },
        { status: 503 }
      );
    }

    const { id } = await params;
    const input = await req.json();

    const response = await fetch(`${BACKEND_API_URL}/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to update item" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating sale item in backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend API" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a sale item via backend
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }

    // Perform health check before making the actual request
    const healthResult = await checkBackendHealth();
    if (!healthResult.healthy) {
      return NextResponse.json(
        { error: healthResult.message, isBackendWaking: true },
        { status: 503 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${BACKEND_API_URL}/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to delete item" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting sale item from backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend API" },
      { status: 500 }
    );
  }
}

