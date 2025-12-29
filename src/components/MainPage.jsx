import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../plugins/axios";
import StarOutline from "../assets/star-outline.svg?react";
import ImageOffOutline from "../assets/image-off-outline.svg?react";
import ArrowRight from "../assets/arrow-right.svg?react";
import Person from "../assets/person.svg?react";

const MainPage = () => {
  const { user, logout } = useAuth();
  const [productData, setProductData] = useState([]);
  const [openReview, setOpenReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState({
    product: true,
    review: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading((prev) => ({ ...prev, product: true }));
      try {
        const response = await api({
          method: "get",
          url: "/product-review-api/products",
        });
        setProductData(response.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading((prev) => ({ ...prev, product: false }));
      }
    };
    fetchProduct();
  }, []);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedProduct(null);
    setReviewData([]);
  };

  useEffect(() => {
    const fetchReview = async (product_id) => {
      setLoading((prev) => ({ ...prev, review: true }));
      try {
        const res = await api({
          method: "get",
          url: `/product-review-api/reviews/${product_id}`,
        });
        setReviewData(res.data);
      } catch (error) {
        console.error("Failed to fetch review", error);
      } finally {
        setLoading((prev) => ({ ...prev, review: false }));
      }
    };

    if (openReview && selectedProduct?.id) {
      fetchReview(selectedProduct?.id);
    }
  }, [openReview, selectedProduct?.id]);

  return (
    <div className="main-page">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          Welcome back <b>{user.name}</b> ! <br />
          You are logged in.
        </span>
        <button className="primary" onClick={logout}>
          Logout
        </button>
      </div>
      <br />
      <div className="main-layout">
        <div className="left-section">
          <h3>List of Products:</h3>
          {loading.product ? (
            <span>Loading...</span>
          ) : (
            <div className="flex" style={{ gap: "12px", flexWrap: "wrap" }}>
              {productData.map((item, index) => (
                <div key={index} className="card-item">
                  <div className="product-image">
                    <ImageOffOutline style={{ color: "#4c5053" }} />
                  </div>
                  <div className="flex justify-space-between">
                    <div className="category">{item.category}</div>
                    <span className="price">
                      IDR {item.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="text-subheader font-weight-semibold">
                    {item.name}
                  </span>
                  <div className="rating-wrapper">
                    <StarOutline
                      style={{
                        color: "#9a9ea1",
                        height: "20px",
                        width: "20px",
                      }}
                    />
                    <span className="rating">
                      {item.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-body text-secondary">
                    {item.description}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      alignItems: "end",
                      justifyContent: "end",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      className="secondary"
                      onClick={() => handleOpenReview(item)}
                    >
                      See Full Reviews
                      <ArrowRight
                        style={{
                          marginLeft: "4px",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {openReview && (
          <div className="right-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Reviews</h3>
              <button
                className="secondary"
                style={{
                  fontSize: "12px",
                  height: "28px",
                  width: "28px",
                  justifyContent: "center",
                  padding: "0px",
                  borderRadius: "50%",
                }}
                onClick={() => handleCloseReview()}
              >
                X
              </button>
            </div>
            {loading.review ? (
              <span>Loading...</span>
            ) : (
              <div className="flex flex-column" style={{ gap: "16px" }}>
                <div className="flex flex-column">
                  <span className="font-weight-medium">
                    {selectedProduct.name}
                  </span>
                  <span className="text-body text-secondary">
                    {selectedProduct.description}
                  </span>
                </div>
                <div className="flex flex-column align-center justify-center">
                  <span style={{ fontWeight: "600", fontSize: "24px" }}>
                    {selectedProduct.average_rating.toFixed(1)}
                  </span>
                  <span className="text-body text-secondary">
                    Based on {reviewData.length} reviews
                  </span>
                </div>
                <hr style={{ width: "25%", opacity: "0.4" }} />
                <div className="flex flex-column" style={{ gap: "16px" }}>
                  {reviewData.map((item, index) => (
                    <div key={index} className="flex flex-column">
                      <div className="flex justify-space-between align-end">
                        <div
                          className="flex align-center"
                          style={{ gap: "12px" }}
                        >
                          <div
                            className="flex justify-center align-center"
                            style={{
                              backgroundColor: "#34393d",
                              height: "40px",
                              width: "40px",
                              borderRadius: "50%",
                            }}
                          >
                            <Person
                              style={{
                                color: "#9a9ea1",
                              }}
                            />
                          </div>
                          <div className="flex flex-column">
                            <span className="font-weight-medium">
                              {item.reviewer_name}
                            </span>
                            <div className="flex align-center">
                              {Array.from({ length: item.rating }, (_, i) => (
                                <StarOutline
                                  key={i}
                                  style={{
                                    color: "#9a9ea1",
                                    height: "20px",
                                    width: "20px",
                                  }}
                                />
                              ))}
                              <span
                                className="font-weight-medium"
                                style={{ fontWeight: "500", marginLeft: "8px" }}
                              >
                                {item.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-body text-secondary">
                          {new Date(item.updatedAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <span className="text-body text-secondary">
                        {item.comment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
