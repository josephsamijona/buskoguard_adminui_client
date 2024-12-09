// src/components/employee/steps/EmployeeInfoStep.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Building2, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { API_BASE_URL, EMPLOYEE_CREATION_ENDPOINTS } from '@/config/constants';
import { CREATION_STEPS, EMPLOYEE_POSITIONS } from '@/config/employeeCreationSteps';

const EmployeeInfoStep = ({ data, onUpdate, onComplete }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      employee_id: '',
      department: '',
      position: '',
      gender: '',
      date_of_birth: null,
      date_joined: new Date(),
    }
  });

  // Observer les dates pour l'affichage
  const dateOfBirth = watch('date_of_birth');
  const dateJoined = watch('date_joined');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/department-management/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setDepartments(response.data);
    } catch {
      setError('Erreur lors du chargement des départements');
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');

      const requestData = {
        ...formData,
        user_id: data.user.user_id,
        date_of_birth: format(formData.date_of_birth, 'yyyy-MM-dd'),
        date_joined: format(formData.date_joined, 'yyyy-MM-dd'),
      };

      const response = await axios.post(
        `${API_BASE_URL}${EMPLOYEE_CREATION_ENDPOINTS.CREATE_BASIC_INFO}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      onUpdate({ employee: response.data });
      onComplete(CREATION_STEPS.NFC_SETUP);
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* ID Employé */}
        <div className="space-y-2">
          <Label htmlFor="employee_id">ID Employé</Label>
          <Input
            id="employee_id"
            {...register('employee_id', { 
              required: 'ID employé requis',
              pattern: {
                value: /^[A-Z0-9-]+$/,
                message: 'Format invalide (majuscules, chiffres et tirets uniquement)'
              }
            })}
            placeholder="EMP-001"
            error={errors.employee_id?.message}
          />
        </div>

        {/* Département */}
        <div className="space-y-2">
          <Label>Département</Label>
          <Select
            onValueChange={(value) => setValue('department', value)}
            defaultValue={watch('department')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    {dept.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label>Position</Label>
          <Select
            onValueChange={(value) => setValue('position', value)}
            defaultValue={watch('position')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une position" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_POSITIONS.map((position) => (
                <SelectItem key={position} value={position}>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {position}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label>Genre</Label>
          <Select
            onValueChange={(value) => setValue('gender', value)}
            defaultValue={watch('gender')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner le genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Homme</SelectItem>
              <SelectItem value="F">Femme</SelectItem>
              <SelectItem value="O">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date de naissance */}
        <div className="space-y-2">
          <Label>Date de naissance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, 'P', { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={(date) => setValue('date_of_birth', date)}
                disabled={(date) => date > new Date() || date < new Date('1940-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date d'embauche */}
        <div className="space-y-2">
          <Label>Date d&apos;embauche</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateJoined && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateJoined ? format(dateJoined, 'P', { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateJoined}
                onSelect={(date) => setValue('date_joined', date)}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => onComplete(CREATION_STEPS.USER_INFO)}
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? 'Enregistrement...' : 'Suivant'}
        </Button>
      </div>
    </form>
  );
};

EmployeeInfoStep.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default EmployeeInfoStep;
