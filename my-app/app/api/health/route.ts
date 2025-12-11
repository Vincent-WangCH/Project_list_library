import { NextResponse } from "next/server";
import { checkBackendHealth } from "@/app/lib/healthCheck";

/**
 * GET /api/health
 * Performs a health check on the backend server
 * Used by the frontend to check if the backend is awake before making actual API calls
 */
export async function GET() {
  try {
    const result = await checkBackendHealth();

    if (result.healthy) {
      return NextResponse.json(
        {
          status: "healthy",
          message: result.message,
          responseTime: result.responseTime,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: result.message,
          responseTime: result.responseTime,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

