import React, { useState } from "react";
import {
  Moon,
  Play,
  Waves,
  Trees,
  Flame,
  CloudRain,
  Sparkles
} from "lucide-react";

import { useApp } from "../context/AppContext";

const Sleep = () => {

  const { addXP, addNotification } = useApp();

  const [hours, setHours] = useState<number | "">("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const calculateSleep = () => {

    if (!hours || hours <= 0) return;

    let calculatedScore = 0;
    let message = "";

    if (hours >= 7 && hours <= 9) {
      calculatedScore = 95;
      message = "Perfect sleep! Your body will thank you.";
      addXP(30);
    } else if (hours >= 6) {
      calculatedScore = 75;
      message = "Not bad. Try sleeping a bit earlier.";
      addXP(20);
    } else {
      calculatedScore = 50;
      message = "You need more rest. Aim for 7–8 hours.";
      addXP(10);
    }

    setScore(calculatedScore);
    setFeedback(message);

    addNotification("Sleep logged successfully 🌙");

  };


  // Data placeholders
  const stories = [
    {
      title: "Moonlight Forest",
      desc: "A peaceful journey through a glowing forest."
    },
    {
      title: "Ocean Drift",
      desc: "Relax with gentle ocean waves."
    },
    {
      title: "Starry Night",
      desc: "Drift into sleep under calming stars."
    }
  ];


  const music = [
    {
      title: "Deep Sleep Piano",
      desc: "Soft piano melodies for deep rest"
    },
    {
      title: "Calm Night",
      desc: "Ambient sleep tones"
    }
  ];


  const sounds = [
    { name: "Rain", icon: CloudRain },
    { name: "Ocean", icon: Waves },
    { name: "Forest", icon: Trees },
    { name: "Fireplace", icon: Flame }
  ];


  return (

    <div className="p-6 space-y-8">


      {/* HEADER */}
      <div>

        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Moon />
          Sleep Coach
        </h1>

        <p className="text-slate-500">
          Relax your mind, slow your thoughts, and drift into peaceful sleep.
        </p>

      </div>


      {/* SLEEP TRACKER */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">

        <h2 className="font-semibold text-slate-700">
          How many hours did you sleep?
        </h2>

        <div className="flex gap-4 items-center">

          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            placeholder="Enter hours"
            className="border border-slate-200 rounded-lg p-2 w-40 focus:ring-2 focus:ring-indigo-400"
          />

          <button
            onClick={calculateSleep}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Analyze
          </button>

        </div>

      </div>


      {/* SCORE */}
      {score && (

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl shadow-sm p-6 animate-float">

          <div className="flex items-center gap-3 mb-2">
            <Moon />
            <h2 className="font-semibold text-lg">
              Sleep Score
            </h2>
          </div>

          <p className="text-4xl font-bold">
            {score}%
          </p>

          <p className="text-indigo-100 mt-2">
            {feedback}
          </p>

        </div>

      )}


      {/* SLEEP STORIES */}
      <Section title="Sleep Stories">

        <div className="grid md:grid-cols-3 gap-4">

          {stories.map((story, i) => (

            <Card key={i} title={story.title} desc={story.desc} />

          ))}

        </div>

      </Section>


      {/* AMBIENT SOUNDS */}
      <Section title="Ambient Sounds">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {sounds.map((sound, i) => {

            const Icon = sound.icon;

            return (

              <button
                key={i}
                className="bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition flex flex-col items-center gap-2"
              >

                <Icon />

                <span>
                  {sound.name}
                </span>

              </button>

            );

          })}

        </div>

      </Section>


      {/* BREATHING */}
      <Section title="Guided Breathing">

        <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col items-center">

          <div className="w-32 h-32 bg-indigo-200 rounded-full animate-breathe mb-4"></div>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">

            Start Breathing Session

          </button>

        </div>

      </Section>


      {/* MUSIC */}
      <Section title="Sleep Music">

        <div className="grid md:grid-cols-2 gap-4">

          {music.map((m, i) => (

            <Card key={i} title={m.title} desc={m.desc} />

          ))}

        </div>

      </Section>


      {/* QUICK ACTIONS */}
      <Section title="Need Help Sleeping Right Now?">

        <div className="flex flex-wrap gap-4">

          <ActionButton text="Play Instant Sleep Story" />

          <ActionButton text="Play Rain Sounds" />

          <ActionButton text="Start Breathing Exercise" />

        </div>

      </Section>


    </div>

  );

};

export default Sleep;



// Reusable components

const Section = ({ title, children }: any) => (

  <div>

    <h2 className="font-semibold text-slate-700 mb-3">
      {title}
    </h2>

    {children}

  </div>

);


const Card = ({ title, desc }: any) => (

  <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer">

    <div className="flex justify-between items-center">

      <div>

        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>

        <p className="text-sm text-slate-500">
          {desc}
        </p>

      </div>

      <Play className="text-indigo-600" />

    </div>

  </div>

);


const ActionButton = ({ text }: any) => (

  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">

    <Sparkles size={16} />

    {text}

  </button>

);
