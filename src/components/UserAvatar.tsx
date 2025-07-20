import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface UserAvatarProps {
  onSignOut: () => void;
}

export const UserAvatar = ({ onSignOut }: UserAvatarProps) => {
  const { profile, loading } = useProfile();
  const { user } = useAuth();

  if (loading || !user) {
    return (
      <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
    );
  }

  const displayName = profile?.display_name || user.email || 'User';
  const firstChar = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {firstChar}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem className="flex-col items-start">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium">{displayName}</span>
            </div>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};