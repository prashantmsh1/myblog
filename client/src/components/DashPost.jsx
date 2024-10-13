import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPost = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = React.useState([]);
    const [showMore, setShowMore] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [postId, setPostId] = React.useState("");
    const handleShowMore = async () => {
        try {
            const res = await fetch(
                `/api/post/getposts?userId=${currentUser._id}&startIndex=${userPosts.length}`
            );
            const data = await res.json();
            if (res.ok === true) {
                setUserPosts([...userPosts, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/post/getposts?userId=" + currentUser._id);
            const data = await res.json();
            console.log(data);
            if (res.ok === true) {
                setUserPosts(data.posts);
                if (data.posts.length < 9) {
                    setShowMore(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`);
            const data = await res.json();
            if (res.ok === true) {
                console.log(data);
                setShowModal(false);
                setPostId("");
                setUserPosts(userPosts.filter((post) => post._id !== postId));
            }
            if (res.ok === false) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, [currentUser._id]);

    return (
        <div className="p-3 mx-auto overflow-x-scroll table-auto md:w-4/5 md:scrollbar-none scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-300 dark:scrollbar-thumb-slate-500 ">
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="mx-auto shadow-md ">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {userPosts.map((post, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            {" "}
                                            <img
                                                src={post.images}
                                                alt={post.title}
                                                className="w-12 h-12"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.title}</Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <button
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostId(post._id);
                                            }}
                                            className="px-2 py-1 text-white bg-red-500 rounded-md">
                                            Delete
                                        </button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <button className="px-2 py-1 text-white bg-blue-500 rounded-md ">
                                                Edit
                                            </button>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && (
                        <button
                            onClick={() => handleShowMore()}
                            className="block w-1/2 px-3 py-2 mx-auto my-3 text-white bg-blue-500 rounded-md">
                            Show More
                        </button>
                    )}
                </>
            ) : (
                <div className="">No posts</div>
            )}
            <Modal
                onClose={() => {
                    setShowModal(false);
                }}
                show={showModal}>
                <Modal.Header className="bg-gray-200 "></Modal.Header>
                <Modal.Body className="bg-gray-200">
                    <div className="flex flex-col gap-4 ">
                        <HiOutlineExclamationCircle className="self-center text-4xl text-red-500" />
                        <h1 className="text-xl font-semibold ">
                            Are you sure you want to delete this post?
                        </h1>
                        <div className="flex justify-center gap-4 ">
                            <Button onClick={() => setShowModal(false)} outline color="failure">
                                Cancel
                            </Button>
                            <Button onClick={() => handleDelete()} color="failure">
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashPost;
