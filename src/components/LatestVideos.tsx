"use client";

import { Play } from "lucide-react";
import Image from "next/image";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.6 5.8 3.6 4.8 4.9 4.7 7.3 4.5 12 4.5 12 4.5s4.7 0 7.1.2c1.3.1 2.3 1.1 2.4 2.4.2 1.6.2 4.9.2 4.9s0 3.3-.2 4.9c-.1 1.3-1.1 2.3-2.4 2.4-2.4.2-7.1.2-7.1.2s-4.7 0-7.1-.2c-1.3-.1-2.3-1.1-2.4-2.4-.2-1.6-.2-4.9-.2-4.9s0-3.3.2-4.9z"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);

const videos = [
  {
    id: 1,
    title: "TEST DRIVE: MG GT 2024 - Le meilleur rapport qualité/prix ?",
    thumbnail: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop",
    platform: "youtube",
    views: "124K",
    duration: "14:20",
  },
  {
    id: 2,
    title: "MARCHÉ DE TIDJELABINE: Les vrais prix aujourd'hui !",
    thumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
    platform: "youtube",
    views: "89K",
    duration: "22:15",
  },
  {
    id: 3,
    title: "VW TIGUAN R-Line - Walkaround & Exhaust Sound",
    thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    platform: "instagram",
    views: "45K",
    duration: "01:00",
  },
];

export function LatestVideos() {
  return (
    <section id="vlogs" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              DERNIERS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0000] to-white">TESTS</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Nos revues automobiles détaillées, visites de showrooms et immersion dans les marchés auto en Algérie.
            </p>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 hover:border-[#ff0000] hover:text-[#ff0000] transition-colors">
              <YoutubeIcon className="w-5 h-5" />
              <span className="text-sm font-medium">YouTube</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 hover:border-[#e1306c] hover:text-[#e1306c] transition-colors">
              <InstagramIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Instagram</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="group cursor-pointer relative rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-[#ff0000]/50 transition-all duration-500 hover:box-glow-red">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-[#111]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                ></div>
                
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-[#ff0000] text-[#ff0000] box-glow-red">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white">
                  {video.duration}
                </div>
                
                <div className="absolute top-3 right-3 p-2 bg-black/80 backdrop-blur-sm rounded-full text-white">
                  {video.platform === 'youtube' ? (
                    <YoutubeIcon className="w-4 h-4 text-[#ff0000]" />
                  ) : (
                    <InstagramIcon className="w-4 h-4 text-[#e1306c]" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 uppercase tracking-wider">
                  <span>{video.views} vues</span>
                  <span className="w-1 h-1 rounded-full bg-[#ff0000]"></span>
                  <span>Il y a 2 jours</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#ff0000] transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
