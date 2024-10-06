"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const steps = [
    {
      title: "Bienvenido a Nuestra Aplicación Web",
      description: "Realizaremos un breve recorrido por las principales características de la aplicación.",
    },
    {
      title: "Primer Vistazo",
      description: "Al acceder a la página, encontrarás opciones para iniciar sesión y proceder con la configuración de tu cuenta.",
    },
    {
      title: "Configuración Inicial",
      description: "En el proceso de configuración, podrás ingresar tu ubicación de varias maneras: mediante latitud y longitud, utilizando tu ubicación actual o seleccionando un punto en el mapa. También podrás elegir cuántos días antes deseas recibir notificaciones sobre el paso de los satélites en tu área.",
    },
    {
      title: "Configuración Completa",
      description: "Una vez que completes la configuración, asegúrate de enviar los datos y seleccionar el satélite del cual deseas recibir notificaciones por correo electrónico.",
    },
    {
      title: "Disfruta de la Experiencia",
      description: "Recibirás un enlace en tu correo electrónico que te llevará al panel de control, donde encontrarás toda la información necesaria para aprovechar al máximo la aplicación.",
    },
  ];
  

export default function AppGuide() {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const guideShown = localStorage.getItem('guideShown')
    if (!guideShown) {
      setOpen(true)
      localStorage.setItem('guideShown', 'true') // Marcar el guía como mostrado
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setOpen(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-[#F7B5CD] text-2xl">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentStep ? 'bg-[#F7B5CD]' : 'bg-gray-600'
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
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
