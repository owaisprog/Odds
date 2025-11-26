"use client";
import { FiInstagram, FiTwitter } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#111827] text-white">
      {/* Brand accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#24257C] via-[#C83495] to-[#24257C]" />

      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="md:flex justify-between px-5">
          {/* Brand Section */}
          <div className="lg:col-span-5 flex flex-col gap-6 ">
            <div className="flex items-center gap-3">
              <Image
                src="/WebLogo.png"
                alt="DGenSports"
                width={160}
                height={80}
                priority
                className="block h-auto w-auto -mt-15"
              />
            </div>
            <p className="text-white/70 leading-relaxed text-base max-w-md">
              Real data. Real analysis. Updated daily. DGenSports delivers
              concise breakdowns and odds you can scan fast—no fluff, just
              signal.
            </p>
            <div className="flex gap-4 mt-2">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DGenSports on Twitter"
                className="inline-flex items-center justify-center rounded-full w-11 h-11 border border-white/20 text-white/80 hover:text-white hover:bg-[#C83495] hover:border-[#C83495] hover:scale-110 transition-all duration-200"
              >
                <FiTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DGenSports on Instagram"
                className="inline-flex items-center justify-center rounded-full w-11 h-11 border border-white/20 text-white/80 hover:text-white hover:bg-[#C83495] hover:border-[#C83495] hover:scale-110 transition-all duration-200"
              >
                <FiInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Major Leagues */}
          <div className="lg:col-span-2 flex flex-col gap-6 mt-5 md:mt-0">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Major Leagues
            </h3>
            <ul className="space-y-4">
              {[
                { label: "NFL", href: "/league/nfl" },
                { label: "NBA", href: "/league/nba" },
                { label: "MLB", href: "/league/mlb" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 hover:text-[#C83495] hover:translate-x-1 transition-all duration-200 inline-block font-medium"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* College & Combat Sports */}
          <div className="lg:col-span-3 flex flex-col gap-6 mt-5 md:mt-0">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              More Sports
            </h3>
            <ul className="space-y-4">
              {[
                { label: "NCAAF", href: "/league/ncaaf" },
                { label: "NCAAB", href: "/league/ncaab" },
                { label: "UFC", href: "/league/ufc" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 hover:text-[#C83495] hover:translate-x-1 transition-all duration-200 inline-block font-medium"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} DGenSports. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/terms"
                className="text-white/60 hover:text-[#C83495] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-white/60 hover:text-[#C83495] transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
