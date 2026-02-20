import React, { useState } from 'react';
import { MOCK_COUNSELORS } from '../constants';
import { Star, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';

const Booking = () => {
  const { user, addNotification } = useApp();
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    if (selectedCounselor && selectedSlot) {
      setIsBooking(true);
      const counselor = MOCK_COUNSELORS.find(c => c.id === selectedCounselor);
      
      try {
        if (supabase) {
          const { error } = await supabase.from('appointments').insert({
            user_id: user.id,
            counselor_id: selectedCounselor,
            counselor_name: counselor?.name,
            slot_time: selectedSlot,
            status: 'pending'
          });
          
          if (error) throw error;
        } else {
          await new Promise(r => setTimeout(r, 1000));
        }

        setShowConfirmation(true);
        addNotification("Appointment Request Sent!");
      } catch (err) {
        console.error(err);
        addNotification("Failed to book appointment.");
      } finally {
        setIsBooking(false);
      }
    }
  };

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 max-w-sm mb-8">
          You have secured a confidential slot. A confirmation email has been sent to your student ID.
        </p>
        <button 
          onClick={() => { setShowConfirmation(false); setSelectedCounselor(null); setSelectedSlot(null); }}
          className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Campus Counselors</h2>
      {/* rest of your code SAME */}
    </div>
  );
};

export default Booking;
