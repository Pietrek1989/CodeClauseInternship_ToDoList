// ResetPasswordPage.js
import React, { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "./useFetch";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await resetPassword(newPassword, token);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Password reset successful");
    }
  };

  return (
    <section className="flex items-center justify-center p-5 my-auto">
      <div className="form d-flex flex-column align-items-center justify-content-center">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="mt-2 d-flex flex-column justify-center">
            <label className="text-center fs-2 ">New Password:</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className="w-full p-2 rounded-lg mt-2 border rounded-2 focus:border-blue-500 flex focus-ring"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="text-center mt-4">
            <button
              type="submit"
              className="add-task-button text-white rounded p-2"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
