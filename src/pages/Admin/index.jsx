import { useContext, useEffect, useState } from "react";
import { MoneySVG, RArrowSVG } from "../../assets/icons";
import { ChartLine, Card, Container, Header } from "../../components/moleculs";
import { Input, PrimaryBtn, PrimaryLinkBtn } from "../../components/atomics";
import { UserContext } from "../../context/UserContext";
import { EmptyAccount } from "../../assets/images";
import rupiah from "../../utils/Rupiah";
import axios from "axios";

const Admin = () => {
  const [accounts, setAccounts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [isDebit, setIsDebit] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isError, setIsError] = useState(false);
  const { user } = useContext(UserContext);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleIsDebit = (e) => {
    setIsDebit(parseInt(e.target.value));
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const getAccounts = async () => {
    try {
      const { data } = await axios.get("admin/balance", config);
      if (data.errors) {
        setAccounts([]);
      } else {
        setAccounts(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTransactions = async () => {
    try {
      const { data } = await axios.get("admin/transaction", config);
      if (!data.errors) {
        return setTransactions(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const getPayments = async () => {
    try {
      const { data } = await axios.get("admin/payment", config);
      if (!data.errors) {
        return setPayments(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const createTransaction = async (e) => {
    try {
      setIsError(false);
      e.preventDefault();
      const { data } = await axios.post(
        "admin/transaction",
        { title, amount, is_debit: isDebit },
        config
      );
      if (data.errors) {
        setIsError(true);
        setErrorMsg(data.errors);
      }
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAccounts();
    getPayments();
    getTransactions();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <Container>
      <Header title="Overview" desc="See everythings here!" />
      <div className="grid grid-cols-4 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="col-span-3">
          <div className="flex flex-col h-full">
            <p className="text-md sm:text-2xl font-bold">Account</p>
            <p className="mb-8">Showing chart of your recent account history</p>
            {accounts.length > 0 ? (
              <ChartLine isBalance data={accounts} />
            ) : (
              <div className="flex flex-col items-center">
                <EmptyAccount />
                <p>Ups, No Account found!</p>
              </div>
            )}
          </div>
        </Card>
        <Card>
          <p className="text-md sm:text-2xl font-bold">Transaction</p>
          <p className="mb-8">Let's create our new transaction!</p>
          <form onSubmit={createTransaction}>
            <div>
              <label htmlFor="title">Title</label>
              <br />
              <Input
                placeholder="Transaction title"
                value={title}
                onChange={handleTitle}
              />
            </div>
            <br />
            <div>
              <label htmlFor="amount">Amount</label>
              <br />
              <Input
                placeholder="Amount"
                value={amount}
                onChange={handleAmount}
              />
            </div>
            <br />
            <div className="flex items-center">
              <input
                type="radio"
                name="is_debit"
                value={1}
                onChange={handleIsDebit}
                checked={isDebit}
              />
              <p className="ml-1">Debit</p>
            </div>
            <div className="flex items-center my-2">
              <input
                type="radio"
                name="is_debit"
                value={0}
                onChange={handleIsDebit}
                checked={!isDebit}
              />
              <p className="ml-1">Kredit</p>
            </div>
            <PrimaryBtn type="submit">Add Transaction</PrimaryBtn>
            {isError ? <p className="mt-2">{errorMsg}</p> : ""}
          </form>
        </Card>
      </div>
      <div className="grid grid-cols-4 gap-4 sm:gap-8">
        <Card flow="col-span-2">
          <div className="flex flex-col h-full">
            <p className="text-md sm:text-2xl font-bold mb-4">
              Current Balance
            </p>
            <div className="flex-1 flex items-center">
              <div className="flex items-center justify-between">
                <div className="p-4 inline-block rounded-full bg-blue-200 mr-4">
                  <MoneySVG isContent />
                </div>
                <p className="text-4xl">
                  {accounts.length > 0
                    ? rupiah(accounts[accounts.length - 1].balance)
                    : "IDR 0"}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="mb-8 flex justify-between items-center">
            <p className="text-md sm:text-2xl font-bold">Latest Payments</p>
            <PrimaryLinkBtn to="/payments" compact>
              <RArrowSVG />
            </PrimaryLinkBtn>
          </div>
          {payments.length > 0 ? (
            payments.slice(0, 2).map((payment) => {
              return (
                <div className="my-2 rounded-lg py-4" key={payment._id}>
                  <p className="text-lg">{payment.title}</p>
                  <p className="text-gray-500">{rupiah(payment.amount)}</p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col justify-center items-center">
              <EmptyAccount />
              <p>Payment still empty :(</p>
            </div>
          )}
        </Card>
        <Card>
          <div className="mb-8 flex justify-between items-center">
            <p className="text-md sm:text-2xl font-bold">Latest Transactions</p>
            <PrimaryLinkBtn to="/transactions" compact>
              <RArrowSVG />
            </PrimaryLinkBtn>
          </div>
          {transactions.length > 0 ? (
            transactions.slice(0, 2).map((transaction) => {
              return (
                <div className="my-2 rounded-lg py-4" key={transaction._id}>
                  <p className="text-lg">{transaction.title}</p>
                  <p className="text-gray-500">{rupiah(transaction.amount)}</p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col justify-center items-center">
              <EmptyAccount />
              <p>No transaction here, try to create one!</p>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
};

export default Admin;
