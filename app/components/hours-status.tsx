'use client';

import { useEffect, useState } from 'react';

export default function HoursStatus() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const clock = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Belgrade', hour: '2-digit', hourCycle: 'h23',
    });
    function update() {
      const hour = Number(clock.format(new Date()));
      setOpen(hour >= 8 && hour < 23);
    }
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  const label = open === null
    ? 'Radno vreme 08–23 h'
    : open ? 'Otvoreno, do 23 h' : 'Zatvoreno · otvara u 08 h';
  return <p className={`hours-status${open ? ' is-open' : ''}`}>{label}</p>;
}
