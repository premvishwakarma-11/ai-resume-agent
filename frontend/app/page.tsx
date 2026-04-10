"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://ai-resume-agent-3l5c.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, skills }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      if (data.error) {
        setResponse("❌ " + data.error);
      } else {
        setResponse(data.message);
      }

    } catch (error) {
      console.error(error);
      setResponse("❌ Failed to connect backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 bg-gray-200 min-h-screen text-black">
      <h1 className="text-2xl md:text-3xl font-bold text-center">
        AI Resume & Career Agent 🚀
      </h1>

      {/* Input Form */}
      <div className="mt-8 flex flex-col items-center">
        <input
          placeholder="Enter Name"
          className="border p-2 w-full max-w-md mb-3 text-black bg-white rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Enter Skills (e.g. Python, HTML)"
          className="border p-2 w-full max-w-md mb-3 text-black bg-white rounded"
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full max-w-md"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Output Section */}
      {response && (
        <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {/* Career Suggestions */}
          <div className="bg-white p-5 rounded shadow">
            <h2 className="font-bold text-lg mb-2">💼 Career Suggestions</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {response.split("Skills to Improve:")[0]}
            </pre>
          </div>

          {/* Skills */}
          <div className="bg-white p-5 rounded shadow">
            <h2 className="font-bold text-lg mb-2">🧠 Skills to Improve</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {response.split("Skills to Improve:")[1]?.split("Resume Summary:")[0]}
            </pre>
          </div>

          {/* Resume */}
          <div className="bg-white p-5 rounded shadow">
            <h2 className="font-bold text-lg mb-2">📄 Resume Summary</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {response.split("Resume Summary:")[1]}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}