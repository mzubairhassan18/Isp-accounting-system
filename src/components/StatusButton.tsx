import React from "react";
import { Typography } from "antd";

const StatusButton = ({ isActive }) => (
  <Typography.Text
    strong
    style={{
      background: isActive ? "#00be13cf" : "#d3d3d3",
      color: "white",
      padding: "10px",
      borderRadius: "8px",
    }}
  >
    {isActive ? "Active" : "Inactive"}
  </Typography.Text>
);

export default StatusButton;
