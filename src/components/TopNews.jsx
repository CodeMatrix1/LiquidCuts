"use client"
import React from "react";
export default function TopNews() {
  return (
    <div className="flex flex-col justify-start h-full w-full flex-1 overflow-y-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top News</h1>
      <p className="text-gray-600">Stay tuned for the latest updates!</p>
      <div className="collapse collapse-plus bg-base-100 border border-base-300">
  <input type="radio" name="my-accordion-3" />
  <div className="collapse-title font-semibold">How do I create an account?</div>
  <div className="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
</div>
<div className="collapse collapse-plus bg-base-100 border border-base-300">
  <input type="radio" name="my-accordion-3" />
  <div className="collapse-title font-semibold">I forgot my password. What should I do?</div>
  <div className="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
</div>
<div className="collapse collapse-plus bg-base-100 border border-base-300">
  <input type="radio" name="my-accordion-3" />
  <div className="collapse-title font-semibold">How do I update my profile information?</div>
  <div className="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
</div>
      <div className="mt-6 w-full">
        {/* Placeholder for news content */}
        <div className="bg-white shadow-md rounded-lg p-6 py-4 w-full">
          <p className="text-gray-500 text-sm font-semibold">
            This is where the latest news will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
}
