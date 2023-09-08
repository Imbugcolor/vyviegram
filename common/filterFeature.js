class APIfeatures {
    query;
    queryString;

    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        // console.log({before: queryObj}) // before delete params

        const excludedFields = ['page', 'sort', 'limit', 'sizes']
        excludedFields.forEach(el => delete(queryObj[el]))

        // console.log({after: queryObj}) //after delete params

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        // lte, gte = less/greater than or equal
        // lt, gt = less/greater than
        // regex = compare ~ string 
        // console.log({queryStr})

        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        
        return this;
    }
    pagination(){
        let page = Number(this.queryString.page) * 1 || 1;
        let limit = Number(this.queryString.limit) * 1 || 4;
        let skip = (page -1) * limit;

        this.query = this.query.limit(limit).skip(skip);

        return this;
    }
}

module.exports = APIfeatures;