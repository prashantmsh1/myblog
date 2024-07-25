import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
const Header = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    return (
        <Navbar className="border-b-2 ">
            <Link
                to="/"
                className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white">
                <span className="px-2 py-1 text-white rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Prashant's{" "}
                </span>
                Blog
            </Link>
            <form action="">
                <TextInput
                    type="text"
                    placeholder="Search"
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"></TextInput>
            </form>
            <Button className="w-12 h-10 lg:hidden " color="gray" pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex gap-x-4 md:order-2 ">
                <Button
                    onClick={() => dispatch(toggleTheme())}
                    className="hidden w-12 h-10 lg:inline"
                    color="gray"
                    pill>
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<Avatar img={currentUser.profilePicture} alt="user"></Avatar>}>
                        <Dropdown.Header>
                            <span>@{currentUser.username}</span>
                            <span className="block text-sm font-medium truncate ">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to="/dashboard?tab=profile">
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item>Sign Out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in/">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Sign In
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/">Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about">About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={"div"}>
                    <Link to="/projects">Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
