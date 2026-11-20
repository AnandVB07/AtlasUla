import * as Icons from 'lucide-react';
import { Award,CheckCircle } from 'lucide-react';
import React from 'react';
import { UserAchievement } from '../types';
import { Card } from './UI';

interface AchievementCardProps {
  achievement: UserAchievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { title, description, icon, unlocked, progress, maxProgress, unlockedAt } = achievement;

  // Dynamically resolve icon from lucide-react package
  const renderIcon = () => {
    const IconComponent = (Icons as any)[icon];
    if (IconComponent) {
      return <IconComponent className={`w-6 h-6 ${unlocked ? 'text-accent' : 'text-textSecondary/40'}`} />;
    }
    return <Award className={`w-6 h-6 ${unlocked ? 'text-accent' : 'text-textSecondary/40'}`} />;
  };

  return (
    <Card 
      variant={unlocked ? 'glow' : 'solid'} 
      className={`relative overflow-hidden transition-all duration-300 ${
        unlocked 
          ? 'bg-gradient-to-br from-card/90 to-primary/10 border-primary/30 glow-primary' 
          : 'bg-card/40 border-white/5 opacity-60'
      }`}
    >
      <div className="flex gap-4 items-center">
        {/* Icon container */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
          unlocked 
            ? 'bg-primary/20 border-primary/40' 
            : 'bg-white/5 border-white/5'
        }`}>
          {renderIcon()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className={`text-sm font-bold truncate ${unlocked ? 'text-white' : 'text-textSecondary'}`}>
              {title}
            </h4>
            {unlocked && (
              <span className="shrink-0 text-success text-[10px] font-semibold flex items-center gap-1 bg-success/15 px-2 py-0.5 rounded-full border border-success/20">
                <CheckCircle className="w-3 h-3" /> Unlocked
              </span>
            )}
          </div>
          <p className="text-xs text-textSecondary mt-1 leading-normal">
            {description}
          </p>

          {/* Progress (if locked and has multiple steps) */}
          {!unlocked && maxProgress > 1 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[10px] font-medium text-textSecondary">
                <span>Progress</span>
                <span>{progress}/{maxProgress}</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-primary-light h-full rounded-full transition-all duration-300"
                  style={{ width: `${(progress / maxProgress) * 100}%` }}
                />
              </div>
            </div>
          )}

          {unlocked && unlockedAt && (
            <p className="text-[9px] text-textSecondary/60 mt-2">
              Unlocked on {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
export default AchievementCard;
