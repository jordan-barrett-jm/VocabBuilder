import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/quiz");
  }, []);
  return null; // or a simple "Loading..."
}
