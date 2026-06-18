import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { hospitalAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, ShieldAlert, Award, Star, Phone, CalendarDays, CheckCircle, Loader2, X, FileText } from 'lucide-react';

const HospitalDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const bookDocId = searchParams.get('bookDocId');
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingType, setBookingType] = useState('in-person');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await hospitalAPI.getById(id);
      setData(res.data);
    } catch (err) {
      console.error('Fetch hospital details error:', err);
      setError('Hospital details could not be found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  useEffect(() => {
    if (data && data.doctors && bookDocId) {
      const doc = data.doctors.find(d => d._id.toString() === bookDocId.toString());
      if (doc) {
        handleOpenBooking(doc);
      }
    }
  }, [data, bookDocId]);

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingDate('');
    setBookingSlot('');
    setBookingReason('');
    setBookingNotes('');
    setBookingType('in-person');
    setBookingSuccessData(null);
  };

  const handleCloseBooking = () => {
    setSelectedDoctor(null);
    setBookingSuccessData(null);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login or register to book an appointment.');
      return;
    }
    if (!bookingDate || !bookingSlot || !bookingReason) {
      alert('Please fill in Date, Time Slot, and Reason for visit.');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await appointmentAPI.book({
        doctorId: selectedDoctor._id,
        hospitalId: data.hospital._id,
        date: bookingDate,
        timeSlot: bookingSlot,
        reason: bookingReason,
        notes: bookingNotes,
        consultationType: bookingType
      });
      setBookingSuccessData(res.data);
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err.response?.data?.message || 'Appointment scheduling failed. Verify doctor availability.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-clinic-600 animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Fetching hospital directories...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white border rounded-3xl shadow-soft text-center space-y-4">
        <h3 className="font-bold text-red-700 text-lg">Detailed record missing</h3>
        <p className="text-slate-400 text-sm">{error || 'This clinic database registry is unavailable.'}</p>
        <Link to="/hospitals" className="btn-primary inline-flex">Return to directories</Link>
      </div>
    );
  }

  const { hospital, doctors } = data;

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Hospital Header Banner Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover blur-sm" />
        </div>
        <div className="absolute top-0 right-0 h-64 w-64 bg-clinic-500/10 rounded-full blur-3xl z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-clinic-700/50 border border-clinic-500/30 rounded-full text-xs font-bold text-clinic-300 uppercase">
              {hospital.city} Verified
            </span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ★ {hospital.rating}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">{hospital.name}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-clinic-400" />
              {hospital.address}
            </span>
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <Phone className="h-4 w-4" />
              Ambulance: {hospital.ambulanceContact}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Core Dashboard Details split grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hospital parameters & reviews (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Box 1: Specialties & departments */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                Available Departments
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {hospital.departments.map((dept) => (
                  <span key={dept} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold rounded-xl">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 2: Emergency specifications */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                Emergency & ICU Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">24/7 ER Service:</span>
                  <span className={`font-bold ${hospital.emergencyService ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hospital.emergencyService ? 'Active & On-Duty' : 'Not Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ICU Bed Slots:</span>
                  <span className={`font-bold ${hospital.icuAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hospital.icuAvailable ? 'Beds Available' : 'No ICU Unit'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Blood Bank Supply:</span>
                  <span className={`font-bold ${hospital.bloodAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hospital.bloodAvailable ? 'Stock Available' : 'Low Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: Welfare Scheme Eligibility */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                Accepted Cashless Schemes
              </h3>
              {hospital.governmentSchemes.length > 0 ? (
                <div className="space-y-2">
                  {hospital.governmentSchemes.map((scheme) => (
                    <div key={scheme} className="bg-clinic-50/50 p-2.5 rounded-xl border border-clinic-100 flex items-center gap-2 text-xs font-bold text-clinic-700">
                      <Award className="h-4 w-4 text-clinic-600 shrink-0" />
                      {scheme}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Only private billing accepted at this institution.</p>
              )}
            </div>

            {/* Box 4: Reviews list */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                Patient Feedback
              </h3>
              {hospital.reviews.length > 0 ? (
                <div className="space-y-3.5 divide-y divide-slate-100">
                  {hospital.reviews.map((r, i) => (
                    <div key={r._id || i} className={`text-xs space-y-1.5 ${i > 0 ? 'pt-3' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">{r.patientName}</span>
                        <span className="text-amber-500 font-semibold">★ {r.rating}</span>
                      </div>
                      <p className="text-slate-500 italic leading-relaxed font-medium">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No reviews logged yet. Be the first to check in!</p>
              )}
            </div>

          </div>

          {/* Right Column: Doctors listing (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft">
              <h2 className="text-xl font-extrabold text-slate-900 pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-clinic-700" />
                Select a Specialist Doctor
              </h2>

              {doctors.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <p className="font-semibold text-sm">No Active Practitioners</p>
                  <p className="text-xs">This hospital has not set up doctor queues for booking yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className="p-5 border border-slate-100 hover:border-clinic-200 bg-slate-50/50 rounded-2xl flex flex-col justify-between hover:shadow-soft transition-all space-y-4">
                      
                      <div className="flex items-start gap-4">
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          className="h-16 w-16 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100"
                        />
                        <div className="space-y-1 text-left">
                          <h3 className="font-bold text-slate-800 text-sm leading-tight">{doctor.name}</h3>
                          <p className="text-xs text-clinic-600 font-semibold">{doctor.specialization}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Experience: {doctor.experience} Yrs</p>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                            ★ <span>{doctor.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule info */}
                      <div className="bg-white border border-slate-100 p-2.5 rounded-xl text-left space-y-1">
                        <span className="text-[9px] text-slate-400 block font-semibold uppercase">Consultation Days</span>
                        <div className="flex flex-wrap gap-1">
                          {doctor.availableDays.map((day) => (
                            <span key={day} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold rounded">
                              {day.slice(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 block">Consultation Fee</span>
                          <span className="text-sm font-extrabold text-slate-800">₹{doctor.consultationFee}</span>
                        </div>
                        <button
                          onClick={() => handleOpenBooking(doctor)}
                          className="px-3.5 py-2 bg-clinic-700 hover:bg-clinic-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                        >
                          Book Slot
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Appointment Booking Modal Overlay */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative text-left animate-zoom">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Book Clinical Consultation</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{hospital.name}</p>
              </div>
              <button onClick={handleCloseBooking} className="p-1 hover:bg-white/10 rounded-lg text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {!bookingSuccessData ? (
                // Booking input fields
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  
                  {/* Doctor Info card */}
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl flex items-center gap-3.5">
                    <img
                      src={selectedDoctor.photo}
                      alt={selectedDoctor.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-200 bg-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{selectedDoctor.name}</h4>
                      <p className="text-xs text-clinic-600 font-semibold">{selectedDoctor.specialization}</p>
                      <p className="text-[10px] text-slate-400">Consultation Cost: ₹{selectedDoctor.consultationFee}</p>
                    </div>
                  </div>

                  {/* Consultation Mode Selection */}
                  <div>
                    <label className="input-label">Consultation Mode</label>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setBookingType('in-person')}
                        className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                          bookingType === 'in-person'
                            ? 'border-clinic-600 bg-clinic-50/70 text-clinic-800 shadow-sm font-extrabold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                        }`}
                      >
                        <span className="text-lg">🏥</span>
                        <span>In-Person Visit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingType('video')}
                        className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                          bookingType === 'video'
                            ? 'border-clinic-600 bg-clinic-50/70 text-clinic-800 shadow-sm font-extrabold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                        }`}
                      >
                        <span className="text-lg">📹</span>
                        <span>Video Conference</span>
                      </button>
                    </div>
                  </div>

                  {/* Input 1: Selection date */}
                  <div>
                    <label className="input-label">Select Consultation Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Input 2: Time Slots options */}
                  <div>
                    <label className="input-label mb-1.5 block">Select Available Time Slot</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                      {selectedDoctor.availableTimeSlots.map((slot) => {
                        const isSelected = bookingSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingSlot(slot)}
                            className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                              isSelected
                                ? 'border-clinic-600 bg-clinic-50 text-clinic-700 shadow-sm font-extrabold ring-1 ring-clinic-500'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white hover:border-slate-350'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {!bookingSlot && (
                      <p className="text-[10px] text-amber-600 mt-1.5">⚠️ Please select one of the available timeslots above.</p>
                    )}
                  </div>

                  {/* Input 3: Reason */}
                  <div>
                    <label className="input-label">Reason for Visit</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual routine heart checkup, cough, severe back ache"
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Input 4: Notes */}
                  <div>
                    <label className="input-label">Special Clinical Notes (Optional)</label>
                    <textarea
                      rows="2"
                      placeholder="List any history of diabetes, hypertension or existing medications..."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="input-field"
                    ></textarea>
                  </div>

                  {/* Button row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="btn-secondary px-4 py-2"
                    >
                      Wipe Clean
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="btn-primary px-5 py-2.5"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        'Confirm Appointment'
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                // Success Confirmation panel
                <div className="text-center py-6 space-y-6">
                  
                  <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600 shadow-soft">
                    <CheckCircle className="h-10 w-10 animate-scale" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-800 text-lg">Booking Confirmed!</h3>
                    <p className="text-slate-400 text-xs">Your appointment reservation pass has been generated.</p>
                  </div>

                  {/* Confirmation Receipt table */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs text-left space-y-3 font-medium">
                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">APPOINTMENT ID</span>
                      <span className="font-extrabold text-clinic-700">{bookingSuccessData.appointmentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Practitioner:</span>
                      <span className="text-slate-800 font-bold">{selectedDoctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Specialty:</span>
                      <span className="text-slate-800 font-semibold">{selectedDoctor.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hospital:</span>
                      <span className="text-slate-800 font-semibold">{hospital.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consultation Type:</span>
                      <span className="text-slate-850 font-bold capitalize">
                        {bookingSuccessData.consultationType === 'video' ? '📹 Video Call' : '🏥 In-Person'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scheduled Date:</span>
                      <span className="text-slate-800 font-bold">
                        {new Date(bookingSuccessData.date).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scheduled Time:</span>
                      <span className="text-slate-800 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {bookingSuccessData.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Booking Status:</span>
                      <span className="font-bold text-clinic-700 capitalize">{bookingSuccessData.status}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal px-2">
                    Kindly carry your health cards/insurance records and reach the hospital counter 15 minutes prior to the booked slot for verification.
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3">
                    <button
                      onClick={handleCloseBooking}
                      className="btn-secondary text-xs"
                    >
                      Close Receipt
                    </button>
                    <Link
                      to="/dashboard/patient"
                      className="btn-primary text-xs flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      View in Dashboard
                    </Link>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalDetails;
