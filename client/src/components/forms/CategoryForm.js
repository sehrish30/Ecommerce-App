import React from "react";

const CategoryForm = ({ handleSubmit, setName, name }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="form-control"
          value={name}
          autoFocus
          required
        />
        <button className="btn btn-outline-primary mt-4">Save</button>
      </div>
    </form>
  );
};

export default CategoryForm;
