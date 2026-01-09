"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={() => onOpenChange(false)}
            />
            {/* Content Container */}
            <div className="relative z-50 w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("relative grid w-full gap-4 border bg-background p-6 shadow-lg rounded-xl sm:max-w-lg", className)}>
            {children}
        </div>
    );
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
            {children}
        </div>
    );
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4", className)}>
            {children}
        </div>
    );
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
            {children}
        </h2>
    );
}
