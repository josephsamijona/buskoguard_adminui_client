// src/components/employee/CreateEmployeeModal.jsx
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserCircle, Briefcase, CreditCard, Camera, FileCheck } from 'lucide-react';
import UserInfoStep from './steps/UserInfoStep';
import EmployeeInfoStep from './steps/EmployeeInfoStep.jsx';
import NFCSetupStep from './steps/NFCSetupStep';
import FaceSetupStep from './steps/FaceSetupStep';
import ReviewStep from './steps/ReviewStep';
import { CREATION_STEPS, STEP_TITLES } from '@/config/employeeCreationSteps';

const CreateEmployeeModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(CREATION_STEPS.USER_INFO);
  const [employeeData, setEmployeeData] = useState({
    user: null,
    employee: null,
    nfcId: null,
    faceId: null
  });

  const stepComponents = {
    [CREATION_STEPS.USER_INFO]: UserInfoStep,
    [CREATION_STEPS.EMPLOYEE_INFO]: EmployeeInfoStep,
    [CREATION_STEPS.NFC_SETUP]: NFCSetupStep,
    [CREATION_STEPS.FACE_SETUP]: FaceSetupStep,
    [CREATION_STEPS.REVIEW]: ReviewStep
  };

  const stepIcons = {
    [CREATION_STEPS.USER_INFO]: UserCircle,
    [CREATION_STEPS.EMPLOYEE_INFO]: Briefcase,
    [CREATION_STEPS.NFC_SETUP]: CreditCard,
    [CREATION_STEPS.FACE_SETUP]: Camera,
    [CREATION_STEPS.REVIEW]: FileCheck
  };

  const updateEmployeeData = useCallback((stepData) => {
    setEmployeeData((prev) => ({
      ...prev,
      ...stepData
    }));
  }, []);

  const handleStepComplete = (nextStep) => {
    setCurrentStep(nextStep);
  };

  const CurrentStepComponent = stepComponents[currentStep];
  const currentStepInfo = STEP_TITLES[currentStep];
  const StepIcon = stepIcons[currentStep];

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="flex flex-col h-[600px]">
          {/* Header avec étapes */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center space-x-2">
              <StepIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentStepInfo.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentStepInfo.description}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mt-6 flex justify-between">
              {Object.values(CREATION_STEPS).map((step, index) => {
                const Icon = stepIcons[step];
                const isActive = step === currentStep;
                const isCompleted = Object.values(CREATION_STEPS)
                  .indexOf(currentStep) > Object.values(CREATION_STEPS)
                  .indexOf(step);

                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full
                        ${isActive ? 'bg-blue-600 text-white' :
                          isCompleted ? 'bg-green-600 text-white' :
                          'bg-gray-200 text-gray-500'}
                        transition-all duration-200
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < Object.values(CREATION_STEPS).length - 1 && (
                      <div
                        className={`
                          w-full h-1 mx-2
                          ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                          transition-all duration-200
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contenu de l'étape */}
          <div className="flex-1 overflow-y-auto p-6">
            <CurrentStepComponent
              data={employeeData}
              onUpdate={updateEmployeeData}
              onComplete={handleStepComplete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CreateEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateEmployeeModal;
