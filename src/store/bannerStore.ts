import { create } from "zustand";

type BannerStore = {
  timeoutId: NodeJS.Timeout | null;
  currentSession: string | null;
  showBannerCountDown: number;
  showBanner: boolean;
  setShowBanner: (newVal: boolean) => void;
  setCurrentSession: (timeRange: string | null) => void;
  setShowBannerCountDown: (ms: number) => void;
  resetBannerCountDown: (ms: number) => void;
};

export const useBannerStore = create<BannerStore>((set, get) => ({
  timeoutId: null,
  currentSession: null,
  showBannerCountDown: 5000,
  showBanner: true,
  setShowBanner: (newVal) => set({ showBanner: newVal }),
  setCurrentSession: (timeRange) => set({ currentSession: timeRange }),
  //   setShowBannerCountDown: (ms) => {
  //     const { setShowBanner } = get();
  //     const timeOut = setTimeout(() => setShowBanner(true), ms);

  //     return () => clearTimeout(timeOut);
  //   },
  setShowBannerCountDown: (ms) => {
    const { timeoutId } = get();
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeout = setTimeout(() => {
      set({ showBanner: true });
    }, ms);

    set({ timeoutId: newTimeout });
  },

  resetBannerCountDown: (ms) => {
    const { setShowBannerCountDown } = get();
    set({ showBanner: false });
    setShowBannerCountDown(ms);
  },
}));
