import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { api_uri } from "../endpoints";

// Extend the Error type to include response
interface ApiError extends Error {
  response?: AxiosResponse;
}

interface UseApiResponse<T = any> {
  loading: boolean;
  response: T | null;
  error: string | null;
  apiRequest: <T>(
    method: Method,
    endpoint: string,
    body?: any,
    config?: Record<string, any>,
    params?: Record<string, any>
  ) => Promise<T>;
}

const useApiRequest = (): UseApiResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to dynamically get headers
  const getHeaders = () => {
    const token = localStorage.getItem("token"); // Replace 'token' with your token key
    return {
      "Content-Type": "application/json", // Default content type
      Authorization: token ? `Bearer ${token}` : undefined, // Include Bearer token if it exists
    };
  };

  const apiRequest = useCallback(
    async <T>(
      method: string,
      endpoint: string,
      body: any = null,
      customHeaders: Record<string, string> = {},
      responseType?: string
    ): Promise<T> => {
      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        const headers = {
          ...getHeaders(),
          ...customHeaders,
        };

        // Remove Content-Type header if body is FormData
        if (body instanceof FormData) {
          delete headers["Content-Type"];
        }

        const config = {
          method,
          url: `${api_uri}/${endpoint}`,
          headers,
          data: body,
          validateStatus: () => true, // Always resolve the promise so we can handle all status codes
          responseType: responseType as any, // Add this line
        };

        const result = await axios.request<T>(config);

        // Handle non-2xx responses
        if (result.status < 200 || result.status >= 300) {
          const error = new Error(
            result.data?.message ||
              `Request failed with status ${result.status}`
          ) as ApiError;
          error.response = result; // Attach the full response to the error
          throw error;
        }

        setResponse(result.data);
        return result.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const responseData = axiosError.response.data as { message?: string };
          const errorMessage =
            responseData?.message ||
            axiosError.response.statusText ||
            `Request failed with status ${axiosError.response.status}`;

          setError(errorMessage);

          // Create a new error with the server's error message
          const serverError = new Error(errorMessage) as ApiError;
          serverError.response = axiosError.response;
          throw serverError;
        } else if (axiosError.request) {
          // The request was made but no response was received
          const errorMessage =
            "No response received from server. Please check your connection.";
          setError(errorMessage);
          throw new Error(errorMessage);
        } else {
          // Something happened in setting up the request
          const genericError = error as Error;
          const errorMessage = genericError.message || "An error occurred";
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, response, error, apiRequest };
};

export default useApiRequest;
