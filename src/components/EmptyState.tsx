import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filter.'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-mute max-w-xs">{description}</p>
    </div>
  );
}
