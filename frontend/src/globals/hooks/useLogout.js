import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../services/logoutService";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function logout() {
    setLoading(true);
    
    try {
      const response = await logoutService();

      queryClient.clear();

      if (response.success === true) {
        navigate("/login");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, logout };
}
