"use client";

import Link from "next/link";
import { AiFillBug } from "react-icons/ai";
import { usePathname } from "next/navigation";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import { Box } from "@radix-ui/themes";

const Navbar = () => {
  const pathNameDirective = usePathname();
  const { status, data } = useSession();

  const links = [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Issues  ",
      href: "/issues/list",
    },
  ];

  return (
    <nav className="flex space-x-6 border-b-2 p-4 mb-5 px-5 h-14 items-center">
      <Link href="/">
        <AiFillBug />
      </Link>

      <ul className="flex space-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className={classnames({
                "text-zinc-900": link.href === pathNameDirective,
                "text-zinc-500": link.href !== pathNameDirective,
                "hover:text-zinc-800 transition-colors": true,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Box>
        {status === "authenticated" && (
          <Link href="/api/auth/signout">Logout</Link>
        )}
        {status === "unauthenticated" && (
          <Link href="/api/auth/signin">LogIn Please</Link>
        )}
      </Box>
    </nav>
  );
};

export default Navbar;
