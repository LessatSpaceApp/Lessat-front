"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const steps = [
  {
    title: "Welcome to Our Web Application",
    description:
      "We will take a brief tour through the main features of the application.",
  },
  {
    title: "First Look",
    description:
      "Upon accessing the page, you will find options to log in and proceed with your account setup.",
  },
  {
    title: "Initial Setup",
    description:
      "During the setup process, you can enter your location in several ways: by latitude and longitude, using your current location, or selecting a point on the map. You can also choose how many days in advance you want to receive notifications about satellite passes in your area.",
  },
  {
    title: "Setup Complete",
    description:
      "Once you complete the setup, make sure to submit the data and select the satellite for which you want to receive email notifications.",
  },
  {
    title: "Enjoy the Experience",
    description:
      "You will receive a link in your email that will take you to the dashboard, where you'll find all the necessary information to make the most of the application.",
  },
];

export default function AppGuide() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const guideShown = localStorage.getItem("guideShown");
    if (!guideShown) {
      setOpen(true);
      localStorage.setItem("guideShown", "true"); // Marcar el guía como mostrado
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#F7B5CD]">
            {steps[currentStep]!.title}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {steps[currentStep]!.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${
                index === currentStep ? "bg-[#F7B5CD]" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-[#F7B5CD] text-black hover:bg-[#F595B7]"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="bg-[#F7B5CD] text-black hover:bg-[#F595B7]"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
