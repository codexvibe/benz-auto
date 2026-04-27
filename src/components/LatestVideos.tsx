"use client";

import Image from "next/image";
import { Play } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const videos = [
  {
    id: 1,
    title: "MERCEDES G63 AMG - Le monstre est là 🦍",
    thumbnail: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop",
    platform: "instagram",
    views: "124K",
    duration: "00:45",
  },
  {
    id: 2,
    title: "PORSCHE 911 GT3 RS - Prête pour la piste 🏁",
    thumbnail: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop",
    platform: "instagram",
    views: "89K",
    duration: "00:59",
  },
  {
    id: 3,
    title: "AUDI RS Q8 - L'élégance brutale 💣",
    thumbnail: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop",
    platform: "instagram",
    views: "45K",
    duration: "00:30",
  },
];

export function LatestVideos() {
  return (
    <section id="vlogs" className="py-32 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 animate-slide-up">
          <div>
            <span className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
              Instagram
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter">
              DERNIERS <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">REELS</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-500 text-white font-bold text-xs uppercase tracking-widest group"
            >
              <InstagramIcon className="w-4 h-4 group-hover:text-[#e1306c] transition-colors duration-500" />
              <span>Suivez-nous</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group cursor-pointer relative rounded-3xl overflow-hidden bg-surface transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] animate-slide-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="relative aspect-4/5 md:aspect-3/4 overflow-hidden">
                {/* Optimised thumbnail */}
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-50 group-hover:scale-100">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 text-white transition-all duration-700">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-6 w-full px-6 flex justify-between items-center z-10">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold tracking-widest text-white uppercase border border-white/10">
                    {video.duration}
                  </div>
                  <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-4 uppercase tracking-[0.2em] font-bold">
                    <span>{video.views} vues</span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span>Il y a 2 jours</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-glow-chrome transition-all duration-500 leading-tight">
                    {video.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
