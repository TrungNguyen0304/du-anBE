import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = JSON.parse(localStorage.getItem("user"));
    if (isLoggedIn === "true" && user) {
      if (user.role === "company") navigate("/", { replace: true });
      else if (user.role === "leader") navigate("/", { replace: true });
      else if (user.role === "member")
        navigate("/", { replace: true });
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
      password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("http://localhost:8001/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại");

        const token = data.token;
        if (!token) throw new Error("Không nhận được token từ server.");

        const profileRes = await fetch(
          "http://localhost:8001/api/protected/profile",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profileData = await profileRes.json();
        if (!profileRes.ok)
          throw new Error(
            profileData.message || "Lấy thông tin người dùng thất bại."
          );

        const user = profileData.user;
        if (
          user.role !== "company" &&
          user.role !== "leader" &&
          user.role !== "member"
        ) {
          throw new Error("Bạn không có quyền truy cập vào hệ thống.");
        }

        // Lưu thông tin
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setError(null);

        // Điều hướng dựa theo role
        if (user.role === "company") navigate("/", { replace: true });
        else if (user.role === "leader") navigate("/", { replace: true });
        else if (user.role === "member")
          navigate("/", { replace: true });
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Đăng Nhập
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              placeholder="example@gmail.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded`}
              placeholder="********"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
              formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {formik.isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
