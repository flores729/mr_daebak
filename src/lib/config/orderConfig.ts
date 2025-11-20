// src/lib/config/orderConfig.ts

export const ORDER_CONFIG = {
  bread: {
    maxCount: 20,
  },
  wine: {
    maxCount: 20,
  },
  delivery: {
    // 18:00 ~ 23:00, 1시간 단위
    timeSlots: ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  },
};
