import cn from 'classnames';
import { forwardRef, Ref } from 'react';

type Props = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function InputField(
  { id, label, type = 'text', className, error, ...rest }: Props,
  ref: Ref<HTMLInputElement>
) {
  const styles = cn(baseStyles, {
    [defaultStyles]: !error,
    [errorStyles]: !!error,
  });

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input id={id} type={type} ref={ref} className={styles} {...rest} />
      {error && (
        <p className="mt-1 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
}

const baseStyles = cn(['block w-full', 'sm:text-sm', 'shadow-sm rounded-md']);

const defaultStyles = cn([
  'border-gray-300',
  'focus:ring-indigo-500 focus:border-indigo-500',
]);

const errorStyles = cn([
  'border-red-300 text-red-900 placeholder-red-300',
  'focus:outline-none focus:ring-red-500 focus:border-red-500',
]);

export const Input = forwardRef(InputField);
