import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar, Image, Badge } from "antd";

const FileUpload = ({ values, setValues, setLoading, loading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const handleImageRemove = (id) => {
    setLoading(true);
    console.log("remove image", id);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        {
          public_id: id,
        },
        {
          headers: {
            authtoken: user?.token,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        // delete image from state as well
        const { images } = values;
        let filteredImages = images.filter((item) => item.public_id !== id);
        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const fileUploadAndResize = (e) => {
    console.log(e.target.files);

    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  image: uri,
                },
                {
                  headers: {
                    authtoken: user?.token,
                  },
                }
              )
              .then((res) => {
                console.log("Image upload res data", res);
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD ERR", err);
              });
          },
          "base64"
        );
      }
    }
    //resize files
    // send back to server upload to cloudinary
    // seturl to images array in parent component -productcreate
  };
  return (
    <>
      <div className="row">
        {values.images.map((image) => (
          <Badge
            style={{ cursor: "pointer" }}
            count="X"
            key={image.public_id}
            onClick={() => handleImageRemove(image.public_id)}
          >
            <Avatar
              shape="square"
              className="ml-3"
              size={100}
              src={<Image src={image.url} />}
            />
          </Badge>
        ))}
      </div>
      <div className="row">
        <label className="btn btn-primary mt-3">
          Choose file
          {/* accept means what files you want to accept */}
          <input
            hidden
            type="file"
            multiple
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
