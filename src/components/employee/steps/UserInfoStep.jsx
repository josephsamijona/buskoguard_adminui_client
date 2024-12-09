// src/components/employee/steps/UserInfoStep.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { API_BASE_URL, EMPLOYEE_CREATION_ENDPOINTS } from '@/config/constants';
import { CREATION_STEPS } from '@/config/employeeCreationSteps';
import { AlertCircle } from 'lucide-react';

const UserInfoStep = ({ onUpdate, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      isAdmin: false
    }
  });

  const validatePasswordMatch = (value) => {
    const password = watch('password');
    return password === value || 'Les mots de passe ne correspondent pas';
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${API_BASE_URL}${EMPLOYEE_CREATION_ENDPOINTS.CREATE_USER}`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
          first_name: data.firstName,
          last_name: data.lastName,
          is_admin: data.isAdmin,
          is_employee: true
        }
      );

      onUpdate({ user: response.data });
      onComplete(CREATION_STEPS.EMPLOYEE_INFO);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            {...register('firstName', { required: 'Ce champ est requis' })}
            error={errors.firstName?.message}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: 'Ce champ est requis' })}
            error={errors.lastName?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Nom d&apos;utilisateur</Label>
        <Input
          id="username"
          {...register('username', {
            required: 'Ce champ est requis',
            pattern: {
              value: /^[a-zA-Z0-9._-]+$/,
              message: 'Format de nom d\'utilisateur invalide'
            }
          })}
          error={errors.username?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'Ce champ est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          })}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: 'Ce champ est requis',
              minLength: {
                value: 8,
                message: '8 caractères minimum'
              }
            })}
            error={errors.password?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Ce champ est requis',
              validate: validatePasswordMatch
            })}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAdmin"
          {...register('isAdmin')}
        />
        <Label htmlFor="isAdmin">Compte administrateur</Label>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? 'Création...' : 'Suivant'}
        </Button>
      </div>
    </form>
  );
};

UserInfoStep.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default UserInfoStep;
