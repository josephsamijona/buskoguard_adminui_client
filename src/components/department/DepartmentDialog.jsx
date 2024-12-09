//src/components/department/DepartmentDialog.jsx
import  'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const DepartmentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      description: ''
    }
  });

  const onSubmitForm = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nouveau Département' : 'Modifier le Département'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du département</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Le nom est requis",
                minLength: {
                  value: 2,
                  message: "Le nom doit contenir au moins 2 caractères"
                }
              })}
              placeholder="Ex: Ressources Humaines"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description du département..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="submit" variant="default">
              {mode === 'create' ? 'Créer' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};