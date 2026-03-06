"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cloneElement, isValidElement, useState } from "react";

interface AddressDialogButtonProps {
  buttonText: React.ReactNode;
  dlgTitle: string;
  dlgDescription: string;
  children: React.ReactNode;
  className?: string;
}

export function AddressDialogButton({
  buttonText,
  children,
  dlgDescription,
  dlgTitle,
  className,
}: AddressDialogButtonProps) {
  const [open, setOpen] = useState(false);

  const childWithClose = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ onClose?: () => void }>, {
        onClose: () => setOpen(false),
      })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dlgTitle}</DialogTitle>
          <DialogDescription className="text-sm">
            {dlgDescription}
          </DialogDescription>
        </DialogHeader>
        <div>{childWithClose}</div>
      </DialogContent>
    </Dialog>
  );
}
