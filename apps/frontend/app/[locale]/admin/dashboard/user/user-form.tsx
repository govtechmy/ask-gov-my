"use client";

import {
  Input,
  FormLabel,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormSubmit,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectIcon,
  ChevronDownIcon,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
} from "@askgovmy/ui";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps, PropsWithChildren, useState } from "react";
import Translator from "@/components/client/translator";
import { Agency } from "@/types/types";
import { UserFormSchema, UserFormValues } from "@/actions/admin/user.schema";

interface UserFormProps extends PropsWithChildren {
  className?: string;
  onSubmit: (formValues: UserFormValues) => void | Promise<void>;
  defaultValues?: UserFormValues;
}

/**
 * @example
 * ```tsx
 * <UserForm onSubmit={fn}>
 *   <h2>Create a user</h2>
 *   <UserFormFields />
 *   <UserFormSubmit>Save</UserFormSubmit>
 * </UserForm>
 * ```
 */
export function UserForm({
  children,
  className,
  onSubmit,
  defaultValues,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      role: "staff",
      agency: null,
    },
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  );
}

export function useUserForm() {
  const form = useFormContext<UserFormValues>();
  if (!form) {
    throw Error("Must use `useUserForm` within a `<UserForm />` component");
  }
  return form;
}

type UserFormFieldsProps = {
  agencies: Pick<Agency, "id" | "name" | "acronym">[];
};
export function UserFormFields({ agencies }: UserFormFieldsProps) {
  const form = useUserForm();
  const [openAgencyPopover, setOpenAgencyPopover] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<
    UserFormFieldsProps["agencies"][number] | null
  >(agencies.find(({ id }) => id === form.getValues("agency")) || null);

  return (
    <div className="grid gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>
              <Translator namespace="UserForm.name" />
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>
              <Translator namespace="UserForm.email" />
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>
              <Translator namespace="UserForm.role" />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="flex items-center justify-between h-10 w-full bg-white shadow-button rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground // focus:border focus:border-askmygovbrand-300  focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 // focus:ring-0">
                  <SelectValue />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.watch("role") === "staff" && (
        <FormField
          control={form.control}
          name="agency"
          render={() => (
            <FormItem className="w-full">
              <FormLabel>
                <Translator namespace="UserForm.agency" />
              </FormLabel>
              <PopoverRoot
                modal
                open={openAgencyPopover}
                onOpenChange={setOpenAgencyPopover}
              >
                <FormControl>
                  <PopoverTrigger className="flex items-center justify-between h-10 w-full bg-white shadow-button rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground // focus:border focus:border-askmygovbrand-300  focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 // focus:ring-0">
                    {selectedAgency ? (
                      <div className="flex gap-2 text-start">
                        <span className="font-medium">
                          {selectedAgency.acronym}
                        </span>
                        <span className="flex-1 w-full line-clamp-1 text-dim-500">
                          {selectedAgency.name}
                        </span>
                      </div>
                    ) : (
                      <Translator
                        namespace="UserForm.agency_unassigned"
                        tag="span"
                      />
                    )}
                    <SelectIcon>
                      <ChevronDownIcon />
                    </SelectIcon>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]"
                  align="start"
                  side="bottom"
                >
                  <Command
                    filter={(value, _search) => {
                      const search = _search.toLowerCase();
                      const item = agencies.find(
                        (agency) => agency.id.toString() === value
                      );
                      return item?.name.toLowerCase().includes(search) ||
                        item?.acronym.toLowerCase().includes(search)
                        ? 1
                        : 0;
                    }}
                  >
                    <CommandInput placeholder="Search" />
                    <CommandList>
                      <CommandEmpty>
                        <Translator namespace="AdminAgencies.not_found" />
                      </CommandEmpty>
                      <CommandGroup>
                        {agencies.map((agency) => (
                          <CommandItem
                            key={agency.id}
                            value={agency.id.toString()}
                            onSelect={(agencyId) => {
                              form.setValue(
                                "agency",
                                Number.parseInt(agencyId)
                              );
                              setSelectedAgency(agency);
                              setOpenAgencyPopover(false);
                            }}
                            className="gap-2"
                          >
                            <span className="font-medium">
                              {agency.acronym}
                            </span>
                            <span className="flex-1 w-full line-clamp-1 text-dim-500">
                              {agency.name}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </PopoverRoot>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

export function UserFormSubmit(
  props: Omit<ComponentProps<typeof FormSubmit>, "form">
) {
  const form = useUserForm();
  return <FormSubmit form={form} {...props} />;
}
