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
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="fixed top-2 right-4 z-20">
      <DropdownMenu dir="ltr">
        <DropdownMenuTrigger className="opacity-80  w-8 h-8 flex justify-center items-center">
          <HamburgerMenuIcon className="opacity-70 w-6 h-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={"/"}>
            <DropdownMenuItem>Practice</DropdownMenuItem>
          </Link>
          <Link href={"/questions"}>
            <DropdownMenuItem>Questions</DropdownMenuItem>
          </Link>
          <Link href={"/notes"}>
            <DropdownMenuItem>Notes</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
