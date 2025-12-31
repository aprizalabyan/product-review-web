import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../plugins/axios";
import StarOutline from "../assets/star-outline.svg?react";
import ImageOffOutline from "../assets/image-off-outline.svg?react";
import ArrowRight from "../assets/arrow-right.svg?react";
import Person from "../assets/person.svg?react";
import Pencil from "../assets/pencil.svg?react";
import Trash from "../assets/trash.svg?react";

const MainPage = () => {
  const { user, logout } = useAuth();
  const [productData, setProductData] = useState([]);
  const [openReview, setOpenReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewData, setReviewData] = useState({
    average_rating: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState({
    product: true,
    review: true,
    submit: false,
    delete: false,
  });
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [formType, setFormType] = useState("add");
  const [selectedReview, setSelectedReview] = useState(null);

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

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedProduct(null);
    setReviewData({ average_rating: 0, reviews: [] });
    setNewRating(0);
    setNewComment("");
  };

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

  useEffect(() => {
    if (openReview && selectedProduct?.id) {
      fetchReview(selectedProduct?.id);
    }
  }, [openReview, selectedProduct?.id]);

  const handleSubmitReview = async () => {
    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      if (formType === "edit") {
        await api({
          method: "put",
          url: `/product-review-api/reviews/${selectedReview.id}`,
          data: {
            rating: newRating,
            comment: newComment,
          },
        });
      } else {
        await api({
          method: "post",
          url: `/product-review-api/reviews/${selectedProduct.id}`,
          data: {
            rating: newRating,
            comment: newComment,
          },
        });
      }

      setTimeout(() => {
        resetFormState();
        fetchProduct();
        fetchReview(selectedProduct.id);
      }, 800);
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleEditReview = (review) => {
    setFormType("edit");
    setSelectedReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment);
  };

  const handleDeleteReview = async (review_id) => {
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      await api({
        method: "delete",
        url: `/product-review-api/reviews/${review_id}`,
      });

      setTimeout(() => {
        fetchProduct();
        fetchReview(selectedProduct.id);
      }, 800);
    } catch (error) {
      console.error("Failed to delete review", error);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const resetFormState = () => {
    setFormType("add");
    setNewRating(0);
    setNewComment("");
    setSelectedReview(null);
  };

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
            <div
              className="flex"
              style={{
                gap: "12px",
                flexWrap: "wrap",
                maxHeight: "80vh",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
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
                  {item.average_rating > 0 ? (
                    <div className="rating-wrapper">
                      <StarOutline
                        style={{
                          color: "#9a9ea1",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                      <span className="rating">
                        {item.average_rating?.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span
                      className="text-body text-secondary"
                      style={{ fontStyle: "italic" }}
                    >
                      No rating yet
                    </span>
                  )}
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
                    {reviewData.average_rating?.toFixed(1)}
                  </span>
                  <span className="text-body text-secondary">
                    Based on {reviewData.reviews.length} reviews
                  </span>
                </div>
                <hr style={{ width: "25%", opacity: "0.4" }} />
                <div
                  className="flex flex-column"
                  style={{
                    gap: "16px",
                    maxHeight: "calc(40vh)",
                    overflowY: "auto",
                    paddingRight: "8px",
                  }}
                >
                  {!reviewData.reviews.length ? (
                    <span className="text-body text-secondary">
                      There is no review yet.
                    </span>
                  ) : (
                    reviewData.reviews.map((item, index) => (
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
                                  style={{
                                    fontWeight: "500",
                                    marginLeft: "8px",
                                  }}
                                >
                                  {item.rating?.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-column">
                            {item.isEditable && (
                              <div
                                className="flex justify-end"
                                style={{ gap: "8px" }}
                              >
                                <span title="Edit">
                                  <Pencil
                                    style={{
                                      color: "#9a9ea1",
                                      height: "18px",
                                      width: "18px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleEditReview(item)}
                                  />
                                </span>
                                <span title="Delete">
                                  <Trash
                                    style={{
                                      color: "#9a9ea1",
                                      height: "18px",
                                      width: "18px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDeleteReview(item.id)}
                                  />
                                </span>
                              </div>
                            )}
                            <span className="text-body text-secondary">
                              {new Date(item.updatedAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                        </div>
                        <span className="text-body text-secondary">
                          {item.comment}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <hr style={{ width: "25%", opacity: "0.4" }} />
                <div className="flex flex-column" style={{ gap: "12px" }}>
                  <span
                    className="font-weight-medium"
                    style={{ textTransform: "capitalize" }}
                  >
                    {formType} Review
                  </span>
                  <div className="flex align-center" style={{ gap: "2px" }}>
                    <span className="text-body" style={{ marginRight: "8px" }}>
                      Rating:
                    </span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarOutline
                        key={i}
                        style={{
                          color: i < newRating ? "#ffd700" : "#9a9ea1",
                          height: "24px",
                          width: "24px",
                          cursor: "pointer",
                        }}
                        onClick={() => setNewRating(i + 1)}
                      />
                    ))}
                  </div>
                  <textarea
                    id="input-review"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your review here..."
                    rows={4}
                    style={{
                      backgroundColor: "#34393d",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  />
                  <div className="flex justify-end" style={{ gap: "4px" }}>
                    {formType === "edit" && (
                      <button className="secondary" onClick={resetFormState}>
                        Cancel
                      </button>
                    )}
                    <button
                      className="primary"
                      onClick={handleSubmitReview}
                      disabled={
                        newRating === 0 || !newComment.trim() || loading.submit
                      }
                    >
                      Submit
                    </button>
                  </div>
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
