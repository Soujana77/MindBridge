import { motion } from "framer-motion";
import { Phone, Calendar, HeartHandshake } from "lucide-react";

const psychiatrists = [
  {
    name: "Dr. Ananya Rao",
    specialty: "Clinical Psychiatrist",
    experience: "12+ years experience",
    phone: "+91 98765 43210",
  },
  {
    name: "Dr. Rohan Mehta",
    specialty: "Mental Health Counselor",
    experience: "8+ years experience",
    phone: "+91 91234 56789",
  },
  {
    name: "Dr. Sarah Williams",
    specialty: "Cognitive Behavioral Therapist",
    experience: "10+ years experience",
    phone: "+91 99887 66554",
  },
];

const Counselling = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Counseling & Support
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Professional help can make a real difference. Reach out to certified
          mental health professionals for guidance, clarity, and emotional
          support.
        </p>
      </motion.div>

      {/* Emergency Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600
        text-white rounded-2xl p-6 mb-12 flex items-center gap-6 shadow-xl"
      >
        <HeartHandshake size={40} />
        <div>
          <h2 className="text-xl font-semibold">You are not alone</h2>
          <p className="opacity-90">
            If you’re feeling overwhelmed, talking to someone can help more than
            you think.
          </p>
        </div>
      </motion.div>

      {/* Psychiatrist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {psychiatrists.map((doc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {doc.name}
            </h3>
            <p className="text-indigo-600 font-medium mt-1">
              {doc.specialty}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {doc.experience}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${doc.phone}`}
                className="flex items-center justify-center gap-2
                bg-indigo-600 text-white py-2 rounded-xl
                hover:bg-indigo-700 transition"
              >
                <Phone size={18} />
                Call Now
              </a>

              <button
                className="flex items-center justify-center gap-2
                border border-indigo-600 text-indigo-600 py-2 rounded-xl
                hover:bg-indigo-50 transition"
              >
                <Calendar size={18} />
                Book Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Counselling;