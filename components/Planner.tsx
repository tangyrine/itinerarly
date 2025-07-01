"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import ItineraryGeneration from "../lib/ItineraryGeneration";
import Itinerary from "./Itinerary";
import { Loader } from "lucide-react";

export default function Planner() {
  const [formData, setFormData] = useState({
    destination: "",
    people: "",
    days: "",
    budget: "",
  });
  const [itinerary, setItinerary] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    alert("Your preferences have been saved!");
  };

  const generateItinerary = async () => {
    setLoading(true);
    const result = await ItineraryGeneration(formData);
    setItinerary(result ?? "");
    setShowModal(true);
    setLoading(false);
  };

  return (
    <>
    <div className="flex justify-center items-center h-16 bg-blue-600">
      <Drawer.Root>
        <Drawer.Trigger>
          <div className="p-2 text-white text-center rounded cursor-pointer shadow-md">
            Open Planner
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none rounded-t-lg">
            <Drawer.Title className="text-lg font-bold p-4">Plan Your Trip</Drawer.Title>
            <div className="p-4 bg-white space-y-4">
              {/* 1. Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                  Where do you want to go?
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter destination"
                />
              </div>

              {/* 2. People */}
              <div>
                <label htmlFor="people" className="block text-sm font-medium text-gray-700">
                  How many people?
                </label>
                <select
                  id="people"
                  name="people"
                  value={formData.people}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select group size
                  </option>
                  <option value="1-4">1-4</option>
                  <option value="5-9">5-9</option>
                  <option value=">9">&gt;9</option>
                </select>
              </div>

              {/* 3. Days */}
              <div>
                <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                  How many days?
                </label>
                <input
                  type="number"
                  id="days"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter number of days"
                  min={1}
                />
              </div>

              {/* 4. Budget (auto-generated) */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Approximate Budget (INR)
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select budget
                  </option>
                  <option value="high">high</option>
                  <option value="medium">medium</option>
                  <option value="low">low</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={generateItinerary}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    "Generate Itinerary"
                  )}
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
    <Itinerary
        open={showModal}
        onClose={() => setShowModal(false)}
        itinerary={itinerary}
        destination={formData.destination}
      />
    </>
  );
}