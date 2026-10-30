'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function OrderConfirmationClient({ order }: { order: any }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#ffffff', '#AA7C11'],
      });
    } catch (e) {
      console.error('Confetti effect failed', e);
    }
  }, []);

  return null;
}
