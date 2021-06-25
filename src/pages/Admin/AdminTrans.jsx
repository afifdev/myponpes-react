import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Input, PrimaryBtn } from "../../components/atomics";
import { Card, Container, Header, SmallCard } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
import { EmptyTrans } from "../../assets/images";
import rupiah from "../../utils/Rupiah";

const AdminTrans = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [isDebit, setIsDebit] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [isSearch, setIsSearch] = useState(false);
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

  const getTransactions = async () => {
    try {
      const query = isSearch
        ? `admin/transaction?currentPage=${currentPage}&title=${searchVal}`
        : `admin/transaction?currentPage=${currentPage}`;
      const { data } = await axios.get(query, config);
      if (!data.errors) {
        setNext(data.next);
        setPrev(data.prev);
        setPagesCount(Math.ceil(data.dataLength / 15));
        setTotalData(data.dataLength);
        return setTransactions(data.data);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const createPayment = async (e) => {
    try {
      e.preventDefault();
      // eslint-disable-next-line
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
      setRefresh(!refresh);
      console.log(err);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearch(!isSearch);
  };

  useEffect(() => {
    getTransactions();
    //eslint-disable-next-line
  }, [refresh, currentPage, isSearch]);

  return (
    <Container>
      <Header title="Transaction" desc="See all stuff related to transaction" />
      <div className="grid grid-cols-4 grid-rows-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="col-span-3 flex flex-col">
          <form className="flex" onSubmit={handleSearch}>
            <Input
              placeholder="Search on title of transaction"
              value={searchVal}
              onChange={handleSearchChange}
            />
            <div className="w-4"></div>
            <PrimaryBtn type="submit">Search</PrimaryBtn>
          </form>
          {transactions.length > 0 ? (
            <>
              <div className="flex-1">
                <div className="grid grid-cols-5 gap-4 sm:gap-8 my-4 sm:my-8">
                  {transactions.map((transaction) => {
                    return (
                      <SmallCard key={transaction._id} flow="border-2">
                        <p className="text-lg font-bold text-gray-500">
                          {transaction.is_debit ? "Debit" : "Kredit"}
                        </p>
                        <p>{transaction.title}</p>
                        <p>{rupiah(transaction.amount)}</p>
                        <p>{transaction.date.split("T")[0]}</p>
                        <p>{transaction.ref_code ?? "-"}</p>
                      </SmallCard>
                    );
                  })}
                </div>
              </div>

              <div className="py-2">
                <p className="text-center">{`${totalData} data`}</p>
                <p className="text-center">{`Showing page ${currentPage} of ${pagesCount}`}</p>
              </div>
              <div className="flex justify-center items-center">
                <PrimaryBtn equal disabled={!prev} onClick={handlePrevPage}>
                  Previous
                </PrimaryBtn>
                <div className="mx-2"></div>
                <PrimaryBtn equal disabled={!next} onClick={handleNextPage}>
                  Next
                </PrimaryBtn>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <EmptyTrans />
              <p>There is no transactions here</p>
              <p>Try to create one!</p>
            </div>
          )}
        </Card>
        <Card>
          <p className="text-md sm:text-2xl font-bold">Transaction</p>
          <p className="mb-8">Let's create our new transaction!</p>
          <form onSubmit={createPayment}>
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
            <div>
              <PrimaryBtn type="submit">Add Transaction</PrimaryBtn>
              {isError ? <p className="mt-2">{errorMsg}</p> : ""}
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
};

export default AdminTrans;
