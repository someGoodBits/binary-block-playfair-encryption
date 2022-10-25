import { useState } from "react";
const RAD = {
    BIN: 2,
    HEX: 16,
    DEC: 10,
};

const Table = ({ data, decryption = false }) => {
    const [radix, setRadix] = useState(RAD.HEX);

    function formatNum(hex) {
        let num = parseInt(hex, RAD.HEX).toString(radix).toUpperCase();
        if (radix === RAD.BIN) num = num.padStart(4, "0");
        if (radix === RAD.DEC) num = num.padStart(2, "0");
        return num;
    }

    function getLabel() {
        switch (radix) {
            case RAD.BIN:
                return "Bin";
            case RAD.DEC:
                return "Dec";
            case RAD.HEX:
                return "Hex";
        }
    }

    return (
        <div>
            <div className="space-x-4 my-4 flex justify-center">
                <button
                    className="p-3 rounded bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300 font-semibold uppercase"
                    onClick={() => setRadix(RAD.BIN)}
                >
                    BIN
                </button>
                <button
                    className="p-3 rounded bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300 font-semibold uppercase"
                    onClick={() => setRadix(RAD.DEC)}
                >
                    DEC
                </button>
                <button
                    className="p-3 rounded bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300 font-semibold uppercase"
                    onClick={() => setRadix(RAD.HEX)}
                >
                    HEX
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full font-mono table-fixed min-w-[64rem]">
                    <thead>
                        {decryption ? (
                            <tr className="text-gray-500">
                                <th>Index</th>
                                <th>Enc Token</th>
                                <th>Enc ASCII</th>
                                <th>{getLabel()}</th>
                                <th>{"Dec " + getLabel()}</th>
                                <th>{"Ror " + getLabel()}</th>
                                <th>Dec ASCII</th>
                                <th>Dec Token</th>
                            </tr>
                        ) : (
                            <tr className="text-gray-500">
                                <th>Index</th>
                                <th>Token</th>
                                <th>ASCII</th>
                                <th>{getLabel()}</th>
                                <th>{"Rol " + getLabel()}</th>
                                <th>{"Enc " + getLabel()}</th>
                                <th>Enc ASCII</th>
                                <th>Enc Token</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {data.map((row, rowID) => (
                            <tr key={rowID}>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    {rowID}
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    "{row.token}"
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    {row.code}
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    {formatNum(row.hexA) + " " + formatNum(row.hexB)}
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    {formatNum(row.rhexA) + " " + formatNum(row.rhexB)}
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    {formatNum(row.subHexA) + " " + formatNum(row.subHexB)}
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    {row.subCode}
                                </td>
                                <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl">
                                    "{row.subToken}"
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
