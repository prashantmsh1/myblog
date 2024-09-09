import React from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
const Dashboard = () => {
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
        <div className="flex flex-col min-h-screen md:flex-row ">
            {/* sidebar */}
            <div className="">
                <DashSidebar />
            </div>
            <div className="w-full ">
                {tab === "profile" && <DashProfile />}
                {tab === "posts" && <DashPost />}
                {tab === "users" && <DashUsers />}
            </div>
        </div>
    );
};

export default Dashboard;
