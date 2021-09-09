import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";
import { Tag } from "antd";
const SubList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs().then((res) => {
      setSubs(res.data);
      setLoading(false);
    });
  }, []);

  const showSubs = () =>
    subs.map((sub) => (
      //   <div
      //     key={sub._id}
      //     className="col btn btn-outline-primary btn-lg btn-block btn-raised m-1"
      //   >
      //     <Link to={`/sub/${sub.slug}`}> {sub.name}</Link>
      //   </div>

      <Tag color="processing">
        <Link to={`/sub/${sub.slug}`}> {sub.name}</Link>
      </Tag>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          <div className=" col  align-content-center justify-content-center">
            <p className="text-center">{showSubs()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubList;
