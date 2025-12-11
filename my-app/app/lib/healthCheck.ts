// Health check utility for Render free tier backend

const BACKEND_API_URL = process.env.STORE_API_URL;

// Cache for health check status to avoid repeated checks in quick succession
let lastHealthCheckTime: number = 0;
let isBackendHealthy: boolean = false;
const HEALTH_CHECK_CACHE_MS = 30000; // Cache health status for 30 seconds

export interface HealthCheckResult {
  healthy: boolean;
  message: string;
  responseTime?: number;
}

/**
 * Performs a health check on the backend server
 * This is useful for Render's free tier which spins down inactive services
 * @param timeout Maximum time to wait for the health check (default: 60 seconds for cold starts)
 * @returns HealthCheckResult
 */
export async function checkBackendHealth(
  timeout: number = 60000
): Promise<HealthCheckResult> {
  if (!BACKEND_API_URL) {
    return {
      healthy: false,
      message: "Backend API URL not configured",
    };
  }

  // Return cached result if still valid
  const now = Date.now();
  if (isBackendHealthy && now - lastHealthCheckTime < HEALTH_CHECK_CACHE_MS) {
    return {
      healthy: true,
      message: "Backend is healthy (cached)",
      responseTime: 0,
    };
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${BACKEND_API_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      // Update cache
      lastHealthCheckTime = Date.now();
      isBackendHealthy = true;

      return {
        healthy: true,
        message: "Backend is healthy",
        responseTime,
      };
    } else {
      isBackendHealthy = false;
      return {
        healthy: false,
        message: `Backend returned status ${response.status}`,
        responseTime,
      };
    }
  } catch (error) {
    isBackendHealthy = false;
    const responseTime = Date.now() - startTime;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          healthy: false,
          message: "Health check timed out - backend may be starting up",
          responseTime,
        };
      }
      return {
        healthy: false,
        message: `Health check failed: ${error.message}`,
        responseTime,
      };
    }

    return {
      healthy: false,
      message: "Health check failed with unknown error",
      responseTime,
    };
  }
}

/**
 * Wrapper function that performs a health check before executing an API call
 * Ensures the backend is awake before making the actual request
 */
export async function withHealthCheck<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  const healthResult = await checkBackendHealth();

  if (!healthResult.healthy) {
    throw new Error(healthResult.message);
  }

  return apiCall();
}

/**
 * Reset the health check cache (useful for testing or when you know the backend status changed)
 */
export function resetHealthCheckCache(): void {
  lastHealthCheckTime = 0;
  isBackendHealthy = false;
}

