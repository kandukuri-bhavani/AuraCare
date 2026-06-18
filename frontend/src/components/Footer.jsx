import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, ShieldCheck, PhoneCall } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Branding & Philosophy */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="bg-clinic-800/50 p-2 rounded-xl border border-clinic-700/30">
                <Stethoscope className="h-6 w-6 text-clinic-400" />
              </div>
              <span className="font-sans font-extrabold text-xl tracking-tight text-white">
                Aura<span className="text-clinic-400">Care</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridging the gap between affordable clinical care, official state medical schemes, and premium localized hospital booking systems.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <Heart className="h-3 w-3 text-emergency-500" />
              <span>Caring for your wellness 24/7</span>
            </div>
          </div>

          {/* Column 2: Navigation links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform Pages</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/hospitals" className="hover:text-clinic-400 transition-colors">Find Local Hospitals</Link>
              </li>
              <li>
                <Link to="/smart-recommendation" className="hover:text-clinic-400 transition-colors">Smart Affordability Matcher</Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-clinic-400 transition-colors">Emergency Ambulance Helpline</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-clinic-400 transition-colors">Patient Account Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Schemes & Partners */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Supported Schemes</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-clinic-500" />
                Ayushman Bharat PM-JAY
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-clinic-500" />
                CGHS (Govt Employees)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-clinic-500" />
                State Low-Income Cards
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-clinic-500" />
                Digital ABHA ID Verification
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hotlines */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Emergency Hotlines</h3>
            <div className="space-y-3">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <div className="bg-emergency-500/10 p-2 rounded-lg text-emergency-500">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ambulance Fleet</div>
                  <div className="text-sm font-bold text-white">102 / 108 (24/7 Toll-Free)</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                If you are experiencing an immediate cardiac event, respiratory distress, or stroke, call emergency hotlines immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} AuraCare Technologies Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Clinical Terms of Service</span>
            <span className="hover:underline cursor-pointer">Support Helpdesk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
