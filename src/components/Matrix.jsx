const Matrix = ({ data ,size}) => {

    let matrixData = data.reduce((all,one,i) => {
        const ch = Math.floor(i/size); 
        all[ch] = [].concat((all[ch]||[]),one); 
        return all
    },[])

    return (
        <table className="w-full">
            <tbody>
                {matrixData.map((row, rowID) => (
                    <tr key={rowID}>
                        {row.map((cell, cellID) => (
                            <td className="p-3 border border-gray-300 bg-gray-100 text-center align-middle text-gray-500 text-xl" key={cellID}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Matrix;
