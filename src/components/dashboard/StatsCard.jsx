// src/components/dashboard/StatsCard.jsx
import Card from '@/components/ui/Card';

const StatsCard = ({ stat }) => {
  const { name, value, icon: Icon, color } = stat;
  
  return (
    <Card className="flex items-center">
      <div className={`${color} p-3 rounded-lg mr-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{name}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </Card>
  );
};

export default StatsCard;