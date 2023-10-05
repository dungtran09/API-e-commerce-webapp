class FeaturesAPI {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  // FILTER
  filter() {
    const queryStr = JSON.stringify(this.queryObj);

    const queryObj = JSON.parse(
      queryStr?.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
    );

    const excluded = ["page", "sort", "limit", "fields"];

    Object.keys(queryObj)?.filter((key, index) =>
      excluded?.includes(key) ? delete queryObj[key] : queryObj,
    );

    this.query = this.query?.find(queryObj);
    return this;
  }

  // SORT
  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj?.sort?.split(",").join(" ");
      this.query = this.query?.sort(sortBy);
    } else {
      this.query = this.query?.sort("-createdAt");
    }
    return this;
  }

  // LIMIT FIELDS
  limit() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields?.split(",")?.join(" ");
      this.query = this.query?.select(fields);
    } else {
      this.query = this.query?.select("-_v");
    }

    return this;
  }

  // PAGINATION
  pagination() {
    const page = parseInt(this.queryObj?.page) || 1;
    const limit = parseInt(this.queryObj?.limit) || 15;
    const skip = (page - 1) * limit;

    this.query = this.query?.skip(skip)?.limit(limit);

    return this;
  }
}

module.exports = FeaturesAPI;
