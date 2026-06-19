"use client"

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronsUpDown, Clock, CreditCard, CarFront, Search, LogOut, Ticket, Heart, Settings, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';

const managementItems = [
    { name: "Find Parking", href: "/dashboard/spotter/search", icon: Search },
    { name: "Active Tickets", href: "/dashboard/spotter/active-tickets", icon: Ticket },
    { name: "Booking History", href: "/dashboard/spotter/booking-history", icon: Clock },
    { name: "My Vehicles", href: "/dashboard/spotter/my-vehicles", icon: CarFront },
];
export default function DriverSidebar({ user }: { user: any }) {
    const pathname = usePathname();
    return (
        <Sidebar className="border-r border-border bg-card/50">
            <SidebarHeader className="h-16 px-4 border-b border-border flex flex-row items-center justify-between">
                <div className="flex items-center">
                    <span className="font-fraunces text-lg font-medium tracking-widest uppercase">
                        Park<span className="text-primary">Ease</span>
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                        Driver
                    </span>
                </div>
                <SidebarTrigger />
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                {/* Management Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className="gap-3 transition-all font-medium"
                                        tooltip={item.name}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Actions Section */}
                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        Actions
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/dashboard/spotter/favourites"}
                                    className="gap-3 transition-all font-medium"
                                    tooltip="Saved Locations"
                                >
                                    <Link href="/dashboard/spotter/favourites">
                                        <Heart className="h-4 w-4" />
                                        <span>Saved Locations</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg border border-border">
                                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                                            {user?.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card border-border shadow-xl"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                {/* <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                    </div>
                  </div>
                </DropdownMenuLabel> */}
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href={`/dashboard/spotter/profile`} className="flex">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href={`/dashboard/spotter/billing`} className="flex">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Billing
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href={`/dashboard/spotter/settings`} className="flex">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
