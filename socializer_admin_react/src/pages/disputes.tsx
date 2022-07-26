import SectionTitle from "components/section-title";
import {
    DefaultTabs,
    UnderlinedTabs,
    IconTabs,
    Pills,
    VerticalTabs,
} from "components/tabs";
import {useReactTable, getCoreRowModel, createColumnHelper, flexRender} from "@tanstack/react-table";
import {useState} from "react";

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
    columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: info => info.column.id,
    }),
    columnHelper.accessor('age', {
        header: () => 'Age',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: info => info.column.id,
    }),
]

const Tab0 = () => {
    const [data, setData] = useState(() => [...defaultData])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left table-auto">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}
                                className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase border-b border-gray-100 leading-4 dark:border-gray-800">
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}
                                className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-3">
                <div>
                    <div className="text-sm text-slate-500 gn qe">
                        Showing
                        <span>10</span>
                    </div>
                    <button
                        className="px-4 py-2 text-xs font-bold text-blue-500 uppercase bg-transparent border border-blue-500 rounded-lg hover:text-blue-700 hover:border-blue-700"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<- Previous'}
                    </button>
                    <button
                        className="px-4 py-2 text-xs font-bold text-blue-500 uppercase bg-transparent border border-blue-500 rounded-lg hover:text-blue-700 hover:border-blue-700"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'Next ->'}
                    </button>
                </div>

            </div>


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
