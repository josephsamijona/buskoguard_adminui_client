import  'react';
import PropTypes from 'prop-types';
import LoginForm from '../components/auth/LoginForm';
import { CheckCircle2 } from 'lucide-react';
import BuskoLogo from '../assets/icons/logo.png'; // Assurez-vous que le logo est dans ce chemin

// Helper component for feature items
const FeatureItem = ({ children }) => (
  <div className="flex items-center space-x-3">
    <CheckCircle2 className="w-5 h-5 text-blue-200 flex-shrink-0" />
    <span className="text-blue-50">{children}</span>
  </div>
);

// Ajout de la validation des props
FeatureItem.propTypes = {
  children: PropTypes.node.isRequired,
};

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>

      {/* Right side - Features/Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="w-full flex items-center justify-center p-12">
          <div className="max-w-lg">
            <div className="text-white">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src={BuskoLogo} 
                  alt="BuskoGuard Logo" 
                  className="h-16 object-contain"
                />
              </div>

              <h2 className="text-3xl font-bold mb-8">
                Système de Gestion des Présences
              </h2>

              {/* Features list */}
              <div className="space-y-6">
                <FeatureItem>
                  Suivi en temps réel des présences et absences
                </FeatureItem>
                <FeatureItem>
                  Gestion simplifiée des congés et demandes
                </FeatureItem>
                <FeatureItem>
                  Tableaux de bord et rapports détaillés
                </FeatureItem>
                <FeatureItem>
                  Interface moderne et facile à utiliser
                </FeatureItem>
                <FeatureItem>
                  Support NFC et reconnaissance faciale
                </FeatureItem>
                <FeatureItem>
                  Gestion des départements et équipes
                </FeatureItem>
              </div>

              {/* Bottom info */}
              <div className="mt-12 border-t border-blue-400 pt-8">
                <p className="text-blue-100 text-sm text-center">
                  © {new Date().getFullYear()} BuskoGuard. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;