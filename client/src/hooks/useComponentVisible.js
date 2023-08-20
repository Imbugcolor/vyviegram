import { useEffect, useRef } from "react";

function useComponentVisible(setShow) {
    const ref = useRef(null);
  
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow.forEach(item => item(false))
      }
    };
  
    useEffect(() => {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    });
  
    return { ref };
}

export default useComponentVisible;