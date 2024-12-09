// src/components/employee/steps/NFCSetupStep.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NFCReader from '@/services/nfc.service';
import { API_BASE_URL, EMPLOYEE_CREATION_ENDPOINTS } from '@/config/constants';
import { CREATION_STEPS } from '@/config/employeeCreationSteps';

const StepAnimation = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

StepAnimation.propTypes = {
  children: PropTypes.node.isRequired,
};

const NFCSetupStep = ({ data, onUpdate, onComplete }) => {
  const [status, setStatus] = useState('initial');
  const [error, setError] = useState('');
  const [nfcId, setNfcId] = useState(null);

  const connectReader = async () => {
    try {
      setStatus('connecting');
      await NFCReader.connect();
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setError(error.message);
    }
  };

  const handleWriteNFC = async () => {
    try {
      setStatus('writing');
      const newNfcId = NFCReader.generateNFCId();
      setNfcId(newNfcId);

      // Convertir l'ID en bytes
      const idBytes = new TextEncoder().encode(newNfcId);
      
      // Écrire sur la carte (secteur 5, premier bloc)
      await NFCReader.writeToCard(5, 20, idBytes);

      // Enregistrer dans la base de données
      await axios.post(
        `${API_BASE_URL}${EMPLOYEE_CREATION_ENDPOINTS.UPDATE_NFC(data.employee.id)}`,
        { nfc_id: newNfcId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setStatus('success');
      onUpdate({ nfcId: newNfcId });
    } catch (error) {
      setStatus('error');
      setError(error.message);
    }
  };

  const cardPulse = {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const statusConfig = {
    initial: {
      icon: CreditCard,
      title: "Configuration NFC",
      description: "Commencez par connecter le lecteur NFC",
      action: (
        <Button onClick={connectReader} size="lg" className="mt-4">
          Connecter le lecteur
        </Button>
      )
    },
    connecting: {
      icon: Loader2,
      title: "Connexion en cours",
      description: "Connexion au lecteur NFC...",
      iconClassName: "animate-spin text-blue-500"
    },
    ready: {
      icon: CreditCard,
      title: "Lecteur prêt",
      description: "Placez une carte sur le lecteur et cliquez sur démarrer",
      action: (
        <Button onClick={handleWriteNFC} size="lg" className="mt-4">
          Démarrer l&apos;écriture
        </Button>
      ),
      animate: cardPulse
    },
    writing: {
      icon: Loader2,
      title: "Écriture en cours",
      description: "Veuillez maintenir la carte sur le lecteur...",
      iconClassName: "animate-spin text-blue-500"
    },
    success: {
      icon: CheckCircle2,
      title: "Configuration réussie !",
      description: `ID NFC : ${nfcId}`,
      iconClassName: "text-green-500",
      action: (
        <Button 
          onClick={() => onComplete(CREATION_STEPS.FACE_SETUP)} 
          size="lg" 
          className="mt-4"
        >
          Continuer <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    error: {
      icon: XCircle,
      title: "Erreur",
      description: error,
      iconClassName: "text-red-500",
      action: (
        <Button onClick={connectReader} variant="outline" size="lg" className="mt-4">
          Réessayer
        </Button>
      )
    }
  };

  const currentStatus = statusConfig[status];
  const IconComponent = currentStatus.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <AnimatePresence mode="wait">
        <StepAnimation key={status}>
          <div className="text-center">
            <motion.div
              animate={currentStatus.animate}
              className="inline-block mb-6"
            >
              <IconComponent 
                className={`w-24 h-24 ${currentStatus.iconClassName || 'text-blue-500'}`}
              />
            </motion.div>

            <h3 className="text-2xl font-semibold mb-3">
              {currentStatus.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {currentStatus.description}
            </p>

            {status === 'error' && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {currentStatus.action}
          </div>
        </StepAnimation>
      </AnimatePresence>
    </div>
  );
};

NFCSetupStep.propTypes = {
  data: PropTypes.shape({
    employee: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default NFCSetupStep;
