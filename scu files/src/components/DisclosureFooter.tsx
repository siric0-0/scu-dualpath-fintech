import React from 'react';
import { OFFICIAL_SOUNDCU_DISCLOSURE } from '../utils/amortization';
import { ShieldCheck, Info, MapPin, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { SoundCuLogo } from './SoundCuLogo';

export const DisclosureFooter: React.FC = () => {
  const branches = [
    'Alderwood', 'Auburn', 'Bellevue', 'Bonney Lake', 'Bothell', 'Burien',
    'Downtown Olympia', 'Downtown Tacoma', 'Edmonds', 'Everett', 'Federal Way',
    'Gig Harbor', 'Graham', 'Kent', 'Key Center', 'Lakewood', 'Lynnwood',
    'Mukilteo', 'Olympia', 'Pacific Ave', 'Parkland', 'Puyallup', 'Redmond',
    'Shoreline', 'Southcenter', 'Westgate'
  ];

  return (
    <footer className="mt-12 bg-white border-t border-[#D5E3EC] pt-10 pb-12 text-[#4A5D6E] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Footer Tier: Brand, Routing Number, and Connect */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#EDF3F7]">
          {/* Col 1: Logo & Mission */}
          <div className="md:col-span-4 space-y-3">
            <SoundCuLogo withTagline={true} />
            <p className="text-xs text-[#6A7E8F] leading-relaxed pt-1">
              Since 1940, we’ve been Washington’s favorite credit union, helping members with lower rates, better service & smiles all around.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[#002D72] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#0082CA]" />
              <span>FEDERALLY INSURED BY NCUA · Equal Housing Opportunity</span>
            </div>
          </div>

          {/* Col 2: Routing Number Card (Authentic from SoundCU site) */}
          <div className="md:col-span-4 flex justify-start md:justify-center">
            <div className="p-4 bg-[#F4F8FA] border-2 border-[#002D72] rounded-2xl w-full max-w-xs text-center shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A7E8F] block">
                Routing Number
              </span>
              <span className="text-2xl font-bold font-mono text-[#002D72] block mt-1 tracking-wider tabular-nums">
                325183220
              </span>
              <span className="text-[10px] text-[#0082CA] block mt-1">
                Sound Credit Union · Direct Deposit & Transfers
              </span>
            </div>
          </div>

          {/* Col 3: Connect & Help */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002D72] block">
              Connect With Sound
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#002D72] font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#0082CA]" />
                <a href="tel:8005628130" className="hover:underline font-mono">800.562.8130</a>
              </div>
              <div className="flex items-center gap-2 text-[#002D72]">
                <MessageSquare className="w-3.5 h-3.5 text-[#0082CA]" />
                <span className="hover:underline cursor-pointer">Chat with Us</span>
              </div>
              <div className="flex items-center gap-2 text-[#002D72]">
                <MapPin className="w-3.5 h-3.5 text-[#0082CA]" />
                <span className="hover:underline cursor-pointer">26 Branches & 30,000+ Surcharge-Free ATMs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Serving Puget Sound Branches Grid */}
        <div className="py-6 border-b border-[#EDF3F7]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#002D72] block mb-3">
            Serving Puget Sound
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-1.5 gap-x-3 text-[11px] text-[#6A7E8F]">
            {branches.map((b) => (
              <span key={b} className="hover:text-[#002D72] transition-colors cursor-default">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Regulatory Disclosures & Safe Harbor Notice */}
        <div className="pt-6 space-y-3 text-[11px] text-[#6A7E8F] leading-relaxed">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0082CA] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#002D72]">DISCLOSURES: </strong>
              {OFFICIAL_SOUNDCU_DISCLOSURE} All financial amortizations, resilience scores, and shock tests are simulated using deterministic standard compound interest equations. No funds are autonomously moved. Personal identifiers are tokenized before analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-[#EDF3F7]">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:underline cursor-pointer">Forms & Disclosures</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Accessibility</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Security</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
            </div>
            <span>© 2026 Sound Credit Union. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
