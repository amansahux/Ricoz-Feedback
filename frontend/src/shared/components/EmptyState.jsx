import Button from './Button';

export default function EmptyState({ title, description, actionLabel, onAction, icon: Icon = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          <Icon size={32} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
