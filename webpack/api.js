const realtor = require('./realtorca');

let opts = {
    LongitudeMin: -80.591415,
    LongitudeMax: -80.450974,
    LatitudeMin: 43.396397,
    LatitudeMax: 43.525024,
    PriceMin: 100000,
    PriceMax: 600000,
    RecordsPerPage: 200,
};

const run = async (opts) => {
    const results = [];
    const data = await realtor.post(opts);
    results.push(...data.Results);
    const { TotalRecords } = data.Paging;
    const numPages = Math.ceil(TotalRecords / opts.RecordsPerPage);
    const responses = await Promise.all(Array.from({ length: numPages - 1 }, (v, k) => k + 2).map(v => realtor.post(Object.assign({}, opts, { CurrentPage: v }))));
    responses.forEach(d => results.push(...d.Results));
    return results;
};

module.exports.middleware = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const data = await run(opts);
    res.end(JSON.stringify(data));
};