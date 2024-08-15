export default class ApiFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  pagination() {
    let page = +this.query.page || 1;
    if (page > 1) page = 1;
    const limit = 2;
    const skip = (page - 1) * limit;

    this.mongooseQuery.find().skip(skip).limit(limit);

    this.page = page;

    return this;
  }

  filter() {
    const excludeQuery = ["page", "sort", "search", "select"];
    let filterQuery = { ...this.query };
    excludeQuery.forEach((el) => delete filterQuery[el]);
    filterQuery = JSON.parse(
      JSON.stringify(filterQuery).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    );

    this.mongooseQuery.find(filterQuery);

    return this;
  }

  sort() {
    if (this.query.sort)
      this.mongooseQuery.sort(this.query.sort.replaceAll(",", " "));

    return this;
  }

  select() {
    if (this.query.select)
      this.mongooseQuery.select(this.query.select.replaceAll(",", " "));

    return this;
  }

  search() {
    if (this.query.search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.query.search, $options: "i" } },
          { description: { $regex: this.query.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
