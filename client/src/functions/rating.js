import React from "react";
import StarRatings from "react-star-ratings";

export const showAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);
    console.log(totalReduced);
    let highest = length * 5;
    console.log("highest", highest);
    let result = (totalReduced * 5) / highest;
    console.log(result);

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRatings
            starRatedColor="gold"
            starDimension="20px"
            starSpacing="2px"
            rating={result}
            editing={false}
          />{" "}
          <span style={{ verticalAlign: "middle" }}>({p.ratings.length})</span>
        </span>
      </div>
    );
  }
};
