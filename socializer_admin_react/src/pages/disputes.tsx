import SectionTitle from "components/section-title";
import {
    DefaultTabs,
    UnderlinedTabs,
    IconTabs,
    Pills,
    VerticalTabs,
} from "components/tabs";
import Widget from "components/widget";
import {FiSettings, FiHeart, FiMenu} from "react-icons/fi";

const Tab0 = () => {
    return (
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Molestie ac feugiat sed
            lectus vestibulum mattis ullamcorper velit sed. Condimentum vitae sapien
            pellentesque habitant morbi. Nec ullamcorper sit amet risus nullam eget
            felis. Dignissim sodales ut eu sem integer vitae justo eget. In pellentesque
            massa placerat duis ultricies.
        </div>
    );
};

const Tab1 = () => {
    return (
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Molestie ac feugiat sed
            lectus vestibulum mattis ullamcorper velit sed. Condimentum vitae sapien
            pellentesque habitant morbi. Nec ullamcorper sit amet risus nullam eget
            felis. Dignissim sodales ut eu sem integer vitae justo eget. In pellentesque
            massa placerat duis ultricies.
        </div>
    );
};

const Tab2 = () => {
    return (
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Molestie ac feugiat sed
            lectus vestibulum mattis ullamcorper velit sed. Condimentum vitae sapien
            pellentesque habitant morbi. Nec ullamcorper sit amet risus nullam eget
            felis. Dignissim sodales ut eu sem integer vitae justo eget. In pellentesque
            massa placerat duis ultricies.
        </div>
    );
};

const tabs = [
    {index: 0, title: "Submitted", active: true, content: <Tab0/>},
    {index: 1, title: "Processing", active: false, content: <Tab1/>},
    {index: 2, title: "Resolved", active: false, content: <Tab2/>},
];

const Index: React.FC = () => (
    <>
        <SectionTitle title="" subtitle="Reports & Requests"/>

        <div className="flex flex-wrap">
            <div className="w-full">
                <DefaultTabs tabs={tabs}/>
            </div>
        </div>
    </>
);
export default Index;
