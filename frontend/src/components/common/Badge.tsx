import { cn } from '@/utils/cn';

type BadgeVariant = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  gray:   'bg-gray-100 text-gray-700',
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
};

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={cn('badge', variantClass[variant], className)}>
      {children}
    </span>
  );
}
