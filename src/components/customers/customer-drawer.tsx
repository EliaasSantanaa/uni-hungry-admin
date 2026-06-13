"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/admin/status-badge";
import { User, UserRole } from "@/types";
import { CustomerFormData } from "@/types/forms";

interface CustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerFormData) => Promise<boolean>;
  customer?: User | null;
  isLoading?: boolean;
  statusEditDisabled?: boolean;
}

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MANAGER]: "Gerente de Restaurante",
  [UserRole.USER]: "Usuário",
  [UserRole.WAITER]: "Garçom",
};

export function CustomerDrawer({
  open,
  onClose,
  onSave,
  customer,
  isLoading = false,
  statusEditDisabled = false,
}: CustomerDrawerProps) {
  const isEdit = !!customer;
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      role: UserRole.MANAGER,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (customer) {
      reset({
        email: customer.email,
        name: customer.name || "",
        phone: customer.phone || "",
        role: customer.role,
        isActive: customer.isActive,
      });
    } else {
      reset({
        email: "",
        name: "",
        phone: "",
        role: UserRole.MANAGER,
        isActive: true,
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    const success = await onSave(data);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar Cliente" : "Novo Cliente"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize as informações e o acesso do cliente"
              : "Preencha os dados para criar um novo cliente. Uma senha será gerada automaticamente e enviada por email."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@exemplo.com"
              disabled={isEdit || isLoading}
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nome do cliente"
              disabled={isLoading}
              {...register("name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              disabled={isLoading}
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              {...register("role")}
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {!isEdit && "Uma senha será gerada automaticamente"}{" "}
              {!isEdit && "(ADMIN não precisa de restaurante)"}
            </p>
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="isActive">Acesso ao sistema</Label>
              <div className="flex items-center gap-3">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="isActive"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading || statusEditDisabled}
                      value={field.value ? "true" : "false"}
                      onChange={(event) =>
                        field.onChange(event.target.value === "true")
                      }
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  )}
                />
                <StatusBadge status={isActive ? "active" : "inactive"} />
              </div>
              {statusEditDisabled ? (
                <p className="text-xs text-muted-foreground">
                  Você não pode alterar o status do seu próprio usuário.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Usuários inativos não conseguem acessar o sistema.
                </p>
              )}
            </div>
          )}

          <SheetFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : isEdit
                  ? "Atualizar"
                  : "Criar Cliente"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
