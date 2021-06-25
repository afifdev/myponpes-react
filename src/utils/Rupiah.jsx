import toRupiah from "@develoka/angka-rupiah-js";
const rupiah = (money) => {
  return toRupiah(money, {
    floatingPoint: 0,
    formal: false,
    symbol: "IDR",
  });
};

export default rupiah;
