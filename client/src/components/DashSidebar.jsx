import React from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = React.useState("");
    React.useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tab = urlParams.get("tab");
        if (tab) {
            setTab(tab);
        }
    }, [location]);
    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-y-1">
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            as="div"
                            icon={HiUser}
                            labelColor="dark"
                            label={"User"}
                            active={tab === "profile"}>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=signout">
                        <Sidebar.Item
                            as="div"
                            active={tab === "signout"}
                            className=""
                            icon={HiArrowSmRight}>
                            Sign Out
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashSidebar;
