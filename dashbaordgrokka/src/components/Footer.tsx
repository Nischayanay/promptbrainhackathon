import { useState } from 'react';

export function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navigationLinks = ['Feedbacks', 'Careers', 'Pricing'];
  const socialLinks = [
    { name: 'Instagram', url: '#' },
    { name: 'X', url: '#' },
    { name: 'Telegram', url: '#' }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('promptbrain.ops@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="w-full bg-black text-white border-t border-white/10 py-12">
      <div className="flex items-start justify-between gap-12 px-12">
        {/* Left Section - Brand Statement */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex flex-col leading-[0.85] tracking-tighter">
              <span className="text-[42px] font-[900] uppercase" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>WE</span>
              <span className="text-[42px] font-[900] uppercase" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>ARCHITECT</span>
              <span className="text-[42px] font-[900] uppercase" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>CONTEXT</span>
              <span className="text-[42px] font-[900]" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>:-)</span>
            </div>
          </div>
          <p className="text-[11px] text-white/60 uppercase tracking-[0.15em] mt-2">
            BUILT BY A SOLO FOUNDER
          </p>
        </div>

        {/* Divider */}
        <div className="h-32 w-px bg-white/30" />

        {/* Middle-Left Section - Navigation Links */}
        <nav className="flex flex-col gap-3 pt-1">
          {navigationLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[15px] text-white hover:text-white/70 transition-all duration-200 relative group"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white/70 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-32 w-px bg-white/30" />

        {/* Middle-Right Section - Contact */}
        <div className="flex flex-col gap-3 pt-1">
          <h3 className="text-[11px] text-white/60 uppercase tracking-[0.15em]">
            CONTACT US
          </h3>
          <button
            onClick={handleCopyEmail}
            className="text-[15px] text-white hover:text-white/70 transition-all duration-200 text-left relative group"
          >
            promptbrain.ops@gmail.com
            {copiedEmail && (
              <span className="absolute -top-8 left-0 text-xs text-[#00D9FF] animate-in fade-in slide-in-from-bottom-2 duration-200">
                ✓ Copied!
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white/70 group-hover:w-full transition-all duration-300" />
          </button>
        </div>

        {/* Right Section - Social Links & Copyright */}
        <div className="flex flex-col items-end gap-6 pt-1 ml-auto">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="px-5 py-2 border border-white/30 rounded-full text-[13px] text-white 
                         hover:bg-white hover:text-black hover:scale-110
                         transition-all duration-200 active:scale-95"
              >
                {social.name}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-white/40">
            © 2025 — Copyright
          </p>
        </div>
      </div>
    </footer>
  );
}
