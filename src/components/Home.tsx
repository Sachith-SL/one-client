import { useState, useEffect } from "react";
import { getWelcomeMessageApi } from "../services/HomeService";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getWelcomeMessageApi()
      .then((data: string) => {
        setMessage(data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-center">{loading ? "Loading..." : message}</h1>
    </div>
  );
}

export default Home;
