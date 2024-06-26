// MainMenuButton.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { useAppContext } from "@/src/contexts/AppContext";

type MainMenuButtonProps = {
    TargetIcon: JSX.Element;
    TargetComponent: JSX.Element;
    TargetTitle: string;
    TargetTooltip: string;
    ButtonIndex: number;
    PortalButton?: {label: string};
};

type TargetButtonProps = {
    isButtonTargetOpen: boolean;
    TargetIcon: JSX.Element;
    toggleButtonTargetOpen: () => void;
    TargetTitle: string;
};

const TargetButton: React.ForwardRefRenderFunction<HTMLButtonElement, TargetButtonProps> = (
    { isButtonTargetOpen, TargetIcon, toggleButtonTargetOpen, TargetTitle },
    ref
) => {
    return (
        <Button
            ref={ref}
            id={`${TargetTitle.toLowerCase().replace(/ /g, "-")}-button`}
            variant="ghost"
            size="sm"
            onClick={toggleButtonTargetOpen}
            className={`inline-flex whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-md text-xs w-full px-2 mr-auto h-7 items-center justify-start ${isButtonTargetOpen ? "bg-blue-500 text-white hover:bg-blue-600" : "text-current hover:bg-blue-100"}`}
        >
            {React.cloneElement(TargetIcon, {
                className: `w-4 h-4 ${isButtonTargetOpen ? "text-white" : "text-current"}`,
            })}
            <span className={`ml-2 ${isButtonTargetOpen ? "text-white" : "text-current"}`}>{TargetTitle}</span>
        </Button>
    );
};

const TargetButtonWithRef = React.forwardRef(TargetButton);


export const MainMenuButton: React.FC<MainMenuButtonProps> = ({
    TargetIcon,
    TargetComponent,
    TargetTitle,
    TargetTooltip,
    ButtonIndex,
    PortalButton,
}: MainMenuButtonProps) => {
    const [isButtonTargetOpen, setIsButtonTargetOpen] = useState<boolean>(false);
    const { isAddSearchSystemOpen, toggleIsAddSearchSystemOpen } = useAppContext();
    
    useEffect(() => {
        if (TargetTitle === "Add") {
            setIsButtonTargetOpen(isAddSearchSystemOpen);
        }
    }, [isAddSearchSystemOpen, TargetTitle]);

    const popoverContentRef = useRef<HTMLDivElement>(null);
    const { setIsAnySettingsPopoverActive } = useAppContext();
    
    useEffect(() => {
        if (isButtonTargetOpen) {
            setIsAnySettingsPopoverActive(true);
        } else {
            setIsAnySettingsPopoverActive(false);
        }
    }, [isButtonTargetOpen, setIsAnySettingsPopoverActive]);

    const toggleButtonTargetOpen = useCallback(() => {
        setIsButtonTargetOpen((prevState) => !prevState);
        if (TargetTitle === "Add") {
            toggleIsAddSearchSystemOpen();
        }
    }, [TargetTitle, toggleIsAddSearchSystemOpen]);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const buttonId = `${TargetTitle.toLowerCase().replace(/ /g, "-")}-button`;
            const isClickedInsidePopover = popoverContentRef.current?.contains(target);
            const isClickedInsideButton = document.getElementById(buttonId)?.contains(target);

            if (!isClickedInsideButton && !isClickedInsidePopover) {
                setIsButtonTargetOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [TargetTitle]);

    return (
        <Popover open={isButtonTargetOpen} onOpenChange={setIsButtonTargetOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <TargetButtonWithRef
                                isButtonTargetOpen={isButtonTargetOpen}
                                TargetIcon={TargetIcon}
                                toggleButtonTargetOpen={toggleButtonTargetOpen}
                                TargetTitle={TargetTitle}
                            />
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-base">
                        {TargetTooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent style={{ width: '92vw' }} ref={popoverContentRef}
                side="right" sideOffset={window.innerWidth < 640 ? -120 : -10}
                align="start" alignOffset={(-28 * ButtonIndex) -5} 
                className="border-none w-auto rounded-md min-h-[200px] p-0 max-w-[610px]">
                {TargetComponent}
            </PopoverContent>
        </Popover>
    );
};

