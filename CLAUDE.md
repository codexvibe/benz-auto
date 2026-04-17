# CLAUDE.md - Project Guide

## Project Context
This is a premium e-commerce platform for "HM.ZONEDZ", a vape store. 
Built with Next.js (Note: potentially a version with breaking changes as per AGENTS.md), TypeScript, Tailwind CSS, Supabase, and Framer Motion.

## Commands

### Development & Build
- **Dev Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Start Production**: `npm run start`

### Linting & Formatting
- **Lint**: `npm run lint`

## Tech Stack & Guidelines
- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS (v4). Use premium aesthetics: dark mode, gradients, and micro-animations.
- **Icons**: Use `lucide-react`.
- **Backend**: Supabase (integration in `lib/supabase`).
- **Animations**: Framer Motion.

## Project Structure
- `src/app`: Routes, pages, and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Configuration and external service clients (Supabase, etc.).
- `src/context`: React Context providers for global state.
- `src/utils`: Helper functions and formatting.
- `src/data`: Static data or constants.

## Critical Rules
> [!IMPORTANT]
> Refer to [AGENTS.md](file:///d:/gomycode/vape%20store%20website/AGENTS.md) for breaking changes in this Next.js version. Read `node_modules/next/dist/docs/` before making architectural changes.
