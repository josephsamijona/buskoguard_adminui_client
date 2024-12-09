// src/components/employee/steps/FaceSetupStep.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import FaceRecognitionService from '@/services/face.service';
import { API_BASE_URL, EMPLOYEE_CREATION_ENDPOINTS } from '@/config/constants';
import { CREATION_STEPS } from '@/config/employeeCreationSteps';

const FaceSetupStep = ({ data, onUpdate, onComplete }) => {
  const [wantsFaceRecognition, setWantsFaceRecognition] = useState(false);
  const [status, setStatus] = useState('initial'); // initial, preparing, scanning, processing, success, error
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionInterval = useRef(null);

  useEffect(() => {
    return () => {
      FaceRecognitionService.stopVideo();
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  const startFaceRecognition = async () => {
    try {
      setStatus('preparing');
      await FaceRecognitionService.initialize();
      const stream = await FaceRecognitionService.startVideo();
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(resolve => {
          videoRef.current.onloadedmetadata = resolve;
        });
        videoRef.current.play();
      }

      setStatus('scanning');
      startDetection();
    } catch {
      setStatus('error');
      setError("Erreur lors de l'initialisation de la caméra");
    }
  };

  const startDetection = () => {
    let detectionCount = 0;
    let accumulatedDescriptor = null;

    detectionInterval.current = setInterval(async () => {
      if (videoRef.current && status === 'scanning') {
        const detection = await FaceRecognitionService.detectFace(videoRef.current);
        
        if (detection) {
          if (!accumulatedDescriptor) {
            accumulatedDescriptor = detection.descriptor;
          } else {
            // Accumuler les descripteurs pour plus de précision
            accumulatedDescriptor = accumulatedDescriptor.map((val, i) => 
              (val + detection.descriptor[i]) / 2
            );
          }
          
          detectionCount++;

          // Dessiner le cadre de détection
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              detection.detection.box.x,
              detection.detection.box.y,
              detection.detection.box.width,
              detection.detection.box.height
            );
          }

          // Après 10 détections réussies, générer l'ID
          if (detectionCount >= 10) {
            clearInterval(detectionInterval.current);
            processDetection(accumulatedDescriptor);
          }
        }
      }
    }, 100);
  };

  const processDetection = async (descriptor) => {
    try {
      setStatus('processing');
      const faceId = FaceRecognitionService.generateFaceId(descriptor);

      await axios.post(
        `${API_BASE_URL}${EMPLOYEE_CREATION_ENDPOINTS.UPDATE_FACE(data.employee.id)}`,
        { face_id: faceId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      FaceRecognitionService.stopVideo();
      setStatus('success');
      onUpdate({ faceId });
    } catch {
      setStatus('error');
      setError("Erreur lors de l'enregistrement");
    }
  };

  const skipFaceRecognition = () => {
    onComplete(CREATION_STEPS.REVIEW);
  };

  // Animations pour le cadre de scan
  const scanFrameVariants = {
    scanning: {
      opacity: [0.5, 1],
      scale: [0.98, 1.02],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      <AnimatePresence mode="wait">
        {status === 'initial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <Camera className="w-16 h-16 text-blue-500 mx-auto" />
            <h3 className="text-xl font-semibold">Configuration de la reconnaissance faciale</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              La reconnaissance faciale permet à l&apos;employé de pointer sa présence via la caméra.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Checkbox
                id="wantsFace"
                checked={wantsFaceRecognition}
                onCheckedChange={setWantsFaceRecognition}
              />
              <label htmlFor="wantsFace" className="text-sm">
                Activer la reconnaissance faciale pour cet employé
              </label>
            </div>
            <div className="pt-4">
              <Button
                onClick={wantsFaceRecognition ? startFaceRecognition : skipFaceRecognition}
                size="lg"
              >
                {wantsFaceRecognition ? 'Commencer la configuration' : 'Passer cette étape'}
              </Button>
            </div>
          </motion.div>
        )}

        {(status === 'preparing' || status === 'scanning' || status === 'processing') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card className="relative overflow-hidden">
              <video
                ref={videoRef}
                className="w-[640px] h-[480px] bg-black"
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                width={640}
                height={480}
              />
              {status === 'scanning' && (
                <motion.div
                  className="absolute inset-0 border-4 border-blue-500 rounded-lg"
                  variants={scanFrameVariants}
                  animate="scanning"
                />
              )}
            </Card>
            <p className="mt-4 text-gray-600">
              {status === 'preparing' && "Initialisation de la caméra..."}
              {status === 'scanning' && "Veuillez regarder la caméra..."}
              {status === 'processing' && "Traitement en cours..."}
            </p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Configuration réussie !</h3>
            <p className="text-gray-600 mb-6">
              La reconnaissance faciale a été configurée avec succès.
            </p>
            <Button onClick={() => onComplete(CREATION_STEPS.REVIEW)}>
              Continuer <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={startFaceRecognition} variant="outline">
              Réessayer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FaceSetupStep.propTypes = {
  data: PropTypes.shape({
    employee: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default FaceSetupStep;
