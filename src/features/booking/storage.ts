import type { Booking } from "./types";

const LS_KEY = "booking:bookings";

export function readBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Booking[];
  } catch {
    return [];
  }
}

export function writeBookings(bookings: Booking[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(bookings));
}

export function makeId(prefix = "B") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
