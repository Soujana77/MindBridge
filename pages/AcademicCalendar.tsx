import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const AcademicCalendar = () => {
  const { addNotification } = useApp();

  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const addEvent = () => {
    if (!title || !date) return;

    setEvents([...events, { title, date }]);
    setTitle("");
    setDate("");

    addNotification("Event added successfully 📅");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">
        Academic Calendar
      </h2>

      {/* Add Event */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <input
          placeholder="Event title (Exam, Viva, Assignment)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />

        <button
          onClick={addEvent}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Add Event
        </button>
      </div>

      {/* Event List */}
      <div className="space-y-3">
        {events.map((e, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p className="font-semibold">{e.title}</p>
            <p className="text-sm text-slate-500">{e.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicCalendar;
