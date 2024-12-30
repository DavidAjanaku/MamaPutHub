import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause, ChevronLeftCircle } from "lucide-react";

export default function RecipeDirection() {
  const { id } = useParams();
  const location = useLocation();
  const dish = location.state?.dish;
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (time) => {
    if (time > 0 && !isTimerRunning) {
      setRemainingTime(time);
      setIsTimerRunning(true);
      const newTimer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const remainingSeconds = prevTime - 1;
          if (remainingSeconds <= 0) {
            clearInterval(newTimer);
            setIsTimerRunning(false);
            moveToNextStep();
            return "";
          }
          return remainingSeconds;
        });
      }, 1000);
      setTimer(newTimer);
    }
  };

  const pauseTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      setIsTimerRunning(false);
    }
  };

  const moveToNextStep = () => {
    if (currentStep < dish.steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      navigate("/alldone");
    }
  };

  const moveToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">No recipe found.</p>
      </div>
    );
  }

  const progress = ((currentStep + 1) / dish.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeftCircle className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {dish.steps.length}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-4">
          {/* Recipe Title and Image */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How to cook {dish.food_name || dish.name}
            </h1>
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={dish.picture}
                alt={dish.name}
                className="rounded-full w-full h-full object-cover shadow-lg"
              />
            </div>
          </div>

          {/* Steps Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step {currentStep + 1}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {dish.steps[currentStep]}
            </p>

            {/* Timer Section */}
            {remainingTime && (
              <div className="mb-6 text-center">
                <div className="text-2xl font-mono mb-2">
                  {formatTime(remainingTime)}
                </div>
                <button
                  onClick={isTimerRunning ? pauseTimer : () => startTimer(remainingTime)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause Timer
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Start Timer
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                className="p-4 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                onClick={moveToPreviousStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="text-sm text-gray-500">
                {currentStep + 1} / {dish.steps.length}
              </div>

              <button
                className="p-4 text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                onClick={moveToNextStep}
                disabled={currentStep === dish.steps.length - 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}