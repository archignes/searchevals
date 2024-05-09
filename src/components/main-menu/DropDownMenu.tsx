// DropDownMenu.tsx

import React, { useEffect, useState, Suspense } from 'react';
import { HamburgerMenuIcon, QuestionMarkIcon } from '@radix-ui/react-icons';
import { MainMenuButton } from './Button';
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useAppContext } from '@/src/contexts/AppContext';

const InfoCard = React.lazy(() => import('./Info'));

const DropDownMenu: React.FC<{ className?: string }> = React.memo(({ className }) => {
  const { isMainMenuExpanded, setIsMainMenuExpanded } = useAppContext();
  const [isClient, setIsClient] = useState<boolean>(false);
  useEffect(() => {
    // This code runs after the component is mounted, which means it runs only on the client.
    setIsClient(true);
  }, []);

  if (!isClient) {
    // This will only render null on the client during the first render.
    // It avoids server-client markup mismatch that leads to hydration errors.
    return null;
  }

  

  return (
    <DropdownMenu
      open={isMainMenuExpanded} onOpenChange={setIsMainMenuExpanded}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`hover:bg-blue-10 m-0 py-0 px-2 ${isMainMenuExpanded ? 'bg-blue-500 text-white' : ''} ${className} justify-start ml-2 w-8`}>
          <HamburgerMenuIcon className="w-4 h-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <Suspense>
            <MainMenuButton
            TargetTitle="Info"
            TargetTooltip="Info"
            TargetComponent={<InfoCard />}
            TargetIcon={<QuestionMarkIcon />}
            ButtonIndex={1}
            />
            </Suspense>
            </DropdownMenuContent>
        </DropdownMenu>
  )
});

export default DropDownMenu;
