import React from 'react'

const Pagination = ({page, total, callback, pageSize}) => {

    // Math.ceil to calculate totalPageCount 
    const totalPageCount = Math.ceil(total/pageSize)

    // Then map to array num page base on totalPageCount, totalPageCount = 4 => [1,2,3,4]
    const newArr = [...Array(totalPageCount)].map((_,i) => i + 1)

    const isActive = (index) => {
        if(index === page) return 'active';
        return ''
    }

    const handlePagination = (num) => {
        callback(num)
    }

    return (
        <nav aria-label="Page navigation example"
        style={{cursor: 'pointer', marginTop: '15px'}}>
            <ul className="pagination">
                {
                    page > 1 &&
                    <li className="page-item" onClick={() => handlePagination(page - 1)}>
                        <span className="page-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </span>
                    </li>
                }

                {
                    newArr.map(num => (                       
                        <li key={num} className={`page-item ${isActive(num)}`}
                        onClick={() => handlePagination(num)}>
                            <span className="page-link">
                                {num}
                            </span>
                        </li>
                    ))
                }
                       
                {
                    page < totalPageCount &&
                    <li className="page-item"
                    onClick={() => handlePagination(page + 1)}>
                        <span className="page-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </span>
                    </li>
                }

            </ul>
        </nav>
    )
}

export default Pagination