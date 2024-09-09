import React from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = React.useState("");
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
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
                    {currentUser.isAdmin && (
                        <>
                            <Link to="/dashboard/?tab=posts">
                                <Sidebar.Item
                                    as="div"
                                    icon={HiDocumentText}
                                    active={tab === "posts"}>
                                    Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard/?tab=users">
                                <Sidebar.Item
                                    as="div"
                                    icon={HiOutlineUserGroup}
                                    active={tab === "users"}>
                                    Users
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}
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
