import { useContext, useEffect, useState } from "react";
import { Input, PrimaryBtn, SecondaryBtn } from "../../components/atomics";
import { EmptyTrans } from "../../assets/images";
import { Container, Header, Card, SmallCard } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
import rupiah from "../../utils/Rupiah";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
const AdminPayment = () => {
  const { user } = useContext(UserContext);
  const [searchVal, setSearchVal] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(null);
  const [open, setOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [image, setImage] = useState("");
  const [newPayment, setNewPayment] = useState({
    title: "",
    amount: "",
    santri_id: "",
  });
  const [refresh, setRefresh] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleNewPaymentTitle = (e) => {
    setNewPayment({ ...newPayment, title: e.target.value });
  };

  const handleNewPaymentAmount = (e) => {
    setNewPayment({ ...newPayment, amount: e.target.value });
  };

  const handleNewPaymentSantriId = (e) => {
    setNewPayment({ ...newPayment, santri_id: e.target.value });
  };

  const insertPayment = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("admin/payment", newPayment, config);
      if (!data.errors) {
        console.log(data.dat);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPayments = async () => {
    try {
      const query = searchVal
        ? `admin/payment?title=${searchVal}`
        : "admin/payment";
      const { data } = await axios.get(query, config);
      if (!data.errors) {
        setNext(data.next);
        setPrev(data.prev);
        setPagesCount(Math.ceil(data.dataLength / 15));
        setTotalData(data.dataLength);
        return setPayments(data.data);
      }
      console.log(data.errors);
      setIsSearch(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getPayment = async () => {
    try {
      if (paymentId || paymentId !== "") {
        const { data } = await axios.get(`admin/payment/${paymentId}`, config);
        if (!data.errors) {
          return setPayment(data.data);
        }
        console.log(data.errors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const markComplete = async () => {
    try {
      const { data } = await axios.put(
        `admin/payment/${paymentId}/verify`,
        {},
        config
      );
      if (!data.errors) {
        return setRefresh(!refresh);
      }
      console.log(data.errors);
    } catch (err) {
      console.log(err);
    }
  };

  const rejectPayment = async () => {
    try {
      if (payment && payment.image && !payment.is_complete) {
        const { data } = await axios.put(
          `admin/payment/${paymentId}/reject`,
          { s: "s" },
          config
        );
        if (!data.errors) {
          return setRefresh(!refresh);
        }
        console.log(data.errors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearch(!isSearch);
  };

  useEffect(() => {
    getPayments();
    // eslint-disable-next-line
  }, [refresh, isSearch]);

  useEffect(() => {
    getPayment();
    // eslint-disable-next-line
  }, [paymentId, refresh]);

  const onCloseModal = () => setOpen(false);

  const onOpenModal = (e) => {
    setImage(e);
    setOpen(true);
  };

  return (
    <Container>
      <Header title="Payment" desc="See all payments here!" />
      <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="col-span-2 flex flex-col">
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-between"
          >
            <p className="text-md sm:text-2xl font-bold whitespace-nowrap">
              Payment
            </p>
            <div className="flex">
              <Input
                placeholder="Payment Title"
                value={searchVal}
                onChange={handleSearchChange}
              />
              <div className="w-4"></div>
              <PrimaryBtn type="submit">Search</PrimaryBtn>
            </div>
          </form>
          <div className="flex-1">
            {payments.length > 0 ? (
              <div className="grid grid-cols-5 grid-rows-3 gap-4 sm:gap-8 my-4 sm:my-8">
                {payments.map((payment) => {
                  return (
                    <SmallCard
                      onClick={() => setPaymentId(payment._id)}
                      flow="border-2 cursor-pointer transform hover:scale-105 transition duration-200 ease-in-out"
                      key={payment._id}
                    >
                      <div className="flex">
                        <div className="min-w-0">
                          <p className="text-lg">{payment.title}</p>
                          <p className="font-bold text-gray-500">
                            {rupiah(payment.amount)}
                          </p>
                          <p className="font-bold text-gray-500">
                            {payment.is_complete ? "Complete" : "Not Complete"}
                          </p>
                        </div>
                      </div>
                    </SmallCard>
                  );
                })}
              </div>
            ) : (
              <div className="w-100 flex flex-col justify-center items-center">
                <EmptyTrans />
                <p>No payments , try to create one!</p>
              </div>
            )}
          </div>
          {payments.length > 0 ? (
            <>
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
            ""
          )}
        </Card>
        <Card flow="flex flex-col">
          <p className="text-md sm:text-2xl font-bold">Payment detail</p>
          <p className="mb-8">See the payment details here!</p>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            showCloseIcon={false}
            classNames={{
              modal: "rounded-2xl w-100 max-w-screen p-0 m-0",
            }}
          >
            <img
              src={`http://localhost:4000/${image}`}
              className="w-full h-full rounded-xl"
              alt="imageofproof"
            />
          </Modal>
          {payment ? (
            <div className="flex-1">
              <p className="text-md sm:text-xl font-bold">{payment.title}</p>
              <p>{rupiah(payment.amount)}</p>
              <p>{payment.santri_name}</p>
              <p>{payment.is_complete ? "Completed" : "Not Completed"}</p>
              {payment.image ? (
                <img
                  src={`http://localhost:4000/${payment.image}`}
                  className="w-48 h-48 rounded-xl object-cover cursor-pointer"
                  onClick={() => onOpenModal(payment.image)}
                  alt="imageofpayment"
                />
              ) : (
                "No Image"
              )}
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <p>Select one of transasctions</p>
            </div>
          )}
          {paymentId ? (
            <div className="flex justify-between items-center">
              <div>
                <PrimaryBtn
                  disabled={payment ? payment.is_complete : false}
                  onClick={markComplete}
                >
                  Mark as complete
                </PrimaryBtn>
              </div>
              <div className="mx-4 flex-1">
                <SecondaryBtn
                  disabled={
                    payment ? !payment.image || payment.is_complete : false
                  }
                  flow="ml-4"
                  onClick={rejectPayment}
                >
                  Reject this!
                </SecondaryBtn>
              </div>
            </div>
          ) : (
            ""
          )}
        </Card>
        <Card flow="flex flex-col">
          <p className="text-md sm:text-2xl font-bold">Create payment</p>
          <p className="mb-8">Your money comes here!</p>
          <form onSubmit={insertPayment} className="flex-1 flex flex-col">
            <div className="flex-1">
              <div>
                <label htmlFor="title">Title</label>
                <br />
                <Input
                  placeholder="Title"
                  value={newPayment.title}
                  onChange={handleNewPaymentTitle}
                />
              </div>
              <br />
              <div>
                <label htmlFor="amount">Amount</label>
                <br />
                <Input
                  placeholder="Amount"
                  value={newPayment.amount}
                  onChange={handleNewPaymentAmount}
                />
              </div>
              <br />
              <div>
                <label htmlFor="santri_id">Santri Id</label>
                <br />
                <Input
                  placeholder="Santri Id"
                  value={newPayment.santri_id}
                  onChange={handleNewPaymentSantriId}
                />
              </div>
            </div>
            <br />
            <div>
              <PrimaryBtn type="submit">Add Payment!</PrimaryBtn>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
};

export default AdminPayment;
