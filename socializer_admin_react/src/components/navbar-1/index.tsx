import {FiSettings, FiMenu} from "react-icons/fi";
import {useAppDispatch, useAppSelector} from "redux/hooks";
import {setConfig} from "redux/config/config";
import ProfileDropdown from "components/navbar-1/account-dropdown";

const Navbar: React.FC = () => {
    const config = useAppSelector((state) => state.config);
    const {rightSidebar, collapsed} = config;
    const dispatch = useAppDispatch();
    return (
        <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-start w-full">
                <button
                    onClick={() =>
                        dispatch(
                            setConfig({
                                collapsed: !collapsed,
                            })
                        )
                    }
                    className="mx-4">
                    <FiMenu size={20}/>
                </button>

                <span className="ml-auto"></span>
                <ProfileDropdown/>
            </div>
        </div>
    );
};

export default Navbar;
