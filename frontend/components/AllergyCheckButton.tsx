import React, { useEffect, useState } from "react";

interface AllergyCheckButtonProps {
  productTitle: string;
  productDescription: string;
}

const AllergyCheckButton: React.FC<AllergyCheckButtonProps> = ({ productTitle, productDescription }) => {
  const [status, setStatus] = useState<"loading" | "allergic" | "safe" | "unknown">("loading");

  useEffect(() => {
    const checkAllergy = async () => {
      setStatus("loading");
      // Get allergies from localStorage
      let allergies: string[] = [];
      try {
        allergies = JSON.parse(localStorage.getItem("walmart-ai-allergies") || "[]");
      } catch {}
      if (!allergies.length) {
        setStatus("unknown");
        return;
      }
      // Compose prompt for Gemini
      const prompt = `A user is allergic to the following: ${allergies.join(", ")}.\n\nProduct: ${productTitle}\nDescription: ${productDescription}\n\nBased on the product description and the user's allergies, is this product likely to cause an allergic reaction? Reply with only one word: 'Yes' or 'No'.`;
      try {
        const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                { parts: [{ text: prompt }] },
              ],
            }),
          }
        );
        const data = await res.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "unknown";
        if (aiText.includes("yes")) setStatus("allergic");
        else if (aiText.includes("no")) setStatus("safe");
        else setStatus("unknown");
      } catch {
        setStatus("unknown");
      }
    };
    checkAllergy();
    // Only re-run if product or allergies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTitle, productDescription, localStorage.getItem("walmart-ai-allergies")]);

  if (status === "loading")
    return <button className="mt-2 w-full bg-gray-200 text-gray-700 rounded px-2 py-1 cursor-not-allowed animate-pulse" disabled>Checking allergies...</button>;
  if (status === "allergic")
    return <button className="mt-2 w-full bg-red-600 text-white rounded px-2 py-1 cursor-not-allowed font-bold" disabled> Contains your allergen!</button>;
  if (status === "safe")
    return <button className="mt-2 w-full bg-green-600 text-white rounded px-2 py-1 cursor-not-allowed font-bold" disabled>No known allergens for you</button>;
  return null;
};

export default AllergyCheckButton; 