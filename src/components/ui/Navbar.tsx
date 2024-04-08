import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <div className="fixed top-2 right-4 z-20">
      <DropdownMenu>
        <DropdownMenuTrigger className="opacity-80">
          <HamburgerMenuIcon className="opacity-70 w-6 h-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Questions</DropdownMenuItem>
          <DropdownMenuItem>Notes</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
