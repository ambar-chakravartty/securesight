"use client";

import { useState } from "react";
import ollama from "ollama";

export default function Home() {
  const [dummyEmail, setDummyEmail] = useState("Generating phishing email...");
  const [isPhishing, setIsPhishing] = useState(false);
  const [emailType, setEmailType] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null); // User's selected answer
  const [feedback, setFeedback] = useState<string>(""); 

  // Function to fetch a phishing email from Ollama
  const fetchPhishingEmail = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-email");
  
      const data = await response.json();
  
      if (response.ok) {
        data.email.replace(/fake|phishing/,"secureSight")
        setDummyEmail(data.email); // Update dummyEmail with the fetched email
        setEmailType(data.scam); // Update the type
        setUserAnswer(null); // Reset user answer
        setFeedback("");
      } else {
        setDummyEmail("Failed to generate phishing email.");
      }
    } catch (error) {
      console.error("Error fetching email:", error);
      setDummyEmail("An error occurred while generating the email.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleUserAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    if (emailType === answer) {
      setFeedback("Correct! You identified the email correctly.");
    } else {
      setFeedback("Incorrect. Try to spot the signs of phishing better next time!");
    }
  };
  
  // Fetch email on component mount
  useState(() => {
    fetchPhishingEmail();
  });




  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-sky-700 text-white p-4">
        <h1 className="text-xl font-semibold">PhishFinders</h1>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-center items-start p-8 space-y-4 md:space-y-0 md:space-x-8">
        {/* Email Display */}
        <div className="bg-white shadow-md rounded-md p-6 w-full md:w-2/3">
          <h2 className="text-lg text-black font-medium mb-4">Email</h2>
          <textarea
            className="w-full h-96 p-4 text-black border border-gray-300 rounded-md bg-gray-50"
            value={dummyEmail}
            readOnly
          ></textarea>
        </div>

        {/* Phishing Classification */}
        <div className="bg-white shadow-md rounded-md p-6 w-full md:w-1/3">
          <h2 className="text-lg text-black font-medium mb-4">Phishing Classification</h2>
          <div className="flex items-center space-x-4">
  
            <label htmlFor="phishingCheck" className="text-gray-700">
              Mark as phishing
            </label>
          </div>
          <div className="mt-4 flex gap-4">
          <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleUserAnswer(true)}
        >
          Scam
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => handleUserAnswer(false)}
        >
          Not a Scam
        </button>
      </div>
      <div className="mt-4">
        {feedback && <p className="text-lg text-black font-semibold">{feedback}</p>}
        <button
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={fetchPhishingEmail}
      >
        Generate New Email
      </button>
      </div>
        </div>
      </div>
    </div>
  );
}
