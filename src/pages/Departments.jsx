// src/pages/Departments.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Plus,
  Building2,
  Edit2,
  Trash2,
  Users,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { DepartmentDialog } from '@/components/department/DepartmentDialog';
import departmentService from '@/services/department.service';
import { SORT_OPTIONS } from '@/config/departmentEndpoints';
import { cn } from '@/lib/utils';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('name');
  const [dialog, setDialog] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, department: null });

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartments({
        search,
        ordering
      });
      setDepartments(data);
    } catch {
      toast.error('Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  }, [search, ordering]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (data) => {
    try {
      await departmentService.createDepartment(data);
      toast.success('Département créé avec succès');
      fetchDepartments();
    } catch {
      toast.error('Erreur lors de la création du département');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await departmentService.updateDepartment(dialog.data.id, data);
      toast.success('Département mis à jour avec succès');
      fetchDepartments();
    } catch {
      toast.error('Erreur lors de la mise à jour du département');
    }
  };

  const handleDelete = async () => {
    try {
      await departmentService.deleteDepartment(deleteDialog.department.id);
      toast.success('Département supprimé avec succès');
      setDeleteDialog({ open: false, department: null });
      fetchDepartments();
    } catch {
      toast.error('Erreur lors de la suppression du département');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Départements</h1>
          <p className="text-gray-500">Gérez les départements de votre entreprise</p>
        </div>
        <Button onClick={() => setDialog({ open: true, mode: 'create', data: null })}
          className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Département
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un département..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={ordering} onValueChange={setOrdering}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des départements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : departments.map((department) => (
          <Card key={department.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  {department.name}
                </h3>
                <p className="text-gray-500 text-sm">{department.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDialog({
                    open: true,
                    mode: 'edit',
                    data: department
                  })}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteDialog({
                    open: true,
                    department
                  })}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {department.employee_count} employés
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  department.attendance_rate >= 75 ? "bg-green-500" :
                  department.attendance_rate >= 50 ? "bg-yellow-500" : "bg-red-500"
                )} />
                <span className="text-sm text-gray-600">
                  {department.attendance_rate}% présents
                </span>
              </div>
            </div>
          </Card>
        ))}

        {!loading && departments.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun département trouvé
          </div>
        )}
      </div>

      {/* Modales */}
      <DepartmentDialog
        isOpen={dialog.open}
        onClose={() => setDialog({ open: false, mode: 'create', data: null })}
        onSubmit={dialog.mode === 'create' ? handleCreate : handleUpdate}
        initialData={dialog.data}
        mode={dialog.mode}
      />

      <AlertDialog open={deleteDialog.open}
        onOpenChange={() => setDeleteDialog({ open: false, department: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Departments;
