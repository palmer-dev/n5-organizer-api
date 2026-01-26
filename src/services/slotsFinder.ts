import { AppointmentDocument } from "@/types/AppointmentDocument";

type Appointment = {
  start: Date;
  end: Date;
};

export type Slot = {
  start: Date;
  end: Date;
};

function roundToQuarterHour(date: Date, roundUp = false): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  const rounded = new Date(date);
  if (roundUp) {
    rounded.setMinutes(minutes + (15 - remainder));
  } else {
    rounded.setMinutes(minutes - remainder);
  }
  rounded.setSeconds(0);
  rounded.setMilliseconds(0);
  return rounded;
}

export class SlotsFinder {
  private readonly stepMs: number = 15 * 60 * 1000; // 15 min

  private readonly durationMs: number;

  private appointments: Appointment[] = [];

  private dayStart: Date;

  private dayEnd: Date;

  constructor(durationHours: number, dayStart: Date, dayEnd: Date) {
    this.durationMs = durationHours * 60 * 60 * 1000; // convertir en ms
    this.dayStart = dayStart;
    this.dayEnd = dayEnd;
  }

  // Ajouter les rendez-vous existants
  setAppointments(appointments: AppointmentDocument[]) {
    this.appointments = appointments.map((a) => ({
      start: roundToQuarterHour(new Date(a.startDate), false), // arrondi vers le bas
      end: roundToQuarterHour(new Date(a.endDate), true), // arrondi vers le haut
    }));
  }

  // Retourne les créneaux disponibles
  getAvailableSlots(): Slot[] {
    const sorted = this.appointments.sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    const slots: Slot[] = [];
    let cursor = this.dayStart.getTime();

    while (cursor + this.durationMs <= this.dayEnd.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor + this.durationMs);

      // vérifier si ce créneau chevauche un rendez-vous
      const overlaps = sorted.some(
        (appt) => slotStart < appt.end && slotEnd > appt.start
      );

      if (!overlaps) {
        slots.push({ start: slotStart, end: slotEnd });
      }

      cursor += this.stepMs; // avancer de 15 min
    }

    return slots;
  }

  static groupSlots(slots: Slot[]): Slot[] {
    if (!slots.length) return [];

    const grouped: Slot[] = [];
    let currentPeriod = { ...slots[0] };

    slots.forEach((slot, index) => {
      if (index === 0) return;

      // si le slot commence exactement à la fin du précédent
      if (
        currentPeriod.start.getTime() < slot.start.getTime() &&
        slot.start.getTime() < currentPeriod.end.getTime()
      ) {
        // étendre la période
        currentPeriod.end = slot.end;
      } else {
        // terminer la période actuelle
        grouped.push({ ...currentPeriod });
        // démarrer une nouvelle période
        currentPeriod = { ...slot };
      }
    });

    // ajouter la dernière période
    grouped.push({ ...currentPeriod });

    return grouped;
  }
}
