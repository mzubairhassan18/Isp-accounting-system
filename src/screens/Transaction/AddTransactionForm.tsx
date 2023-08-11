import React, { useState } from "react";
import { AutoComplete, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "features/transaction/transactionSlice"; // Assuming you have a custom addTransaction thunk action for transactions
import AddListForm, { FormInput } from "components/AddListForm";
import { RootState } from "/store";

interface Transaction {
  id: string;
  debit_ac: number | null;
  credit_ac: number | null;
  amount: number | null;
  desc: string | null;
  date: string | null;
}

const AddTransactionForm: React.FC = () => {
  const dispatch = useDispatch();

  const [debitAccountValue, setDebitAccountValue] = useState<
    string | undefined
  >(undefined);
  const [creditAccountValue, setCreditAccountValue] = useState<
    string | undefined
  >(undefined);

  const accounts = useSelector((state: RootState) => state.account.accounts);
  // Define your options for debit_ac, credit_ac, or any other field related to transactions
  const getAccountsOptions1 = (): { value: string; label: string }[] => {
    return accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  };
  const getAccountsOptions = (
    selectedAccountId?: string
  ): { value: string; label: string }[] => {
    return accounts
      .filter((account) => account.id !== selectedAccountId)
      .map((account) => ({
        value: account.id,
        label: account.name,
      }));
  };

  const transactionFormInputs: FormInput[] = [
    {
      name: "debit_ac",
      label: "Debit Account",
      rules: [{ required: false }],
      inputElement: (
        <Select
          showSearch
          placeholder="Select Debite A/C"
          optionFilterProp="label"
          options={getAccountsOptions(creditAccountValue)}
          value={debitAccountValue}
          onChange={(value) => setDebitAccountValue(value)}
        ></Select>
      ),
    },
    {
      name: "credit_ac",
      label: "Credit Account",
      rules: [{ required: false }],
      inputElement: (
        <Select
          showSearch
          placeholder="Select Credit A/C"
          optionFilterProp="label"
          options={getAccountsOptions(debitAccountValue)}
          value={creditAccountValue}
          onChange={(value) => setCreditAccountValue(value)}
        />
      ),
    },
    {
      name: "amount",
      label: "Amount",
      rules: [{ required: true, message: "Please enter an amount" }],
      inputElement: <Input type="number" />,
    },
    {
      name: "desc",
      label: "Description",
      rules: [{ required: false }],
      inputElement: <Input.TextArea />,
    },
    {
      name: "date",
      label: "Date",
      rules: [{ required: false }],
      inputElement: <Input type="date" />,
    },
  ];

  return (
    <>
      <AddListForm
        entityName="transaction"
        entityLabel="Transaction"
        formInputs={transactionFormInputs}
        addEntityAction={addTransaction}
      />
    </>
  );
};

export default AddTransactionForm;
