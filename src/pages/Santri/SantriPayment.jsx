import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { EmptyTrans } from "../../assets/images";
import { Input, PrimaryBtn } from "../../components/atomics";
import { Card, Container, Header, SmallCard } from "../../components/moleculs";
import { UserContext } from "../../context/UserContext";
import rupiah from "../../utils/Rupiah";

const SantriPayment = () => {
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
  const [paymentId, setPaymentId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [image, setImage] = useState(null);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearch(!isSearch);
  };

  const getPayments = async () => {
    try {
      const query = searchVal
        ? `santri/payment?title=${searchVal}`
        : "santri/payment";
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
        const { data } = await axios.get(`santri/payment/${paymentId}`, config);
        if (!data.errors) {
          return setPayment(data.data);
        }
        console.log(data.errors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const markComplete = async (e) => {
    try {
      const form = new FormData();
      form.append("image", image);
      const { data } = await axios.put(
        `santri/payment/${paymentId}`,
        form,
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

  useEffect(() => {
    getPayments();
    // eslint-disable-next-line
  }, [refresh, isSearch]);

  useEffect(() => {
    getPayment();
    // eslint-disable-next-line
  }, [paymentId, refresh]);

  return (
    <Container>
      <Header title="Payment" desc="See all of your payments here!" />
      <div className="grid grid-cols-4 gap-4 sm:gap-8 mb-4 sm:mb-8">
        <Card flow="col-span-3 flex flex-col">
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
                            {payment.is_complete ? "Accepted" : "Waiting"}
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
          {payment ? (
            <div className="flex-1">
              <p className="text-md sm:text-xl font-bold">{payment.title}</p>
              <p>{rupiah(payment.amount)}</p>
              <p>{payment.santri_name}</p>
              <p>{payment.is_complete ? "Accepted" : "Waiting"}</p>
              {payment.image ? (
                <img
                  src={`http://localhost:4000/${payment.image}`}
                  className="w-48 h-48 rounded-xl object-cover"
                  alt="imageofpayment"
                />
              ) : image ? (
                <>
                  <img
                    src={URL.createObjectURL(image)}
                    className="w-48 h-48 rounded-xl object-cover"
                    alt="imageofpayment"
                  />
                  <div className="my-4">
                    <label htmlFor="image">Select your file</label>
                    <br />
                    <Input type="file" onChange={handleImage} />
                  </div>
                </>
              ) : (
                <div className="my-4">
                  <label htmlFor="image">Select your file</label>
                  <br />
                  <Input type="file" onChange={handleImage} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <p>Select one of transasctions</p>
            </div>
          )}
          {paymentId ? (
            <div>
              <PrimaryBtn
                disabled={payment ? payment.image : false}
                onClick={markComplete}
              >
                Mark as complete
              </PrimaryBtn>
            </div>
          ) : (
            ""
          )}
        </Card>
      </div>
    </Container>
  );
};

export default SantriPayment;
