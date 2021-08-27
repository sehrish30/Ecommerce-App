import { useState, useEffect } from "react";
import AdminNav from "./../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 500) toast.error(err.response.data);
      });
  };

  const showCategoryForm = () => (
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
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading</h4>
          ) : (
            <h4>Create category</h4>
          )}
          {showCategoryForm()}
          <div>{JSON.stringify(categories)}</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
