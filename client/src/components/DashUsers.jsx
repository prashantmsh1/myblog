import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { set } from "mongoose";
import { FaCheck, FaCut, FaTimes } from "react-icons/fa";

const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = React.useState([]);
    const [showMore, setShowMore] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [userIdToDelete, setUserIdToDelete] = React.useState("");
    const handleShowMore = async () => {
        const startIndex = users.length;

        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok === true) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/user/getusers");
            const data = await res.json();
            console.log(data);
            if (res.ok === true) {
                setUsers(data.users);
                if (data.posts.length < 5) {
                    setShowMore(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok === true) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setShowModal(false);
            }
            if (res.ok === false) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [currentUser._id]);

    return (
        <div className="p-3 mx-auto overflow-x-scroll table-auto md:w-4/5 md:scrollbar-none scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-300 dark:scrollbar-thumb-slate-500 ">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="mx-auto shadow-md ">
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {users.map((user, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${user.username}`}>
                                            {" "}
                                            <img
                                                src={user.images}
                                                alt={user.username}
                                                className="w-12 h-12"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className="font-bold text-green-800 " />
                                        ) : (
                                            <FaTimes className="font-bold text-red-800 " />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <button
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className="px-2 py-1 text-white bg-red-500 rounded-md">
                                            Delete
                                        </button>
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
                <div className="">No Users</div>
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
                            <Button onClick={() => handleDeleteUser()} color="failure">
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashUsers;
