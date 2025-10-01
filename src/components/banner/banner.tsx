import { Button } from "../ui/button";

type bannerProps = {
  sessionTime: string | null;
  setShowBanner: (newVal: boolean) => void;
};
export const Banner = ({ sessionTime, setShowBanner }: bannerProps) => {
  return (
    <div className="w-full bg-red-100 border border-red-400 text-red-800 text-center shadow-sm h-[100vh] flex justify-center items-center flex-col z-50 absolute gap-2">
      <p className="text-3xl font-medium">درحال حاضر این میز رزرو شده</p>
      <p className="text-2xl font-medium">مدت جلسه : {sessionTime}</p>
      <Button variant="outline" onClick={() => setShowBanner(false)}>
        تنظیم جلسه برای آینده
      </Button>
    </div>
  );
};
