import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import {
  fetchConnections,
  Connection,
} from "features/connection/connectionSlice"; // Assuming you have the relevant actions and types for connections

import AddConnectionForm from "./AddConnectionForm";
import ConnectionListTable from "./ConnectionListTable";
import { fetchPackages } from "features/package/packageSlice";
import { fetchUsers } from "features/user/userSlice";
import { Button } from "antd";
import SendEmailButton from "components/SendEmailButton";

const ConnectionPage: React.FC = () => {
  // Assuming you have stored connections data in Redux store
  const connections: Connection[] = useSelector(
    (state: RootState) => state.connection.connections
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchConnections action
    dispatch(fetchConnections());
    dispatch(fetchPackages());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <h1>Connection List</h1>
      <AddConnectionForm />
      <div>
        <h1>Send Email</h1>
        <SendEmailButton
          recipient="mzubairhassan18@gmail.com"
          subject="Hello from Nodemailer"
          text="This is the email body."
        />
      </div>
      <ConnectionListTable connections={connections} />
    </div>
  );
};

export default ConnectionPage;
