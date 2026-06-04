import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

function InputField({ label, id, type = "text", value, onChange, error, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase text-zinc-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60 ${
          error ? "border-red-500/60 focus:ring-red-500/30" : "border-zinc-700/60 hover:border-zinc-600"
        }`}
      />
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function AddEventPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    artist: "",
    imageUrl: "",
    venue: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If not authenticated, we could redirect, but App.jsx route protection handles this.

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Concert Name is required";
    if (!form.artist.trim()) e.artist = "Artist Name is required";
    if (!form.venue.trim()) e.venue = "Venue is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    
    if (form.date && form.time) {
      const eventDateTime = new Date(`${form.date}T${form.time}`);
      if (eventDateTime <= new Date()) {
        e.date = "Event must be in the future";
      }
    }
    return e;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        artist: form.artist.trim(),
        imageUrl: form.imageUrl.trim(),
        venue: form.venue.trim(),
        date: `${form.date}T${form.time}:00`,
      };

      await api.post("/events", payload);
      setSuccess(true);
      setForm({ name: "", artist: "", imageUrl: "", venue: "", date: "", time: "" });
      
      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create event.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/4 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-lg relative z-10">


        {/* Glow border */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/20 via-transparent to-amber-500/5 pointer-events-none" />
        
        <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
          <div className="mb-8">
            <h1 className="font-display text-3xl tracking-wider text-white uppercase">
              Create <span className="text-amber-400">Event</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Add a new concert to the StageFront platform.
            </p>
          </div>

          {success && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Event created successfully! Redirecting...
            </div>
          )}

          {serverError && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Image - Moved to top */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest uppercase text-zinc-400">
                Event Image Cover
              </label>
              
              {form.imageUrl ? (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-zinc-700 group">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium bg-zinc-900/80 px-4 py-2 rounded-lg backdrop-blur-sm cursor-pointer">
                      Change Image
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setForm({ ...form, imageUrl: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative w-full h-40 bg-zinc-900/60 border-2 border-dashed border-zinc-700/60 hover:border-amber-400/50 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-amber-400/20 group-hover:text-amber-400 transition-colors text-zinc-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-amber-400 transition-colors">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setForm({ ...form, imageUrl: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            <InputField
              label="Concert Name"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="e.g. Rock Fest 2026"
            />
            
            <InputField
              label="Artist / Band"
              id="artist"
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              error={errors.artist}
              placeholder="e.g. The Rockers"
            />

            {/* Artist was here, image input removed from here */}
            
            <InputField
              label="Venue"
              id="venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              error={errors.venue}
              placeholder="e.g. Tokyo Dome"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Date"
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                error={errors.date}
              />
              <InputField
                label="Time"
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                error={errors.time}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_24px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_32px_rgba(251,191,36,0.4)] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Creating Event...
                </>
              ) : (
                "Publish Event"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
