import React from "react";
import StarRatings from "react-star-ratings";

const Star = ({ starClick, numberOfStars }) => {
  return (
    <div>
      <StarRatings
        numberOfStars={numberOfStars}
        changeRating={() => starClick(numberOfStars)}
        starDimension="20px"
        starSpacing="2px"
        starHoverColor="gold"
        starEmptyColor="gold"
      />
    </div>
  );
};

export default Star;
