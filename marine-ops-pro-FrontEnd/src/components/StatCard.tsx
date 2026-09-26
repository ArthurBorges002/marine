import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'success' | 'warning' | 'destructive';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'default',
  onClick
}) => {
  const colorClasses = {
    default: 'border-border bg-card hover:bg-accent/10',
    success: 'border-success/20 bg-success/5 hover:bg-success/10',
    warning: 'border-warning/20 bg-warning/5 hover:bg-warning/10',
    destructive: 'border-destructive/20 bg-destructive/5 hover:bg-destructive/10'
  };

  const iconColorClasses = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  };

  return (
    <Card 
      className={`
        transition-all duration-200 cursor-pointer shadow-card hover:shadow-ocean 
        ${colorClasses[color]} ${onClick ? 'hover:scale-105' : ''}
      `}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </div>
        
        {(description || trend) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {description && <span>{description}</span>}
            {trend && (
              <span className={`flex items-center ${
                trend.isPositive ? 'text-success' : 'text-destructive'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;