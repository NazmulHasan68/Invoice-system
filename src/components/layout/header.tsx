'use client'

import { usePathname } from "next/navigation";

export default function Header() {
    const pathName = usePathname();
    const isLoaginPage: boolean = pathName === '/login'

    if(isLoaginPage) {
        return null
    }
    
    return (
        <div>Header</div>
    );
}