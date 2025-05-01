// hooks/useSmartTaskRedirect.js
import { useNavigate, useLocation } from "react-router-dom";

const useSmartTaskRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectIfLabelMismatch = (categoryId, selectedLabels = []) => {
    const searchParams = new URLSearchParams(location.search);
    const labelId = searchParams.get("labelId");

    const isLabelValid = labelId && selectedLabels.includes(labelId);

    if (labelId && !isLabelValid) {
      if (selectedLabels.length === 1) {
        // Redirect to the only valid label
        navigate(`/user/dashboard/tasks/${categoryId}?labelId=${selectedLabels[0]}`);
      } else if (selectedLabels.length > 1) {
        // Redirect to the first matching label
        navigate(`/user/dashboard/tasks/${categoryId}?labelId=${selectedLabels[0]}`);
      }
    }

    // If no labelId or it’s valid → do nothing (append is fine)
  };

  return redirectIfLabelMismatch;
};

export default useSmartTaskRedirect;
