import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../../lib/validation';
import { z } from 'zod';

export type UserFormData = z.infer<typeof userSchema>;

interface NewUserFormProps {
  onSubmit: (data: UserFormData) => void;
  isSubmitting: boolean;
}

export function NewUserForm({ onSubmit, isSubmitting }: NewUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[var(--color-white)] p-8 rounded-xl shadow-sm w-full max-w-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-[var(--color-gray-800)]">Add New User</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
            First Name
          </label>
          <input
            {...register('firstName')}
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          {errors.firstName && (
            <p className="text-[var(--color-red-600)] text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
            Last Name (Optional)
          </label>
          <input
            {...register('lastName')}
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          {errors.lastName && (
            <p className="text-[var(--color-red-600)] text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
            Email
          </label>
          <input
            {...register('email')}
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          {errors.email && (
            <p className="text-[var(--color-red-600)] text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          {errors.dateOfBirth && (
            <p className="text-[var(--color-red-600)] text-sm mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="active">active</option>
            <option value="locked">locked</option>
          </select>
          {errors.status && (
            <p className="text-[var(--color-red-600)] text-sm mt-1">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-white)] rounded-lg transition font-medium"
      >
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}