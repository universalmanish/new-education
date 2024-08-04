"use client"
import { Sheet, SheetContent, SheetHeader, } from "./ui/sheet"
import { useSidebar } from "@/hooks/use-sidebar"
import { Sidebar } from "./sidebar"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { countSlashes, lastItem, routeItem } from "@/lib/route-finder"
import { sidebarData } from "@/db/queries"

type Props = {
    id: number;
    title: string;
    route: string;
};

export const MobileSidebar = () => {
    const pathName = usePathname();
    const [data, setData] = useState<Props[] | null>(null);
    const [loading, setLoading] = useState(true);
    const countSlash = countSlashes(pathName)
    const routeItems = routeItem(pathName)
    const lastItems = lastItem(pathName)
    const { onOpen, isOpen, onClose } = useSidebar()
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await sidebarData(countSlash, routeItems);
                if (response === undefined) {
                    setData(null);
                } else {
                    setData(response);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [countSlash, routeItems]);

    if (!data) return null

    return (
        <div className="flex">
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="bg-black">
                    <SheetHeader className="">
                        {data && 
                        <Sidebar
                         className="bg-green-300 w-[330px]"
                         href={lastItems} 
                         data={data} 
                         onlyLevels={countSlash === 3} />}
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}