import {FiBox, FiMenu} from "react-icons/fi";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {setConfig} from "../../redux/config/config";
import Image from "next/image";
import appLogo from "assets/app_icon.png";

const Logo: React.FC = () => {
    const dispatch = useAppDispatch();
    const {name, collapsed} = useAppSelector((state) => state.config);
    const {showLogo} = useAppSelector((state) => state.leftSidebar);
    if (showLogo) {
        return (
            <div className="logo truncate">
                <Link href="/">
                    <a className="flex flex-row items-center justify-start space-x-2">
                        <div className="relative w-8 h-8">
                            {/*<FiBox size={28} />*/}
                            <Image
                                src={appLogo}
                                alt="logo"
                                sizes={"24"}
                                className="rounded-full shadow-lg"
                            />
                        </div>
                        <span>{name}</span>
                    </a>
                </Link>
                <button
                    onClick={() =>
                        dispatch(
                            setConfig({
                                collapsed: !collapsed,
                            })
                        )
                    }
                    className="block ml-auto mr-4 lg:hidden">
                    <FiMenu size={20}/>
                </button>
            </div>
        );
    }
    return null;
};

export default Logo;
