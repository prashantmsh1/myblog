import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const DashPost = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = React.useState([]);
    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/post/getposts?userId=" + currentUser._id);
            const data = await res.json();
            console.log(data);
            if (res.ok === true) {
                setUserPosts(data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {}, []);

    return <div className="">DashPost</div>;
};

export default DashPost;
