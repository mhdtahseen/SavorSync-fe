//@ts-nocheck
import { Spinner } from "@material-tailwind/react";

export const MTSpinner = () => {
  return (
    <div className="flex justify-center items-center gap-8">
      <Spinner className="h-8 w-8" />
    </div>
  );
};
