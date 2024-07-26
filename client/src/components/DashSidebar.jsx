import React from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = React.useState("");
    const dispatch = useDispatch();
    React.useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tab = urlParams.get("tab");
        if (tab) {
            setTab(tab);
        }
    }, [location]);
    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok === true) {
                dispatch(signoutSuccess());
            }
            if (res.ok === false) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
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
                            onClick={handleSignOut}
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
