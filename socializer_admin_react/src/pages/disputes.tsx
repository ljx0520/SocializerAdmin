import SectionTitle from "components/section-title";
import {
    DefaultTabs,
    UnderlinedTabs,
    IconTabs,
    Pills,
    VerticalTabs,
} from "components/tabs";
import {useReactTable, getCoreRowModel, createColumnHelper, flexRender, Table} from "@tanstack/react-table";
import {MouseEventHandler, useEffect, useState} from "react";
import {trackPromise} from "react-promise-tracker";
import request from "../service/fetch";
import {notify} from "../utils/notify";
import {defaultPage, formatDate, IPage} from "../lib";
import Link from "next/link";

export interface Note {
    note: string;
    sent_at: string;
    user_id: string;
    nickname: string;
    host_or_guest: string;
}

export interface Dispute {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: number;
    user_id: string;
    dispute_object: string;
    object_id: string;
    dispute_type: string;
    dispute_reason: string;
    dispute_status: string;
    dispute_result: string;
    dispute_notes: string;
    dispute_resolved_at: string;
    dispute_resolved_by: string;
    notes: Note[];
    dispute_processed_at: string;
    dispute_processed_by: string;
    attachments: any[];
}

const columnHelper = createColumnHelper<Dispute>()

const columns = [
    columnHelper.accessor('id', {
        header: 'Id',
        cell: info => {
            return <Link key={info.getValue() as string} href={`/dispute/${info.getValue() as string}`}>
                <a className="" target={"_blank"}>
                    <span className="title text-blue-500">{info.getValue().substring(0, 8)}</span>
                </a>
            </Link>
        },
        footer: info => info.column.id,
    }),
    columnHelper.accessor('dispute_object', {
        header: 'Dispute Object',
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('dispute_type', {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => 'Dispute Type',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('created_at', {
        header: () => 'Created At',
        cell: info => {
            return <span>{formatDate(info.getValue())}</span>
        },
        footer: info => info.column.id,
    }),
    columnHelper.accessor('dispute_processed_at', {
        header: () => 'Processed At',
        cell: info => {
            return <span>{formatDate(info.getValue())}</span>
        },
        footer: info => info.column.id,
    }),
    columnHelper.accessor('dispute_resolved_at', {
        header: () => 'Resolved At',
        cell: info => {
            return <span>{formatDate(info.getValue())}</span>
        },
        footer: info => info.column.id,
    }),
]

interface ITabProps {
    table: Table<Dispute>;
    page: IPage;
    handlePrev: Function;
    handleNext: Function;
}

const Tab = (props: ITabProps) => {
    const {table, page, handlePrev, handleNext} = props;
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
                <div className="flex items-center justify-start w-full">
                    <div className="flex ml-2">
                        Showing
                        <div className="font-semibold ml-1 mr-1">{`${page.from}`}</div>
                        to
                        <div className="font-semibold ml-1 mr-1">{`${page.to}`}</div>
                        of
                        <div className="font-semibold ml-1 mr-1">{`${page.count}`}</div>
                        results
                    </div>
                    <span className="ml-auto"></span>

                    {
                        page.previous != null ?
                            <button
                                className="px-4 py-2 text-xs font-bold text-blue-500 uppercase bg-transparent border border-blue-500 rounded-lg hover:text-blue-700 hover:border-blue-700 mr-2"
                                onClick={() => handlePrev()}
                                disabled={false}
                            >
                                {'<- Previous'}
                            </button> :
                            <button
                                className="px-4 py-2 text-xs font-bold text-slate-300 uppercase bg-transparent border border-grey-500 rounded-lg mr-2"
                                onClick={() => handlePrev()}
                                disabled={true}
                            >
                                {'<- Previous'}
                            </button>
                    }
                    {
                        page.next != null ?
                            <button
                                className="px-4 py-2 text-xs font-bold text-blue-500 uppercase bg-transparent border border-blue-500 rounded-lg hover:text-blue-700 hover:border-blue-700"
                                onClick={() => handleNext()}
                                disabled={false}
                            >
                                {'Next ->'}
                            </button> :
                            <button
                                className="px-4 py-2 text-xs font-bold text-slate-300 uppercase bg-transparent border border-grey-500 rounded-lg mr-2"
                                onClick={() => handleNext()}
                                disabled={true}
                            >
                                {'Next ->'}
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

const Tab0 = () => {
    const [data, setData] = useState(() => [])
    const [page, setPage] = useState<IPage>(() => defaultPage)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const searchDispute = (page: number) => {
        trackPromise(
            request
                .post('/api/disputes/search', {
                    dispute_status: 'Submitted',
                    page: page
                })
                .then((res: any) => {
                    if (res.data.code === 200) {
                        var data = res.data.data;
                        var newPage: IPage = {
                            count: data.count,
                            from: data.from,
                            next: data.next,
                            page_number: data.page_number,
                            page_size: data.page_size,
                            previous: data.previous,
                            to: data.to
                        };
                        // console.log(data)
                        setPage(newPage);
                        setData(data.results);
                    } else {
                        notify(res.data.msg, "warn")
                    }
                }));
    }

    useEffect(() => {
        searchDispute(page.page_number);
    }, [])

    const handlePrev = () => {
        searchDispute(page.page_number - 1);
    };

    const handleNext = () => {
        searchDispute(page.page_number + 1);
    };

    return (
        <Tab table={table} page={page} handlePrev={handlePrev} handleNext={handleNext}/>
    );
};

const Tab1 = () => {
    const [data, setData] = useState(() => [])
    const [page, setPage] = useState<IPage>(() => defaultPage)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const searchDispute = (page: number) => {
        trackPromise(
            request
                .post('/api/disputes/search', {
                    dispute_status: 'Processing',
                    page: page
                })
                .then((res: any) => {
                    if (res.data.code === 200) {
                        var data = res.data.data;
                        var newPage: IPage = {
                            count: data.count,
                            from: data.from,
                            next: data.next,
                            page_number: data.page_number,
                            page_size: data.page_size,
                            previous: data.previous,
                            to: data.to
                        };
                        // console.log(data)
                        setPage(newPage);
                        setData(data.results);
                    } else {
                        notify(res.data.msg, "warn")
                    }
                }));
    }

    useEffect(() => {
        searchDispute(page.page_number);
    }, [])

    const handlePrev = () => {
        searchDispute(page.page_number - 1);
    };

    const handleNext = () => {
        searchDispute(page.page_number + 1);
    };

    return (
        <Tab table={table} page={page} handlePrev={handlePrev} handleNext={handleNext}/>
    );
};

const Tab2 = () => {
    const [data, setData] = useState(() => [])
    const [page, setPage] = useState<IPage>(() => defaultPage)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const searchDispute = (page: number) => {
        trackPromise(
            request
                .post('/api/disputes/search', {
                    dispute_status: 'Resolved',
                    page: page
                })
                .then((res: any) => {
                    if (res.data.code === 200) {
                        var data = res.data.data;
                        var newPage: IPage = {
                            count: data.count,
                            from: data.from,
                            next: data.next,
                            page_number: data.page_number,
                            page_size: data.page_size,
                            previous: data.previous,
                            to: data.to
                        };
                        // console.log(data)
                        setPage(newPage);
                        setData(data.results);
                    } else {
                        notify(res.data.msg, "warn")
                    }
                }));
    }

    useEffect(() => {
        searchDispute(page.page_number);
    }, [])

    const handlePrev = () => {
        searchDispute(page.page_number - 1);
    };

    const handleNext = () => {
        searchDispute(page.page_number + 1);
    };

    return (
        <Tab table={table} page={page} handlePrev={handlePrev} handleNext={handleNext}/>
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
