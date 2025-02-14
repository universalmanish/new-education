"use client"
import { LevelCard } from "@/components/level-card";
import { pageData } from "@/db/queries";
import { countSlashes, routeItem } from "@/lib/route-finder";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


type LevelProps = {
    id: number;
    title: string;
    route: string
}
const LevelPage = () => {
    const pathName = usePathname();
    const [data, setData] = useState<LevelProps[] | null>(null);
    const [loading, setLoading] = useState(true);
    const countSlash = countSlashes(pathName)
    const routeItems = routeItem(pathName)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await pageData(countSlash, routeItems);
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
        <div className="p-5 pt-[90px] h-full bg-white overflow-y-auto dark:bg-black lg:pl-[350px]">
            <div className="flex justify-around">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-9 md:gap-[70px] gap-[50px]">
                    {data.map((i) => (
                        <Link key={i.id} href={`${pathName}/${i.route}`}>
                            <LevelCard title={i.title} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LevelPage