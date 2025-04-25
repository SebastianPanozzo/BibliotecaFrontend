function DynamicTable({ headers, data }) {
    return (
        <div className="table-responsive">
            <table className="table w-100">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} scope="col">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                cellIndex === 0
                                    ? <th key={cellIndex} scope="row">{cell}</th>
                                    : <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DynamicTable;